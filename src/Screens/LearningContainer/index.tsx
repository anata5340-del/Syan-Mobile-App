import React, { useState } from 'react';
import { View } from 'react-native';
import MainHeader from '../../layout/MainHeader';
import { COLORS } from '../../Constants/theme';
import ScreenBottomTab from '../../Components/ScreenBottomTab';

import NotesTab from './NotesTab';
import VideoTab from './VideoTab';
import QuizTab from './QuizTab';

type TabType = 'notes' | 'videos' | 'quiz';

const LearningTabs = ({ route, navigation }: any) => {
  const {
    courseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionName,
    subSectionBlocks = [],
  } = route.params;

  const [activeTab, setActiveTab] = useState<TabType>('notes');

  const sharedParams = {
    courseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionName,
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName={subSectionName} />

      {activeTab === 'notes' && (
        <NotesTab
          blocks={subSectionBlocks}
          navigation={navigation}
          params={sharedParams}
        />
      )}

      {activeTab === 'videos' && (
        <VideoTab
          blocks={subSectionBlocks}
          navigation={navigation}
          params={sharedParams}
        />
      )}

      {activeTab === 'quiz' && (
        <QuizTab
          blocks={subSectionBlocks}
          navigation={navigation}
          params={sharedParams}
        />
      )}

      <ScreenBottomTab
        activeTabs={activeTab}
        onChange={setActiveTab}
        tabs={[
          { name: 'notes', label: 'Notes', icon: 'align-right' },
          { name: 'videos', label: 'Videos', icon: 'play' },
          { name: 'quiz', label: 'Quiz', icon: 'check-square' },
        ]}
      />
    </View>
  );
};

export default LearningTabs;