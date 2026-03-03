import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CourseCard from '../../Components/CourseCard';
import { IMAGES } from '../../Constants/Images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../Constants/theme';
import EmptyState from '../../Components/EmptyState';

const QuizTab = ({ blocks, navigation, params, isError }: any) => {
  const { courseId, moduleId, sectionId, subSectionId } = params;

  /** Filter only quiz blocks */
  const quizBlocks = useMemo(
    () => blocks.filter((b: any) => b.questions && b.questions.length > 0),
    [blocks]
  );

  /** Flat list of ALL question IDs */
  const allQuestionIds = useMemo(
    () => quizBlocks.flatMap((b: any) => b.questions),
    [quizBlocks]
  );

  /** Selected question IDs */
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  /** Derived: is all selected */
  const isAllSelected =
    selectedQuestionIds.length === allQuestionIds.length &&
    allQuestionIds.length > 0;

  /** Toggle Select All */
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(allQuestionIds);
    }
  };

  /** Toggle single block */
  const toggleBlock = (blockQuestions: string[]) => {
    const isBlockSelected = blockQuestions.every((q) =>
      selectedQuestionIds.includes(q)
    );

    if (isBlockSelected) {
      setSelectedQuestionIds((prev) =>
        prev.filter((q) => !blockQuestions.includes(q))
      );
    } else {
      setSelectedQuestionIds((prev) => [
        ...new Set([...prev, ...blockQuestions]),
      ]);
    }
  };

  /** Handle Start Quiz Navigation */
  const handleStartQuiz = () => {
    if (selectedQuestionIds.length === 0) {
      Alert.alert('Please select at least one quiz topic to continue.');
      return;
    }

    navigation.navigate('QuizWarning', {
      questionIds: selectedQuestionIds,
      courseId,
      moduleId,
      sectionId,
      subSectionId,
    });
  };


  if (isError || !quizBlocks.length) {
    const isNoData = !quizBlocks.length;

    return (
      <View style={{ flex: 1 }}>
        <EmptyState
          type={isNoData ? "noData" : "error"}
          message={
            isNoData
              ? "No Quiz available for this section"
              : "Failed to load Quiz"
          }
          showButton={false}
        />
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      {/* ===== Select All Header ===== */}
      <View
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e9ecef',
        }}
      >
        <TouchableOpacity
          onPress={toggleSelectAll}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons
              name={isAllSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={26}
              color={COLORS.primary}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 16, color: 'black' }]}>
                Select All Topics
              </Text>
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: '#666', marginTop: 2 }]}>
                {allQuestionIds.length} total questions available
              </Text>
            </View>
          </View>
          {selectedQuestionIds.length > 0 && (
            <View
              style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={[FONTS.fontSemiBold, { color: 'white', fontSize: 12 }]}>
                {selectedQuestionIds.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ===== Quiz Blocks ===== */}
      {quizBlocks.map((block: any) => {
        const blockSelected = block.questions.every((q: string) =>
          selectedQuestionIds.includes(q)
        );

        return (
          <CourseCard
            key={block._id}
            title={block.name}
            image={block.image ? { uri: block.image } : IMAGES.icon_skull}
            duration={`${block.questions.length} Questions`}
            onPress={() => toggleBlock(block.questions)}
            isCheckboxVisible={true}
            isChecked={blockSelected}
            onCheckboxPress={() => toggleBlock(block.questions)}
          />
        );
      })}

      {/* ===== Start Quiz Button ===== */}
      <TouchableOpacity
        disabled={!selectedQuestionIds.length}
        onPress={handleStartQuiz}
        style={{
          marginTop: 30,
          backgroundColor: selectedQuestionIds.length
            ? COLORS.primary
            : '#CCC',
          paddingVertical: 16,
          borderRadius: 30,
          alignItems: 'center',
          shadowColor: selectedQuestionIds.length ? COLORS.primary : '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: selectedQuestionIds.length ? 0.3 : 0,
          shadowRadius: 8,
          elevation: selectedQuestionIds.length ? 6 : 0,
        }}
      >
        <Text style={[FONTS.fontSemiBold, { color: 'white', fontSize: 16 }]}>
          {selectedQuestionIds.length > 0
            ? `Start Quiz (${selectedQuestionIds.length} Questions)`
            : 'Select Questions to Start'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuizTab;