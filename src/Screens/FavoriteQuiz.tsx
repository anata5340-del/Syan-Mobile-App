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
import { useFavoriteQuizzes, useQuestionStatuses } from '../hooks/react-query/useFavorites';
import { parseQuizStatusUrl } from '../utils/parseQuizStatusUrl';
import { QuizStatus } from '../api/favorites.services';
type FavoriteQuizScreenProps = StackScreenProps<RootStackParamList, 'FavoriteQuiz'>;

const FavoriteQuiz = ({ navigation }: FavoriteQuizScreenProps) => {
  const { data: quizzes = [], isLoading } = useFavoriteQuizzes();
  const { data: questionStatuses = [] } = useQuestionStatuses();

  const getQuestionProgress = (questionId: string) => {
    const status = questionStatuses.find((s: any) => s.questionId === questionId);
    return status?.correct ? 100 : 0;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently added';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const handleQuizPress = (quiz: QuizStatus) => {
    const parsed = quiz.url ? parseQuizStatusUrl(quiz.url, quiz.quizName) : null;
    if (parsed) {
      navigation.navigate('QuizWarning', {
        type: parsed.type,
        quizId: parsed.quizId,
        quizName: parsed.quizName,
        paperId: parsed.paperId,
        topicId: parsed.topicId,
        limit: parsed.limit,
        estimatedQuestions: parsed.estimatedQuestions,
        durationSeconds: parsed.durationSeconds,
        courseId: parsed.courseId,
        moduleId: parsed.moduleId,
        sectionId: parsed.sectionId,
        subSectionId: parsed.subSectionId,
        questionIds: parsed.questionIds,
      });
    } else {
      navigation.navigate('QuizWarning', {
        quizId: quiz._id,
        quizName: quiz.quizName,
        type: 'custom',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
        <MainHeader screenName="Favorite Quizzes" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[FONTS.fontRegular, { marginTop: 16 }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Favorite Quizzes" />
      <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {quizzes.length > 0 ? (
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
              {quizzes.map((quiz: any, index: number) => (
                <HistoryCard
                  key={quiz._id || index}
                  onPress={() => handleQuizPress(quiz)}
                  imageSource={IMAGES.quiz_image}
                  title={quiz.quizName || 'Quiz'}
                  startDate={formatDate(quiz.createdAt)}
                  progress={getQuestionProgress(quiz.questionIds)}
                  backgroundColor="#FFECDE"
                  borderColor="#FFA1A1"
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
                No Favorite Quizzes
              </Text>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: '#999', marginTop: 8 }]}>
                Start adding quizzes to your favorites!
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

export default FavoriteQuiz;