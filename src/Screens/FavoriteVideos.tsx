import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { COLORS, FONTS } from '../Constants/theme';
import { IMAGES } from '../Constants/Images';
import MainHeader from '../layout/MainHeader';
import HistoryCard from '../Components/HistoryCard';
import { useFavoriteVideos, useVideoStatuses } from '../hooks/react-query/useFavorites';

type FavoriteVideosScreenProps = StackScreenProps<RootStackParamList, 'FavoriteVideos'>;

const FavoriteVideos = ({ navigation }: FavoriteVideosScreenProps) => {
  const { data: videos = [], isLoading } = useFavoriteVideos();
  const { data: videoStatuses = [] } = useVideoStatuses();

  const calculateProgress = (videoId: string) => {
    const status = videoStatuses.find((s: any) => s.videoId === videoId);
    if (!status?.content || status.content.length === 0) return 0;
    
    const completed = status.content.filter((item: any) => item.completed).length;
    return Math.round((completed / status.content.length) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently added';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const handleVideoPress = (video: any) => {
    console.log('Opening video:', video);
    
    navigation.navigate('Videos', {
      courseId: video.courseId,
      moduleId: video.moduleId,
      sectionId: video.sectionId,
      subSectionId: video.subSectionId,
      blockId: video.blockId,
      videoId: video.video._id,
    });
  };

  if (isLoading) {
    return (
      <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
        <MainHeader screenName="Favorite Videos" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[FONTS.fontRegular, { marginTop: 16 }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Favorite Videos" />
      <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {videos.length > 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginVertical: '5%',
                gap: 7,
                flexWrap: 'wrap',
                flexShrink: 1,
                marginBottom: '45%',
                justifyContent: 'space-around',
              }}
            >
              {videos.map((video: any, index: number) => (
                <HistoryCard
                  key={video._id || index}
                  // onPress={() => handleVideoPress(video)}
                  imageSource={IMAGES.video_icon}
                  title={video.video?.name || 'Video'}
                  startDate={formatDate(video.createdAt)}
                  progress={calculateProgress(video.video?._id)}
                  backgroundColor="#FDC9CE"
                  borderColor="#FF8794"
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50%',
              }}
            >
              <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: '#999' }]}>
                No Favorite Videos
              </Text>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: '#999', marginTop: 8 }]}>
                Start adding videos to your favorites!
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  marginTop: 20,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: 'white' }}>Go Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default FavoriteVideos;