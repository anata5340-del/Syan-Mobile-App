import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import CourseCard from '../../Components/CourseCard';
import { IMAGES } from '../../Constants/Images';
import EmptyState from '../../Components/EmptyState';

const VideoTab = ({ blocks, navigation, params, isError }: any) => {
  const { courseId, moduleId, sectionId, subSectionId } = params;

  const videoBlocks = blocks.filter((b: any) => b.video);
  const questionBlocks = blocks.filter((b: any) => b.questions);


  if (isError || !videoBlocks.length) {
    const isNoData = !videoBlocks.length;

    return (
      <View style={{ flex: 1 }}>
        <EmptyState
          type={isNoData ? "noData" : "error"}
          message={
            isNoData
              ? "No videos available for this section"
              : "Failed to load videos"
          }
          showButton={false}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {videoBlocks.map((block: any) => (
        <CourseCard
          key={block._id}
          title={block.name}
          Imageicon={IMAGES.icon_video}
          image={block.image ? { uri: block.image } : IMAGES.video_icon}
          duration="Watch Video"
          onPress={() =>
            navigation.navigate('Videos', {
              courseId,
              moduleId,
              sectionId,
              subSectionId,
              subSectionBlockId: block._id,
              blockName: block.name,
              questionIds: questionBlocks.find((qb: any) => qb._id === block._id)?.questions || [],
            })
          }
        />
      ))}
    </ScrollView>
  );
};

export default VideoTab;