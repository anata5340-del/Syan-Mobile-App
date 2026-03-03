import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { COLORS, FONTS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ConfirmModal from '../Components/ModalConfirm';
import BottomSheetTOC from '../Components/BotomSheets/BottomSheetTOC';
import BottomSheet from '@gorhom/bottom-sheet';
import PrimaryButton from '../Components/PrimaryButton';
import { useSubSectionQuizQuestions } from '../hooks/react-query/useVideoCourses';
import { useLibraryPaperQuestions, useCustomQuizQuestions, useQuestionsByIds } from '../hooks/react-query/useQuizes';
import { Question as QuestionType, QuizSubmission } from '../types/quiz.types';
import { submitQuestionAnswer } from '../api/video.service';
import { 
  useIsQuizFavorited, 
  useAddQuizToFavorites, 
  useRemoveQuizFromFavorites ,
  useFavoriteQuizzes
} from '../hooks/react-query/useFavorites';

const { height, width } = Dimensions.get('window');

type QuestionScreenProps = StackScreenProps<RootStackParamList, 'Question'>;

const Question = ({ navigation, route }: QuestionScreenProps) => {
  const { 
  type = 'video',
  // Video course params
  courseId, 
  moduleId, 
  sectionId, 
  subSectionId, 
  questionIds, 
  // Library params
  quizId,
  paperId,
  // Custom quiz params
  topicId,
  limit,
  // Common params
  duration, 
  quizName 
} = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration || 1800);
  const [submitted, setSubmitted] = useState<QuizSubmission[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const normalizedQuestionIds = useMemo(() => {
  if (!questionIds) return '';
  if (Array.isArray(questionIds)) {
    return questionIds.join(',');
  }
  return String(questionIds);
}, [questionIds]);

  // Generate unique quiz ID for favorites based on type
  const favoriteQuizId = useMemo(() => {
  if (type === 'library') {
    return `library-${quizId}-${paperId}`;
  } else if (type === 'custom') {
    return `custom-${quizId}-${topicId}`;
  } else {
    return `${courseId}-${moduleId}-${sectionId}-${subSectionId}-${normalizedQuestionIds}`;
  }
}, [type, courseId, moduleId, sectionId, subSectionId, normalizedQuestionIds, quizId, paperId, topicId]);




const favoriteQuizUrl = useMemo(() => {
  if (type === 'custom') {
    return `/user/videoCourses/${courseId}/modules/dashboard/quiz?questions=${normalizedQuestionIds}&t=${duration}&moduleId=${moduleId}&sectionId=${sectionId}&subSectionId=${subSectionId}`;
  }

  if (type === 'library') {
    return `/user/library/quiz/${quizId}?paperId=${paperId}`;
  }

  // video
  return `/user/videoCourses/${courseId}/modules/dashboard/quiz?questions=${normalizedQuestionIds}&t=${duration}&moduleId=${moduleId}&sectionId=${sectionId}&subSectionId=${subSectionId}`;
}, [
  type,
  courseId,
  moduleId,
  sectionId,
  subSectionId,
  normalizedQuestionIds,
  quizId,
  paperId,
  duration,
]);

  // Fetch questions based on type
  // --- Video quiz: fetch questions for this subsection ---
  // Flow: Question (video) → useSubSectionQuizQuestions → getSubSectionQuizQuestions
  //       → GET /videoCourses/:courseId/modules/:moduleId/section/:sectionId/subSection/:subSectionId/questions?questionIds=...
  //       → response.questions used below in useMemo as rawQuestions for type === 'video'
  const {
  data: videoQuestionsData,
  isLoading: isVideoLoading,
  isError: isVideoError,
  error: videoError,
} = useSubSectionQuizQuestions(
  courseId || '',
  moduleId || '',
  sectionId || '',
  subSectionId || '',
  normalizedQuestionIds,
  { enabled: type === 'video' && !!courseId }
);

// console.log("Video Questions Data:", videoQuestionsData);

  const {
  data: libraryQuestionsData,
  isLoading: isLibraryLoading,
  isError: isLibraryError,
  error: libraryError,
} = useLibraryPaperQuestions(
  quizId || '',
  paperId || '',
  { enabled: type === 'library' && !!quizId && !!paperId }
);

console.log("Library Questions Data:", libraryQuestionsData?.data);


const {
  data: customQuestionsData,
  isLoading: isCustomLibraryLoading,
  isError: isCustomError,
  error: customError,
} = useCustomQuizQuestions(
  quizId || '',
  topicId || '',
  limit,
);

  // customLibrary returns subTopics[].questions as arrays of question IDs; flatten to comma-separated and fetch full questions
  const customQuestionIds = useMemo(() => {
    const lib = customQuestionsData?.data?.customLibrary;
    if (!Array.isArray(lib)) return '';
    const ids: string[] = [];
    lib.forEach((item: any) => {
      item.subTopics?.forEach((st: any) => {
        if (Array.isArray(st.questions)) ids.push(...st.questions);
      });
    });
    return ids.filter(Boolean).join(',');
  }, [customQuestionsData]);

  const {
    data: customQuestionsFullData,
    isLoading: isCustomQuestionsLoading,
    isError: isCustomQuestionsError,
  } = useQuestionsByIds(customQuestionIds, {
    enabled: type === 'custom' && !!customQuestionIds,
  });

  const isCustomLoading = isCustomLibraryLoading || isCustomQuestionsLoading;
  const isCustomErrorCombined = isCustomError || isCustomQuestionsError;

console.log("Custom Questions Data:", customQuestionsData?.data);
  // Determine loading and error states based on type
  const isLoading = 
  type === 'video' ? isVideoLoading : 
  type === 'library' ? isLibraryLoading : 
  type === 'custom' ? isCustomLoading : 
  false;

const isError = 
  type === 'video' ? isVideoError : 
  type === 'library' ? isLibraryError : 
  type === 'custom' ? isCustomErrorCombined : 
  false;

const error = 
  type === 'video' ? videoError : 
  type === 'library' ? libraryError : 
  type === 'custom' ? customError : 
  null;

  // Favorites hooks
  const { data: favoriteQuizzes = [] } = useFavoriteQuizzes();
  const addToFavorites = useAddQuizToFavorites();
  const removeFromFavorites = useRemoveQuizFromFavorites();


  const favoriteRecord = useMemo(() => {
  return favoriteQuizzes.find(fav => fav.url === favoriteQuizUrl);
}, [favoriteQuizzes, favoriteQuizUrl]);

const isFavorited = !!favoriteRecord;

  // Process questions with unique IDs based on type
  const questions: QuestionType[] = useMemo(() => {
  console.log('🔄 Processing questions for type:', type);
  
  let rawQuestions: any[] = [];

  if (type === 'video' && videoQuestionsData?.questions) {
    rawQuestions = videoQuestionsData.questions;
    console.log('Video questions:', rawQuestions.length);
  } else if (type === 'library' && libraryQuestionsData?.data?.questions) {
    console.log("Library Questions Data: herer 1", libraryQuestionsData.data?.questions);
    rawQuestions = libraryQuestionsData.data?.questions;
    console.log('Library questions:', rawQuestions.length);
  } else if (type === 'custom' && customQuestionsFullData) {
    rawQuestions = Array.isArray(customQuestionsFullData)
      ? customQuestionsFullData
      : (customQuestionsFullData as any)?.questions ?? [];
    console.log('Custom questions:', rawQuestions.length);
  } else {
    console.log(' No questions found for type:', type);
  }

  const processed = rawQuestions.map((question: any, index: number) => ({
    ...question,
    _id: `${question._id}-${index}`,
    originalId: question._id,
    submitted: false,
    selectedOption: undefined,
    options: Array.isArray(question.options)
      ? question.options
      : Array.isArray((question as any).choices)
      ? (question as any).choices
      : [],
  }));

  console.log('Processed questions count:', processed.length);
  return processed;
}, [type, videoQuestionsData, libraryQuestionsData, customQuestionsData, customQuestionsFullData]);

  const selectedQuestion = questions[currentIndex] || null;

  // Timer effect
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  // Check if all questions submitted
  useEffect(() => {
    if (submitted.length === questions.length && questions.length > 0) {
      setIsCompleted(true);
    }
  }, [submitted, questions]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (addToFavorites.isPending || removeFromFavorites.isPending) return;

    const currentlyFavorited = isFavorited || false;

    try {
      if (currentlyFavorited) {
        // Remove from favorites
        await removeFromFavorites.mutateAsync(favoriteQuizId);
        Alert.alert('Removed', 'Quiz removed from favorites');
      } else {
        // Add to favorites
        const favoriteData: any = {
          quizName: quizName,
          url: favoriteQuizUrl,
        };

        await addToFavorites.mutateAsync(favoriteData);
        Alert.alert('Success', 'Quiz added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSelectOption = (qid: string, optionIndex: number) => {
    if (isCompleted || questions.find(q => q._id === qid)?.submitted) return;
    setSelectedOptions((prev) => ({ ...prev, [qid]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!selectedQuestion) return;

    const selectedOptionIndex = selectedOptions[selectedQuestion._id];
    
    if (selectedOptionIndex === undefined) {
      Alert.alert('Please select an option.');
      return;
    }

    const isCorrect = selectedQuestion.options[selectedOptionIndex]?.isCorrect || false;

    // Add to submitted list
    setSubmitted((prev) => [
      ...prev,
      { id: selectedQuestion._id, selectedOption: selectedOptionIndex },
    ]);

    // Mark question as submitted
    questions[currentIndex].submitted = true;
    questions[currentIndex].selectedOption = selectedOptionIndex;

    // Submit to backend (optional - for tracking)
    try {
      await submitQuestionAnswer(
        selectedQuestion.originalId || selectedQuestion._id,
        selectedQuestion.name,
        isCorrect
      );
    } catch (error) {
      console.error('Error submitting answer:', error);
    }

    // Move to next question
    handleNext();
  };

  const handleAutoSubmit = () => {
    setIsCompleted(true);
  };

  const handleEndExam = () => {
    setModalVisible(false);
    calculateAndNavigateToResult();
  };

  const calculateAndNavigateToResult = () => {
    let correct = 0;
    let incorrect = 0;

    questions.forEach(q => {
      if (q.submitted && q.selectedOption !== undefined) {
        if (q.options[q.selectedOption]?.isCorrect) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      }
    });

    const unanswered = questions.length - (correct + incorrect);

    const metaData: any = {
      duration,
      sectionName: quizName,
      type,
    };

    if (type === 'video') {
      metaData.courseId = courseId;
      metaData.moduleId = moduleId;
      metaData.sectionId = sectionId;
      metaData.subSectionId = subSectionId;
      metaData.questionIds = questionIds;
    } else if (type === 'library') {
      metaData.quizId = quizId;
      metaData.paperId = paperId;
    } else if (type === 'custom') {
      metaData.quizId = quizId;
    }

    navigation.replace('QuizResult', {
      summary: {
        score: correct,
        total: questions.length,
        correct,
        incorrect,
        unanswered,
        timeTaken: duration - timeLeft,
      },
      questions,
      submissions: submitted,
      meta: metaData,
      quizId: quizId,
    });
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = ({ item, index }: { item: QuestionType; index: number }) => {
    const isQuestionSubmitted = item.submitted || false;
    const selectedOptionIndex = selectedOptions[item._id];

    return (
      <View style={styles.questionCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 5 }}
        >
          <View style={styles.topRow}>
            <Text style={[FONTS.fontMedium, styles.questionHeader]}>
              Question {index + 1}
            </Text>
            <Text style={[FONTS.fontMedium, styles.questionHeader]}>
              ID: {item.displayId || item._id.substring(0, 8)}
            </Text>
          </View>

          <Text style={[FONTS.fontLight, styles.questionText]}>
            {item.statement || item.name}
          </Text>

          {item.options.map((option, i) => {
            const isSelected = selectedOptionIndex === i;
            const showCorrect = isCompleted && option.isCorrect;
            const showIncorrect = isCompleted && isQuestionSubmitted && item.selectedOption === i && !option.isCorrect;

            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectOption(item._id, i)}
                disabled={isQuestionSubmitted || isCompleted}
                style={[
                  styles.option,
                  {
                    backgroundColor: showCorrect
                      ? '#01C874'
                      : showIncorrect
                      ? '#FE0019'
                      : isSelected
                      ? COLORS.light_pink
                      : '#fff',
                  },
                  (isSelected || showCorrect || showIncorrect) && {
                    borderColor: COLORS.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      FONTS.fontMedium,
                      styles.optionLabel,
                      {
                        backgroundColor: showCorrect
                          ? '#00A65E'
                          : showIncorrect
                          ? '#CC0015'
                          : '#EF6A77',
                        color: COLORS.white,
                      },
                    ]}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                  <Text
                    style={[
                      FONTS.fontMedium,
                      styles.optionText,
                      (showCorrect || showIncorrect) && { color: 'white' },
                    ]}
                  >
                    {option.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {!isCompleted && (
            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
              <PrimaryButton
                onPress={handleSubmitQuestion}
                title={
                  currentIndex === questions.length - 1
                    ? 'Submit & Finish'
                    : 'Submit Answer'
                }
                backgroundColor={isQuestionSubmitted ? '#CCC' : COLORS.primary}
                borderColor={isQuestionSubmitted ? '#CCC' : COLORS.primary}
                textColor={COLORS.white}
                disabled={isQuestionSubmitted}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[FONTS.fontRegular, { marginTop: 16 }]}>Loading Questions...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: 'red' }]}>
          Error Loading Questions
        </Text>
        <Text style={[FONTS.fontRegular, { marginTop: 8, textAlign: 'center' }]}>
          {error?.message || 'Something went wrong'}
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
    );
  }

  if (questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[FONTS.fontSemiBold, { fontSize: 18 }]}>No Questions Found</Text>
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
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader 
        screenName="Quiz" 
        heartIcon 
        isHeartFilled={isFavorited || false}
        onHeartPress={handleFavoriteToggle}
        heartLoading={addToFavorites.isPending || removeFromFavorites.isPending}
      />

      <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: width * 0.04 }}>
        {/* Navigation + Count */}
        <View
          style={{
            flexDirection: 'row',
            marginVertical: '2%',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIndex === 0}
            style={[
              { flexDirection: 'row', alignItems: 'center' },
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
          >
            <FeatherIcon name="chevron-left" size={30} color="black" />
            <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.black }]}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              FONTS.fontMedium,
              {
                fontSize: 12,
                color: COLORS.black,
                backgroundColor: '#FFD9DC',
                padding: 7,
                borderRadius: 22,
              },
            ]}
          >
            {currentIndex + 1}/{questions.length}
          </Text>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex === questions.length - 1}
            style={[
              { flexDirection: 'row', alignItems: 'center' },
              currentIndex === questions.length - 1 && styles.navButtonDisabled,
            ]}
          >
            <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.black }]}>
              Next
            </Text>
            <FeatherIcon name="chevron-right" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* Timer */}
        <View style={styles.timerBox}>
          <Text style={[FONTS.fontSm, { color: COLORS.white, fontSize: 10 }]}>
            {isCompleted ? 'Quiz Completed' : 'Time Left'}
          </Text>
          <Text style={[FONTS.fontLight, { color: COLORS.white, fontSize: 10 }]}>
            {isCompleted ? 'Review Mode' : `${formatTime(timeLeft)} Min`}
          </Text>
        </View>

        {/* FlatList */}
        <FlatList
          ref={flatListRef}
          data={questions}
          renderItem={renderQuestion}
          keyExtractor={(item) => item._id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          ItemSeparatorComponent={() => <View style={{ width: width * 0.1 }} />}
          onMomentumScrollEnd={(ev) => {
            const index = Math.round(ev.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEnabled={false}
        />

        {/* End Exam / View Results Button */}
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          {isCompleted ? (
            <PrimaryButton
              onPress={calculateAndNavigateToResult}
              title="View Results"
              backgroundColor={COLORS.primary}
              borderColor={COLORS.primary}
              textColor="white"
            />
          ) : (
            <PrimaryButton
              onPress={toggleModal}
              title="End Exam"
              backgroundColor={COLORS.white}
              borderColor={COLORS.secondary}
              textColor="#227777"
            />
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent visible={isModalVisible}>
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            style={styles.overlay}
          />
          <ConfirmModal
            heading="Confirm"
            description="Are you sure you want to end exam now? Your progress will be saved."
            ContinuePress={() => setModalVisible(false)}
            EndExamPress={handleEndExam}
          />
        </View>
      </Modal>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.keypointsButton}
        onPress={() => bottomSheetRef.current?.snapToIndex(1)}
      >
        <Text style={styles.keypointsText}>Questions</Text>
      </TouchableOpacity>

      {/* BottomSheet */}
      <BottomSheetTOC
        ref={bottomSheetRef}
        items={questions.map((q, idx) => ({
          title: `Question ${idx + 1}${q.submitted ? ' ✓' : ''}`,
          content: [],
        }))}
        onSelect={(index) => {
          setCurrentIndex(index);
          flatListRef.current?.scrollToIndex({ index });
        }}
        label="Jump to Questions"
      />
    </View>
  );
};

export default Question;

const styles = StyleSheet.create({
  modalWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  keypointsButton: {
    position: 'absolute',
    right: 0,
    top: height / 2 - 40,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  keypointsText: {
    ...FONTS.fontRegular,
    fontSize: 11,
    color: COLORS.white,
    transform: [{ rotate: '-90deg' }],
  },
  questionCard: {
    width: width - width * 0.1,
    backgroundColor: '#F8F8F8',
    borderWidth: 0.7,
    borderColor: 'black',
    borderRadius: 25,
    padding: 20,
    marginVertical: 15,
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionHeader: { fontSize: 14, color: COLORS.text },
  questionText: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'justify',
    lineHeight: 22,
    marginVertical: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  optionLabel: {
    fontSize: 13,
    paddingHorizontal: 10,
    borderRadius: 40,
    paddingVertical: 2,
  },
  optionText: { fontSize: 13, paddingLeft: 10, color: COLORS.text },
  timerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#F9954B',
    alignSelf: 'center',
    padding: 3,
    paddingHorizontal: '10%',
    borderRadius: 10,
    marginVertical: '2%',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
});