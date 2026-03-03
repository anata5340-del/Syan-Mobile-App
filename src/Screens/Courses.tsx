import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { COLORS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import CourseComponent from '../Components/CourseComponent';
import { useVideoCourses } from '../hooks/react-query/useVideoCourses';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import Loader from '../Components/Loader';
import EmptyState from '../Components/EmptyState';   // <-- Add this

type CourseScreenProps = StackScreenProps<RootStackParamList, 'Courses'>;

const Courses = ({ navigation }: CourseScreenProps) => {
  const { data, isLoading, isError, refetch, error } = useVideoCourses();

  const videoCourses = data?.videoCourses || [];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName="Courses" drawarNavigation />
      
      {isLoading && <Loader visible={true} />}

      {!isLoading && (isError || videoCourses.length === 0) && (
        <EmptyState
          type={isError ? 'error' : 'noData'}
          message={
            isError
              ? error?.message || 'Failed to load courses.'
              : 'No courses available at the moment.'
          }
          showButton
          buttonText={isError ? 'Try Again' : 'Go Back'}
          onRetry={isError ? refetch : () => navigation.goBack()}
        />
      )}

      {!isLoading && !isError && videoCourses.length > 0 && (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
            {videoCourses.map((course: any) => (
              <CourseComponent
                key={course._id}
                backgroundColor={course.color}
                heading={course.name}
                image={{ uri: course.image }}
                isAccessible={course.isAccessible}
                duration="-"
                users="-"
                onPress={() =>
                  navigation.navigate('Modules', {
                    courseId: course._id,
                    courseName: course.name,
                  })
                }
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Courses;
