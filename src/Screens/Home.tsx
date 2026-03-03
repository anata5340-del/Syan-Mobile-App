import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import HomeCard from '../Components/CardHome';
import CompleteYourProfileModal from '../Components/ModalCompleteYourProfile';
import { useAuthStore } from "../stores/auth.store";
import {
  useVideoStatuses,
  useNoteStatuses,
  useQuizStatuses
} from '../hooks/react-query/useFavorites';
import { useUserSubscriptions } from '../hooks/react-query/useSubscriptions';
import { calculateProfileProgress, isProfileComplete } from '../utils/profileProgress';
import { getToken } from '../utils/token';
import { useRefreshHandler } from '../utils/refreshUtils';
import { NoteStatus, QuizStatus, VideoStatus } from '../api/favorites.services';
import { parseVideoStatusUrl } from '../utils/parseVideoStatusUrl';
import { parseNoteStatusUrl } from '../utils/parseNoteStatusUrl';
import { parseQuizStatusUrl } from '../utils/parseQuizStatusUrl';
import { parse } from 'zod';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation, route }: HomeScreenProps) => {


  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const progressPercentage = calculateProfileProgress(user);
  const [isVisible, setIsVisible] = useState(progressPercentage < 100);
  const [isCompleteProfileModalVisible, setCompleteProfileModalVisible] = useState(progressPercentage < 100);


  //showing the subscription details
  const userId = user?._id;

  const { data: subscriptionRes, isLoading: subscriptionLoading } =
    useUserSubscriptions(userId);

  const activeSubscription = useMemo(() => {
    const pkgs = subscriptionRes?.data?.pkgs || [];
    return pkgs.find((pkg: any) => pkg.active);
  }, [subscriptionRes]);

  // Fetch statuses using hooks
  const { data: quizStatuses, isLoading: quizLoading, refetch: refetchQuizzes } = useQuizStatuses();
  const { data: videoStatuses, isLoading: videoLoading, refetch: refetchVideos } = useVideoStatuses();
  const { data: noteStatuses, isLoading: noteLoading, refetch: refetchNotes } = useNoteStatuses();

  // Pull to refresh handler
  const onRefreshData = async () => {
    await Promise.all([
      refetchQuizzes(),
      refetchVideos(),
      refetchNotes(),
    ]);
  };
  const { isRefreshing, handleRefresh } = useRefreshHandler(onRefreshData);

  console.log('Quiz Statuses:', quizStatuses ? quizStatuses.length : 0);
  console.log('Video Statuses:', videoStatuses ? videoStatuses.length : 0);
  console.log('Note Statuses:', noteStatuses ? noteStatuses.length : 0);

  // Helper function to calculate progress from content array
  const calculateProgress = (content: any[]) => {
    if (!content || content.length === 0) return 0;
    const completed = content.filter(item => item.completed).length;
    return Math.round((completed / content.length) * 100);
  };

  // Get latest 2 items for each category
  const latestQuizzes = useMemo(() => {
    if (!quizStatuses || quizStatuses.length === 0) return [];
    return [...quizStatuses]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2);
  }, [quizStatuses]);

  const latestVideos = useMemo(() => {
    if (!videoStatuses || videoStatuses.length === 0) return [];
    return [...videoStatuses]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2);
  }, [videoStatuses]);

  const latestNotes = useMemo(() => {
    if (!noteStatuses || noteStatuses.length === 0) return [];
    return [...noteStatuses]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2);
  }, [noteStatuses]);

  const handleCardVisible = () => {
    setIsVisible(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };


  //Profile Progress Calculation

  // Navigate to specific quiz/video/note with ID
  const handleQuizNavigation = (quiz: QuizStatus) => {
    const quizName = quiz.quizName || 'Quiz';
    const parsed = quiz.url ? parseQuizStatusUrl(quiz.url, quizName) : null;
    if (parsed) {
      navigation.navigate('QuizWarning', {
        type: parsed.type,
        quizId: parsed.quizId,
        quizName: parsed.quizName,
        paperId: parsed.paperId,
        topicId: parsed.topicId,
        limit: parsed.limit,
        estimatedQuestions: parsed.estimatedQuestions,
        durationSeconds: parsed.durationSeconds,
        courseId: parsed.courseId,
        moduleId: parsed.moduleId,
        sectionId: parsed.sectionId,
        subSectionId: parsed.subSectionId,
        questionIds: parsed.questionIds,
      });
    } else {
      navigation.navigate('QuizWarning', {
        quizId: quiz._id,
        quizName: quiz.quizName,
        type: 'custom',
      });
    }
  };

  const handleVideoNavigation = (video: VideoStatus) => {
    console.log("Video:", video);
    const parsed = video.url ? parseVideoStatusUrl(video.url) : null;
    if (parsed) {
      navigation.navigate('Videos', {
        courseId: parsed.courseId,
        moduleId: parsed.moduleId,
        sectionId: parsed.sectionId,
        subSectionId: parsed.subSectionId,
        subSectionBlockId: parsed.subSectionBlockId,
        blockName: parsed.blockName ?? video.videoName,
      });
    }
    // navigation.navigate('Videos', { videoId });
  };

  const handleNoteNavigation = (note: NoteStatus) => {
    const parsed = note.url ? parseNoteStatusUrl(note.url) : null;
    console.log("Parsed Note:", parsed);
    if (parsed) {
      navigation.navigate('Notes', {
        courseId: parsed.courseId,
        moduleId: parsed.moduleId,
        sectionId: parsed.sectionId,
        subSectionId: parsed.subSectionId,
        subSectionBlockId: parsed.subSectionBlockId,
      });
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };



  //when user profile is complete hhide the modal
  useEffect(() => {
  if (progressPercentage === 100) {
    setCompleteProfileModalVisible(false);
  }
}, [progressPercentage]);


  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = await getToken();
      if (!token) {
        console.log('[Home] No token found, logging out');
        await logout();
      }
    };
    validateToken();
  }, [logout]);


  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <View style={{}}>
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 30, padding: 0, paddingTop: 18 },
          ]}>
          <View style={[GlobalStyleSheet.flex]}>
            <View>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 14,
                  color: COLORS.title,
                }}>
                Hi {user?.firstName || 'User'}, Good Day!
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.openDrawer()}
                style={[GlobalStyleSheet.background3, {}]}>
                <Image
                  style={[
                    GlobalStyleSheet.image3,
                    { tintColor: '#5F5F5F' },
                  ]}
                  source={IMAGES.gridHome}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleLogout}
                style={[GlobalStyleSheet.background3, {}]}>
                <Image
                  style={[
                    GlobalStyleSheet.image3,
                    { tintColor: '#5F5F5F' },
                  ]}
                  source={IMAGES.logout_icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.title}
          />
        }>
        <View
          style={[
            GlobalStyleSheet.container,
            { padding: 0, paddingHorizontal: 30, paddingTop: 11 },
          ]}>
          <View>
            <TextInput
              placeholder="Search"
              style={[
                styles.TextInput,
                { color: COLORS.title, backgroundColor: '#FAFAFA' },
              ]}
              placeholderTextColor={'#929292'}
            />
            <View style={{ position: 'absolute', top: 15, right: 20 }}>
              <FeatherIcon name="search" size={24} color={'#C9C9C9'} />
            </View>
          </View>
        </View>

        {/* Go Premium Section */}
        <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: "#CEEAFF",
            borderRadius: 10,
            paddingHorizontal: '6%',
            paddingVertical: "7%"
          }}>
            <View style={{ width: '52%' }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 17, color: COLORS.text }]}>Go Premium</Text>
              <Text style={[FONTS.fontRegular, { fontSize: 13, paddingVertical: '3%', color: COLORS.text }]}>Explore 100+ expert curated courses prepared for you.</Text>
              <TouchableOpacity style={{
                backgroundColor: "#FFFFFF",
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '4%',
                borderRadius: 22,
                padding: 5,
                shadowColor: 'black',
                shadowOffset: { height: 3, width: 3 },
                shadowOpacity: 0.2,
                elevation: 7
              }}>
                <Text style={{ color: '#227777' }}>Get Access</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image source={IMAGES.homeImage1} />
            </View>
          </View>
        </View>

        {/* Complete Profile Section */}
        {isVisible && (
          <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
            <View style={{
              backgroundColor: "#FFE5E8",
              borderRadius: 10,
              paddingHorizontal: '6%',
              paddingVertical: "7%"
            }}>
              <TouchableOpacity onPress={handleCardVisible}>
                <View style={{ justifyContent: 'flex-end', alignItems: "flex-end" }}>
                  <Image source={IMAGES.cross_icon} />
                </View>
              </TouchableOpacity>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
                <View>
                  <Image source={IMAGES.homeImage2} />
                </View>
                <View style={{ width: '53%' }}>
                  <Text style={[FONTS.fontSemiBold, { fontSize: 12, color: "#EF6A77" }]}>Complete Your Profile</Text>
                  <View style={{
                    height: 10,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 5,
                    marginVertical: 10,
                  }}>
                    <View style={{
                      height: '100%',
                      width: `${progressPercentage}%`,
                      backgroundColor: '#227777',
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: "center",
                      borderColor: '#227777'
                    }}>
                    </View>
                  </View>
                  <Text style={{
                    fontSize: 10,
                    color: '#227777',
                    textAlign: 'right',
                    marginBottom: 5,
                  }}>
                    Completed {progressPercentage}%
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{
                    backgroundColor: "#227777",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '4%',
                    borderRadius: 22,
                    padding: 5,
                    shadowColor: 'black',
                    shadowOffset: { height: 3, width: 3 },
                    shadowOpacity: 0.2,
                    elevation: 7
                  }}>
                    <Text style={{
                      ...FONTS.fontRegular,
                      fontSize: 14,
                      color: "#ffffff"
                    }}>Let's Do it</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Active Subscription Section */}
<View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
  <Text
    style={{
      ...FONTS.fontLight,
      fontSize: 24,
      color: "#227777",
    }}
  >
    Active Subscription
  </Text>
</View>

<View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
  {subscriptionLoading ? (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#227777" />
    </View>
  ) : activeSubscription ? (
    <View style={{ backgroundColor: "#F0F0F0", padding: "6%", borderRadius: 25 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: 'space-between',
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...FONTS.fontSemiBold,
            fontSize: 18,
            color: COLORS.text,
          }}
        >
          {activeSubscription.packageInfo?.name || 'Subscription'}
        </Text>

        <Text
          style={{
            ...FONTS.fontLight,
            fontSize: 18,
            color: "#227777",
          }}
        >
          Active
        </Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: '5%', gap: 9 }}>
        <Text
          style={{
            ...FONTS.fontLight,
            fontSize: 14,
            color: COLORS.text,
          }}
        >
          Expire At:
        </Text>

        <Text
          style={{
            ...FONTS.fontLight,
            fontSize: 14,
            color: COLORS.text,
          }}
        >
          {activeSubscription.endDate}
        </Text>
      </View>
    </View>
  ) : (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={[FONTS.fontRegular, { color: COLORS.text }]}>
        No active subscription
      </Text>
    </View>
  )}
