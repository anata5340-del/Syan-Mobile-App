import React, { useRef, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { COLORS, FONTS } from '../Constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Dimensions } from 'react-native';
import BottomSheetTOC from '../Components/BotomSheets/BottomSheetTOC';
import BottomSheet from '@gorhom/bottom-sheet';
import PrimaryButton from '../Components/PrimaryButton';
import { 
  useIsQuizFavorited, 
  useAddQuizToFavorites, 
  useRemoveQuizFromFavorites 
} from '../hooks/react-query/useFavorites';

const { height, width } = Dimensions.get('window');

type QuizExplanationScreenProps = StackScreenProps<RootStackParamList, 'QuizExplanations'>;

const QuizExplanations = ({ navigation, route }: QuizExplanationScreenProps) => {
  const { questions, submissions, meta } = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate unique quiz ID for favorites (same as Question screen)
  const quizId = useMemo(() => {
    const { courseId, moduleId, sectionId, subSectionId, questionIds } = meta;
    const normalizedQuestionIds = Array.isArray(questionIds) 
      ? questionIds.join(',') 
      : String(questionIds);
    return `${courseId}-${moduleId}-${sectionId}-${subSectionId}-${normalizedQuestionIds}`;
  }, [meta]);

  // Favorites hooks
  const { data: isFavorited } = useIsQuizFavorited(quizId);
  const addToFavorites = useAddQuizToFavorites();
  const removeFromFavorites = useRemoveQuizFromFavorites();

  // Map questions with user's answers
  const reviewQuestions = questions.map((q: any) => {
    const submission = submissions.find((s: any) => s.id === q._id);
    const userOptionIndex = submission?.selectedOption;
    const userAnswer = userOptionIndex !== undefined ? q.options[userOptionIndex]?.name : null;
    const correctOption = q.options.find((opt: any) => opt.isCorrect);
    const correctAnswer = correctOption?.name || '';
    const isCorrect = userOptionIndex !== undefined && q.options[userOptionIndex]?.isCorrect;

    return {
      ...q,
      userOptionIndex,
      userAnswer,
      correctAnswer,
      isCorrect,
    };
  });

  const currentQuestion = reviewQuestions[currentIndex];

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (addToFavorites.isPending || removeFromFavorites.isPending) return;

    const currentlyFavorited = isFavorited || false;

    try {
      if (currentlyFavorited) {
        await removeFromFavorites.mutateAsync(quizId);
        Alert.alert('Removed', 'Quiz removed from favorites');
      } else {
        const normalizedQuestionIds = Array.isArray(meta.questionIds) 
          ? meta.questionIds.join(',') 
          : String(meta.questionIds);

        const favoriteData = {
          quizName: meta.sectionName || 'Quiz',
          quizId: quizId,
          courseId: meta.courseId,
          moduleId: meta.moduleId,
          sectionId: meta.sectionId,
          subSectionId: meta.subSectionId,
          questionIds: normalizedQuestionIds,
          duration: meta.duration,
        };
        await addToFavorites.mutateAsync(favoriteData);
        Alert.alert('Success', 'Quiz added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentIndex < reviewQuestions.length - 1) {
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

  const handleSeeExplanation = () => {
    navigation.navigate('QuizExplanationsDetails', {
      question: currentQuestion,
      questionIndex: currentIndex,
      allQuestions: reviewQuestions,
      meta,
      submissions,
      total: reviewQuestions.length,
    });
  };

  const renderQuestion = ({ item, index }: { item: any; index: number }) => {
    const isAnswered = item.userOptionIndex !== undefined;

    return (
      <View style={styles.questionCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 5 }}
        >
          {/* Question Header */}
          <View style={styles.topRow}>
            <Text style={[FONTS.fontMedium, styles.questionHeader]}>
              Question {index + 1}
            </Text>
            <Text style={[FONTS.fontMedium, styles.questionHeader]}>
              ID: {item.displayId || item._id.substring(0, 8)}
            </Text>
          </View>

          {/* Result Badge */}
          {isAnswered && (
            <View
              style={[
                styles.resultBadge,
                { backgroundColor: item.isCorrect ? '#01C874' : '#FE0019' },
              ]}
            >
              <Text style={[FONTS.fontMedium, { color: COLORS.white, fontSize: 12 }]}>
                {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </Text>
            </View>
          )}

          {!isAnswered && (
            <View style={[styles.resultBadge, { backgroundColor: '#999' }]}>
              <Text style={[FONTS.fontMedium, { color: COLORS.white, fontSize: 12 }]}>
                Not Answered
              </Text>
            </View>
          )}

          {/* Question Text */}
          <Text style={[FONTS.fontLight, styles.questionText]}>
            {item.statement || item.name}
          </Text>

          {/* Options */}
          {item.options.map((option: any, i: number) => {
            const isCorrect = option.isCorrect;
            const isUserAnswer = item.userOptionIndex === i;

            let backgroundColor = '#fff';
            let borderColor = '#ddd';
            let textColor = COLORS.text;
            let labelBgColor = '#EF6A77';

            if (isCorrect) {
              backgroundColor = '#01C874';
              borderColor = '#00A65E';
              textColor = COLORS.white;
              labelBgColor = '#00A65E';
            } else if (isUserAnswer && !isCorrect) {
              backgroundColor = '#FE0019';
              borderColor = '#CC0015';
              textColor = COLORS.white;
              labelBgColor = '#CC0015';
            }

            return (
              <View
                key={i}
                style={[
                  styles.option,
                  { backgroundColor, borderColor, borderWidth: isCorrect || isUserAnswer ? 2 : 1 },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      FONTS.fontMedium,
                      styles.optionLabel,
                      {
                        backgroundColor: labelBgColor,
                        color: COLORS.white,
                      },
                    ]}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                  <Text style={[FONTS.fontMedium, styles.optionText, { color: textColor }]}>
                    {option.name}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Next Button */}
          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
            <PrimaryButton
              onPress={handleNext}
              title={currentIndex === reviewQuestions.length - 1 ? 'Finish Review' : 'Next Question'}
              backgroundColor={COLORS.primary}
              borderColor={COLORS.primary}
              textColor={COLORS.white}
            />
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader 
        screenName="Quiz Review" 
        heartIcon 
        isHeartFilled={isFavorited || false}
        onHeartPress={handleFavoriteToggle}
        heartLoading={addToFavorites.isPending || removeFromFavorites.isPending}
      />
      
      <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: width * 0.04 }}>
        {/* Navigation Controls */}
        <View style={{ flexDirection: 'row', marginVertical: '2%', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIndex === 0}
            style={[
              { flexDirection: 'row', alignItems: 'center' },
              currentIndex === 0 && { opacity: 0.3 },
            ]}
          >
            <FeatherIcon name="chevron-left" size={30} color="black" />
            <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.black }]}>Previous</Text>
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
            {currentIndex + 1}/{reviewQuestions.length}
          </Text>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex === reviewQuestions.length - 1}
            style={[
              { flexDirection: 'row', alignItems: 'center' },
              currentIndex === reviewQuestions.length - 1 && { opacity: 0.3 },
            ]}
          >
            <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.black }]}>Next</Text>
            <FeatherIcon name="chevron-right" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* Questions */}
        {currentQuestion && (
          <View style={{ marginHorizontal: '5%', marginVertical: '3%' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 0.7,
                paddingHorizontal: 5,
                paddingVertical: 8,
              }}
            >
              <Text style={[FONTS.fontSemiBold, { fontSize: 13, color: COLORS.black }]}>
                Difficulty Level
              </Text>
              <Text style={[FONTS.fontLight, { fontSize: 13, color: COLORS.black }]}>
                {currentQuestion.difficultyLevel || 'Medium'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 0.7,
                paddingHorizontal: 5,
                paddingVertical: 8,
              }}
            >
              <Text style={[FONTS.fontSemiBold, { fontSize: 13, color: COLORS.black }]}>
                Topic
              </Text>
              <Text style={[FONTS.fontLight, { fontSize: 13, color: COLORS.black }]}>
                {currentQuestion.topic || meta?.sectionName || 'General'}
              </Text>
            </View>
          </View>
        )}


        <FlatList
          ref={flatListRef}
          data={reviewQuestions}
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

        {/* see explanation button */}
        <View style={{ alignItems: 'center', marginBottom: '5%' }}>
          <TouchableOpacity
            onPress={handleSeeExplanation}
            style={{
              paddingHorizontal: 25,
              paddingVertical: 10,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: '#227777',
              backgroundColor: '#227777',
            }}
          >
            <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.white }]}>
              See Explanation
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* floating button */}
      <TouchableOpacity
        style={styles.keypointsButton}
        onPress={() => bottomSheetRef.current?.snapToIndex(1)}
      >
        <Text style={styles.keypointsText}>Questions</Text>
      </TouchableOpacity>

      {/* BottomSheet */}
      <BottomSheetTOC
        ref={bottomSheetRef}
        items={reviewQuestions.map((q: any, idx: number) => ({
          title: `Q${idx + 1}: ${q.isCorrect ? '✓' : q.userAnswer ? '✗' : '○'}`,
          content: [],
        }))}
        onSelect={(index) => {
          setCurrentIndex(index);
          flatListRef.current?.scrollToIndex({ index });
        }}
        label="Jump to Questions"
        mode="quizExplanation"
      />
    </View>
  );
};

export default QuizExplanations;

const styles = StyleSheet.create({
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
    marginBottom: 10,
  },
  questionHeader: { fontSize: 14, color: COLORS.text },
  resultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'justify',
    lineHeight: 22,
    marginVertical: 10,
  },
  option: {
    borderWidth: 1,
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
});