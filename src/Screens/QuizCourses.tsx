import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { COLORS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import CourseComponent from '../Components/CourseComponent';
import { useQuizzes } from '../hooks/react-query/useQuizes';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import Loader from '../Components/Loader';
import EmptyState from '../Components/EmptyState';

type Props = StackScreenProps<RootStackParamList, 'QuizCourses'>;

const QuizCourses = ({ navigation }: Props) => {
  const { data, isLoading, isError, error, refetch } = useQuizzes();

  if (isError) {
    const isNoData = data?.data?.quizes.length === 0;
    return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName={data?.data?.quiz?.name || "Quiz Courses"} />

      <EmptyState
        type={isNoData ? "noData" : "error"}
        message={isNoData ? "No data available." : "Failed to load Quiz Library."}
        showButton
        buttonText={isNoData ? "Go Back" : "Try Again"}
        onRetry={isNoData ? () => navigation.goBack() : refetch}
      />
    </View>
  );
  }

  const quizzes = data?.data?.quizes || [];

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Quiz Courses" drawarNavigation />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>

          {/* Loader */}
          {isLoading && (
            <Loader visible={true} />
          )}

        {quizzes.map((quiz: any) => (
          <CourseComponent
            key={quiz._id}
            backgroundColor={quiz.color || COLORS.primary}
            heading={quiz.name}
            image={{ uri: quiz.image }}
            isAccessible={quiz.isAccessible}
            duration={'2hr'}  // will update later after we know correct field
            users={'—'}       // backend does not provide users count yet
            onPress={() =>
              navigation.navigate('SelectQuiz', {
                quizId: quiz._id,
                quizName: quiz.name,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default QuizCourses;
