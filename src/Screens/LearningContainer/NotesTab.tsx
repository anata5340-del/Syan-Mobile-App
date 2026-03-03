  // import React from 'react';
  // import {
  //   View,
  //   Text,
  //   ScrollView,
  // } from 'react-native';
  // import { IMAGES } from '../../Constants/Images';
  // import { COLORS, FONTS } from '../../Constants/theme';
  // import * as Progress from 'react-native-progress';
  // import CourseCard from '../../Components/CourseCard';

  // type Props = {
  //   noteId: string | null;
  // };

  // const NotesTab = ({ noteId }: Props) => {
  //   if (!noteId) {
  //     return <Text style={{ textAlign: 'center' }}>No notes available</Text>;
  //   }

  //   return (
  //     <ScrollView
  //       contentContainerStyle={{ paddingHorizontal: 20 }}
  //       showsVerticalScrollIndicator={false}
  //     >
  //       <View style={{ marginHorizontal: -15, paddingHorizontal: 15, marginBottom: 25 }}>

  //         {/* Progress */}
  //         <View style={{ alignItems: 'center' }}>
  //           <Progress.Bar
  //             progress={0.7}
  //             width={200}
  //             height={8}
  //             borderRadius={28}
  //             animated
  //             animationType="spring"
  //             color="#F9954B"
  //           />
  //           <Text
  //             style={[
  //               FONTS.fontSemiBold,
  //               {
  //                 fontSize: 10,
  //                 color: '#227777',
  //                 marginLeft: '30%',
  //                 paddingVertical: '2%',
  //               },
  //             ]}
  //           >
  //             Completed 84%
  //           </Text>
  //         </View>

  //         {/* YOUR EXISTING CARDS */}
  //         <CourseCard title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration="Read Notes" />
  //         <CourseCard title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration="Read Notes" />
  //         <CourseCard title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration="Read Notes" />
  //       </View>
  //     </ScrollView>
  //   );
  // };

  // export default NotesTab;













import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import CourseCard from '../../Components/CourseCard';
import { IMAGES } from '../../Constants/Images';
import { FONTS } from '../../Constants/theme';
import EmptyState from '../../Components/EmptyState';

const NotesTab = ({ blocks, navigation, params, isError }: any) => {
  const { courseId, moduleId, sectionId, subSectionId } = params;

  const noteBlocks = blocks.filter((b: any) => b.note);
  const questionBlocks = blocks.filter((b: any) => b.questions);

  
  if (isError || !noteBlocks.length) {
    const isNoData = !noteBlocks.length;

    return (
      <View style={{ flex: 1 }}>
        <EmptyState
          type={isNoData ? "noData" : "error"}
          message={
            isNoData
              ? "No notes available for this section"
              : "Failed to load notes"
          }
          showButton={false}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {noteBlocks.map((block: any) => (
        <CourseCard
          key={block._id}
          title={block.name}
          Imageicon={IMAGES.icon_readnotes}
          image={{ uri: block.image }}
          duration="Read Notes"
          onPress={() =>
            navigation.navigate('Notes', {
              courseId,
              moduleId,
              sectionId,
              subSectionId,
              subSectionBlockId: block._id, // important id to fetch notes
              questionIds: questionBlocks.find((qb: any) => qb._id === block._id)?.questions || [],
            })
          }
        />
      ))}
    </ScrollView>
  );
};

export default NotesTab;