</View>

        <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Subscriptions')} style={{ backgroundColor: "#227777", padding: "6%", borderRadius: 25 }}>
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
              <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: "white" }}>Other Courses</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* History Section Header */}
        <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
          <Text style={{
            ...FONTS.fontLight,
            fontSize: 24,
            color: "#01B067"
          }}>History</Text>
        </View>

        {/* Quiz History Section */}
        <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
          <View
            style={{
              backgroundColor: '#FFECDE',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#FFA1A1',
              padding: 10,
            }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 12 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 24, color: COLORS.text }]}>Quiz</Text>
            </View>

            {quizLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#227777" />
              </View>
            ) : latestQuizzes.length > 0 ? (
              <View>
                {latestQuizzes.map((quiz) => (
                  <HomeCard
                    key={quiz._id}
                    onPress={() => handleQuizNavigation(quiz)}
                    imageSource={IMAGES.quiz_image}
                    title={quiz.quizName || 'Quiz'}
                    startDate={formatDate(quiz.updatedAt)}
                    progress={quiz.progress || 0}
                  />
                ))}
              </View>
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={[FONTS.fontRegular, { color: COLORS.text }]}>No quiz history yet</Text>
              </View>
            )}

            {latestQuizzes.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('QuizHistory')}
                style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}
              >
                <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.text }]}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Video History Section */}
        <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
          <View style={{
            backgroundColor: "#FFE3E6",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#FF8794',
            padding: 10,
          }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 24, color: 'black' }]}>Video</Text>
            </View>

            {videoLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#227777" />
              </View>
            ) : latestVideos.length > 0 ? (
              <View>
                {latestVideos.map((video) => (
                  <HomeCard
                    key={video._id}
                    onPress={() => handleVideoNavigation(video)}
                    imageSource={IMAGES.video_icon}
                    title={video.videoName || 'Video'}
                    startDate={formatDate(video.updatedAt)}
                    progress={calculateProgress(video.content)}
                    leftSideColor='#FDC9CE'
                  />
                ))}
              </View>
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={[FONTS.fontRegular, { color: COLORS.text }]}>No video history yet</Text>
              </View>
            )}

            {latestVideos.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate("VideoHistory")}
                style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}
              >
                <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.text }]}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Notes History Section */}
        <View style={{ flexGrow: 1, paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={{
            backgroundColor: "#F5E1FF",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#D684FF',
            padding: 10,
          }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 24, color: 'black' }]}>Notes</Text>
            </View>

            {noteLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#227777" />
              </View>
            ) : latestNotes.length > 0 ? (
              <View>
                {latestNotes.map((note) => (
                  <HomeCard
                    key={note._id}
                    onPress={() => handleNoteNavigation(note)}
                    imageSource={IMAGES.notes_icon}
                    title={note.noteName || 'Note'}
                    startDate={formatDate(note.updatedAt)}
                    progress={calculateProgress(note.content)}
                    leftSideColor='#EECEFF'
                  />
                ))}
              </View>
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={[FONTS.fontRegular, { color: COLORS.text }]}>No notes history yet</Text>
              </View>
            )}

            {latestNotes.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate("NotesHistory")}
                style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}
              >
                <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.text }]}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Complete Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCompleteProfileModalVisible}
      >
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          position: 'relative',
        }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setCompleteProfileModalVisible(false)}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0,0,0,.3)',
            }}
          />
          <CompleteYourProfileModal
            laterPress={() => setCompleteProfileModalVisible(false)}
            doItPress={() => navigation.navigate('Profile')}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  TextInput: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.title,
    borderRadius: 61,
    paddingHorizontal: '20%',
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FAFAFA',
  },
});