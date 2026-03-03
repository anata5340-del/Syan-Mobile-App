import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import HomeCard from '../Components/CardHome';
import { 
  useAllFavorites, 
  useQuestionStatuses, 
  useVideoStatuses, 
  useNoteStatuses 
} from '../hooks/react-query/useFavorites';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Favorite'>;

const Favorite = ({ navigation, route }: HomeScreenProps) => {
  // Fetch all favorites and statuses
  const { data: favorites, isLoading: favoritesLoading } = useAllFavorites();
  const { data: questionStatuses = [] } = useQuestionStatuses();
  const { data: videoStatuses = [] } = useVideoStatuses();
  const { data: noteStatuses = [] } = useNoteStatuses();

  // Helper functions to calculate progress
  const calculateVideoProgress = (videoId: string) => {
    const status = videoStatuses.find((s: any) => s.videoId === videoId);
    if (!status?.content || status.content.length === 0) return 0;
    
    const completed = status.content.filter((item: any) => item.completed).length;
    return Math.round((completed / status.content.length) * 100);
  };

  const calculateNoteProgress = (noteId: string) => {
    const status = noteStatuses.find((s: any) => s.noteId === noteId);
    if (!status?.content || status.content.length === 0) return 0;
    
    const completed = status.content.filter((item: any) => item.completed).length;
    return Math.round((completed / status.content.length) * 100);
  };

  const getQuestionProgress = (questionId: string) => {
    const status = questionStatuses.find((s: any) => s.questionId === questionId);
    return status?.correct ? 100 : 0;
  };

  // Get date formatting
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently added';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Handle quiz card press - navigate to Question screen
  const handleQuizPress = (quiz: any) => {
    console.log(' favorite quiz:', quiz);
    
    // Determine quiz type from stored data
    const type = quiz.type || 'video'; // default to video if not specified
    
    const params: any = {
      type,
      duration: quiz.duration || 1800,
      quizName: quiz.quizName,
    };

    if (type === 'video') {
      params.courseId = quiz.courseId;
      params.moduleId = quiz.moduleId;
      params.sectionId = quiz.sectionId;
      params.subSectionId = quiz.subSectionId;
      params.questionIds = quiz.questionIds?.split(',') || [];
    } else if (type === 'library') {
      params.quizId = quiz.quizId;
      params.paperId = quiz.moduleId; // Stored in moduleId
    } else if (type === 'custom') {
      params.quizId = quiz.quizId;
      params.topicIds = quiz.questionIds; // Stored in questionIds
    }

    // navigation.navigate('Question', params);
  };

  // Handle video card press
  const handleVideoPress = (video: any) => {
    console.log(' favorite video:', video);
    
    // navigation.navigate('Videos', {
    //   courseId: video.courseId,
    //   moduleId: video.moduleId,
    //   sectionId: video.sectionId,
    //   subSectionId: video.subSectionId,
    //   blockId: video.blockId,
    //   videoId: video.video._id,
    // });
  };

  // Handle note card press
  const handleNotePress = (note: any) => {
    console.log(' favorite note:', note);
    
    // navigation.navigate('Notes', {
    //   courseId: note.courseId,
    //   moduleId: note.moduleId,
    //   sectionId: note.sectionId,
    //   subSectionId: note.subSectionId,
    //   blockId: note.blockId,
    //   noteId: note.note._id,
    // });
  };

  // Get first 2 items of each type
  const favoriteQuizzes = useMemo(() => {
    return favorites?.favouriteQuizes?.slice(0, 2) || [];
  }, [favorites]);

  const favoriteVideos = useMemo(() => {
    return favorites?.favouriteVideos?.slice(0, 2) || [];
  }, [favorites]);

  const favoriteNotes = useMemo(() => {
    return favorites?.favouriteNotes?.slice(0, 2) || [];
  }, [favorites]);

  if (favoritesLoading) {
    return (
      <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
        <MainHeader screenName="Favorite" drawarNavigation />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[FONTS.fontRegular, { marginTop: 16 }]}>Loading Favorites...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Favorite" drawarNavigation />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
          {/* quiz */}
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
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                <Text style={[FONTS.fontSemiBold, { fontSize: 24, color: COLORS.text }]}>
                  Quiz
                </Text>
              </View>

              {favoriteQuizzes.length > 0 ? (
                <>
                  {favoriteQuizzes.map((quiz: any, index: number) => (
                    <HomeCard
                      key={quiz._id || index}
                      onPress={() => handleQuizPress(quiz)}
                      imageSource={IMAGES.quiz_image}
                      title={quiz.quizName || 'Quiz'}
                      startDate={formatDate(quiz.createdAt)}
                      progress={getQuestionProgress(quiz.questionIds)}
                    />
                  ))}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('FavoriteQuiz')}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 10,
                    }}
                  >
                    <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.text }]}>
                      View all ({favorites?.favouriteQuizes?.length || 0})
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={[FONTS.fontRegular, { color: '#999' }]}>
                    No favorite quizzes yet
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* videos */}
          <View style={{ flexGrow: 1, paddingHorizontal: 15, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: '#FFE3E6',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#FF8794',
                padding: 10,
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                <Text style={[FONTS.fontSemiBold, { fontSize: 24, color: COLORS.text }]}>
                  Video
                </Text>
              </View>

              {favoriteVideos.length > 0 ? (
                <>
                  {favoriteVideos.map((video: any, index: number) => (
                    <HomeCard
                      key={video._id || index}
                      onPress={() => handleVideoPress(video)}
                      imageSource={IMAGES.video_icon}
                      title={video.video?.name || 'Video'}
                      startDate={formatDate(video.createdAt)}
                      progress={calculateVideoProgress(video.video?._id)}
                      leftSideColor="#FDC9CE"
                    />
                  ))}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('FavoriteVideos')}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 10,
                    }}
                  >
                    <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.text }]}>
                      View all ({favorites?.favouriteVideos?.length || 0})
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={[FONTS.fontRegular, { color: '#999' }]}>
                    No favorite videos yet
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* notes */}
          <View
            style={{
              flexGrow: 1,
              paddingHorizontal: 15,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: '#F5E1FF',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#D684FF',
                padding: 10,
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                <Text style={[FONTS.fontSemiBold, { fontSize: 24, color: COLORS.text }]}>
                  Notes
                </Text>
              </View>

              {favoriteNotes.length > 0 ? (
                <>
                  {favoriteNotes.map((note: any, index: number) => (
                    <HomeCard
                      key={note._id || index}
                      onPress={() => handleNotePress(note)}
                      imageSource={IMAGES.notes_icon}
                      title={note.note?.name || 'Note'}
                      startDate={formatDate(note.createdAt)}
                      progress={calculateNoteProgress(note.note?._id)}
                      leftSideColor="#EECEFF"
                    />
                  ))}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('FavoriteNotes')}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 10,
                    }}
                  >
                    <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.text }]}>
                      View all ({favorites?.favouriteNotes?.length || 0})
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={[FONTS.fontRegular, { color: '#999' }]}>
                    No favorite notes yet
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Favorite;