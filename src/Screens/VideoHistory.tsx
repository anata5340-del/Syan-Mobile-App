import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import HistoryCard from '../Components/HistoryCard';
import { useVideoStatuses } from '../hooks/react-query/useFavorites';
import { parseVideoStatusUrl } from '../utils/parseVideoStatusUrl';
import type { VideoStatus } from '../api/favorites.services';

type VideoHistoryProps = StackScreenProps<
  RootStackParamList,
  'VideoHistory'
>;

const VideoHistory = ({ navigation }: VideoHistoryProps) => {

  const { data: videoStatuses, isLoading, error } = useVideoStatuses();

  const calculateProgress = (content: any[]) => {
    if (!content || content.length === 0) return 0;
    const completed = content.filter(item => item.completed).length;
    return Math.round((completed / content.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleVideoPress = (video: VideoStatus) => {
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
    } else {
      navigation.navigate('VideoPlayer', { videoId: video.videoId || video._id });
    }
  };

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Video History" drawarNavigation />

      <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {/* ===== LOADING ===== */}
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[FONTS.fontRegular, { marginTop: 10 }]}>
                Loading video history...
              </Text>
            </View>
          ) : error ? (
            /* ===== ERROR ===== */
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <Text style={[FONTS.fontRegular, { color: 'red' }]}>
                Failed to load video history
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  marginTop: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  backgroundColor: COLORS.primary,
                  borderRadius: 8,
                }}
              >
                <Text style={[FONTS.fontRegular, { color: COLORS.white }]}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          ) : videoStatuses && videoStatuses.length > 0 ? (
            /* ===== DATA ===== */
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                gap: 7,
                flexWrap: 'wrap',
                flexShrink: 1,
                marginBottom: '45%',
              }}
            >
              {videoStatuses
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .map(video => (
                  <HistoryCard
                    key={video._id}
                    onPress={() => handleVideoPress(video)}
                    imageSource={IMAGES.video_icon}
                    title={video.videoName || 'Video'}
                    startDate={formatDate(video.updatedAt)}
                    progress={calculateProgress(video.content)}
                    backgroundColor="#FDC9CE"
                    borderColor="#FF8794"
                  />
                ))}
            </View>
          ) : (
            /* ===== EMPTY ===== */
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <Text style={[FONTS.fontRegular, { fontSize: 16 }]}>
                No video history available
              </Text>
              <Text
                style={[
                  FONTS.fontLight,
                  {
                    fontSize: 14,
                    marginTop: 8,
                    textAlign: 'center',
                    paddingHorizontal: 40,
                  },
                ]}
              >
                Start watching videos to see your progress here
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default VideoHistory;
