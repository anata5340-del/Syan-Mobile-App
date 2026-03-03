import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { COLORS, FONTS } from '../Constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MainHeader from '../layout/MainHeader';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetTOC from '../Components/BotomSheets/BottomSheetTOC';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { 
  useIsQuizFavorited, 
  useAddQuizToFavorites, 
  useRemoveQuizFromFavorites 
} from '../hooks/react-query/useFavorites';

const { height } = Dimensions.get('window');

type QuizExplanationsDetailsProps = StackScreenProps<RootStackParamList, 'QuizExplanationsDetails'>;

const QuizExplanationsDetails = ({ navigation, route }: QuizExplanationsDetailsProps) => {
  const { question, questionIndex, allQuestions, meta } = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<number[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(questionIndex || 0);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [contentSections, setContentSections] = useState<{ title: string; content: string[] }[]>([]);

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

  useEffect(() => {
    // Parse explanation into sections
    parseExplanation(currentQuestion.explanation);
  }, [currentQuestion]);

  const parseExplanation = (explanation: string) => {
    if (!explanation) {
      setContentSections([
        {
          title: 'Explanation',
          content: ['No explanation available for this question.'],
        },
      ]);
      return;
    }

    // Simple parsing: split by double newlines or create single section
    const paragraphs = explanation.split('\n\n').filter((p) => p.trim());
    
    if (paragraphs.length > 0) {
      setContentSections([
        {
          title: 'Explanation',
          content: paragraphs,
        },
      ]);
    } else {
      setContentSections([
        {
          title: 'Explanation',
          content: [explanation],
        },
      ]);
    }
  };

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
    if (currentIndex < allQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentQuestion(allQuestions[prevIndex]);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentIndex(index);
    setCurrentQuestion(allQuestions[index]);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    bottomSheetRef.current?.close();
  };

  const isAnswered = currentQuestion.userOptionIndex !== undefined;

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader 
        screenName={meta?.sectionName || 'Quiz Explanation'} 
        heartIcon 
        isHeartFilled={isFavorited || false}
        onHeartPress={handleFavoriteToggle}
        heartLoading={addToFavorites.isPending || removeFromFavorites.isPending}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
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
            {currentIndex + 1}/{allQuestions.length}
          </Text>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex === allQuestions.length - 1}
            style={[
              { flexDirection: 'row', alignItems: 'center' },
              currentIndex === allQuestions.length - 1 && { opacity: 0.3 },
            ]}
          >
            <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.black }]}>Next</Text>
            <FeatherIcon name="chevron-right" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* Content Label */}
        <View style={styles.sectionHeader}>
          <Text style={[FONTS.fontSemiBold, styles.sectionTitle]}>Content:</Text>
        </View>

        {/* Question Button with Status */}
        <TouchableOpacity style={styles.questionButton} activeOpacity={0.7}>
          <View style={styles.questionButtonContent}>
            <Text style={[FONTS.fontMedium, styles.questionText]}>
              Question {currentIndex + 1}
            </Text>
            {isAnswered && currentQuestion.isCorrect && (
              <FeatherIcon name="check-circle" size={24} color={'#02DC81'} />
            )}
            {isAnswered && !currentQuestion.isCorrect && (
              <FeatherIcon name="x-circle" size={24} color={'#FE0019'} />
            )}
            {!isAnswered && (
              <FeatherIcon name="circle" size={24} color={'#999'} />
            )}
          </View>
        </TouchableOpacity>

        {/* Question Details */}
        <View style={styles.detailSection}>
          <View style={styles.detailRow}>
            <Text style={[FONTS.fontSemiBold, styles.detailTitle]}>Difficulty Level</Text>
            <Text style={[FONTS.fontLight, styles.detailValue]}>
              {currentQuestion.difficultyLevel || 'Medium'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[FONTS.fontSemiBold, styles.detailTitle]}>Topic</Text>
            <Text style={[FONTS.fontLight, styles.detailValue]}>
              {currentQuestion.topic || meta?.sectionName || 'General'}
            </Text>
          </View>
        </View>

        {/* Explanation Header */}
        <View style={styles.centeredTextContainer}>
          <Text style={[FONTS.fontSemiBold, styles.explanationHeader]}>Explanation</Text>
        </View>

        {/* Explanation Content */}
        {contentSections.map((section, index) => (
          <View
            key={index}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              sectionPositions.current[index] = y;
            }}
            style={styles.sectionContainer}
          >
            <Text style={styles.contentSectionTitle}>{section.title}</Text>
            {section.content.map((paragraph, i) => (
              <Text key={i} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        {/* Reference Section */}
        {currentQuestion.reference && (
          <View style={styles.referenceSection}>
            <Text style={[FONTS.fontLight, styles.referenceTitle]}>Reference:</Text>
            <TouchableOpacity>
              <Text style={[FONTS.fontMedium, styles.referenceLink]}>
                {currentQuestion.reference}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Keypoints Button */}
      <TouchableOpacity
        style={styles.keypointsButton}
        onPress={() => {
          bottomSheetRef.current?.snapToIndex(1);
        }}
      >
        <Text style={styles.keypointsText}>Questions</Text>
      </TouchableOpacity>

      {/* BottomSheet with All Questions */}
      <BottomSheetTOC
        ref={bottomSheetRef}
        items={allQuestions.map((q: any, idx: number) => ({
          title: `Q${idx + 1}: ${q.isCorrect ? '✓' : q.userAnswer ? '✗' : '○'} - ${q.topic || 'Question'}`,
          content: [],
        }))}
        onSelect={handleQuestionSelect}
        label="Jump to Question"
      />
    </View>
  );
};

export default QuizExplanationsDetails;

const styles = StyleSheet.create({
  sectionHeader: {
    marginVertical: '4%',
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.text,
  },
  questionButton: {
    borderRadius: 50,
    padding: 10,
    marginVertical: '2%',
    backgroundColor: COLORS.primary,
  },
  questionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    fontSize: 12,
    color: COLORS.white,
  },
  detailSection: {
    marginHorizontal: '5%',
    marginVertical: '5%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    paddingHorizontal: 5,
    marginVertical: '3%',
  },
  detailTitle: {
    fontSize: 13,
    color: COLORS.black,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.black,
  },
  centeredTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '4%',
  },
  explanationHeader: {
    fontSize: 18,
    color: '#227777',
  },
  referenceSection: {
    marginHorizontal: '3%',
    marginTop: '4%',
    marginBottom: '6%',
  },
  referenceTitle: {
    fontSize: 18,
    color: '#227777',
    marginBottom: 8,
  },
  referenceLink: {
    fontSize: 12,
    color: COLORS.primary,
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
  sectionContainer: {
    marginBottom: 25,
    marginHorizontal: '3%',
  },
  contentSectionTitle: {
    ...FONTS.fontSemiBold,
    fontSize: 16,
    color: COLORS.title,
    marginBottom: 8,
  },
  paragraph: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: 'justify',
  },
});