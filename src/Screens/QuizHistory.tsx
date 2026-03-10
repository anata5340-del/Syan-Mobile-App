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
import { useQuizStatuses } from '../hooks/react-query/useFavorites';
import { parseQuizStatusUrl } from '../utils/parseQuizStatusUrl';
import type { QuizStatus } from '../api/favorites.services';

type QuizHistoryScreenProps = StackScreenProps<RootStackParamList, 'QuizHistory'>;

const QuizHistory = ({ navigation }: QuizHistoryScreenProps) => {
  const { data: quizStatuses, isLoading, error } = useQuizStatuses();

  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleQuizPress = (quiz: QuizStatus) => {
    console.log("Quiz:", quiz);
    const quizName = quiz.quizName || 'Quiz';
    const parsed = quiz.url ? parseQuizStatusUrl(quiz.url, quizName) : null;
    console.log("Parsed:", parsed?.type);

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
        quizName,
        type: 'custom',
      });
    }
  };

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName='Quiz History' drawarNavigation />
      <View
        style={{
          marginHorizontal: -15,
          paddingHorizontal: 10,
        }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20 }}>

          {isLoading ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <ActivityIndicator size="large" color="#227777" />
              <Text style={[FONTS.fontRegular, { marginTop: 10, color: COLORS.text }]}>
                Loading quiz history...
              </Text>
            </View>
          ) : error ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <Text style={[FONTS.fontRegular, { color: '#FF0000' }]}>
                Error loading quiz history
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={{
                  marginTop: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor: '#227777',
                  borderRadius: 8
                }}
              >
                <Text style={[FONTS.fontRegular, { color: '#FFFFFF' }]}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          ) : quizStatuses && quizStatuses.length > 0 ? (
            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              gap: 7, 
              flexWrap: 'wrap', 
              flexShrink: 1, 
              marginBottom: '45%' 
            }}>
              {quizStatuses.map((quiz) => (
                <HistoryCard
                  key={quiz._id}
                  onPress={() => handleQuizPress(quiz)}
                  imageSource={IMAGES.quiz_image}
                  title={quiz.quizName || 'Quiz'}
                  startDate={formatDate(quiz.updatedAt)}
                  progress={quiz.progress || 0}
                  backgroundColor='#FFD0AD'
                  borderColor='#FFA7AF'
                />
              ))}
            </View>
          ) : (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <Text style={[FONTS.fontRegular, { fontSize: 16, color: COLORS.text }]}>
                No quiz history available
              </Text>
              <Text style={[FONTS.fontLight, { 
                fontSize: 14, 
                color: COLORS.text, 
                marginTop: 10,
                textAlign: 'center',
                paddingHorizontal: 40
              }]}>
                Start a quiz to see your progress here
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default QuizHistory;