import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONTS } from '../Constants/theme';
import { useLibraryPaperQuestions } from '../hooks/react-query/useQuizes';

type QuizWarningProps = StackScreenProps<RootStackParamList, 'QuizWarning'>;

const warningQuestion = [
  { id: 1, text: 'Once started, quiz cannot be paused' },
  { id: 2, text: 'Leaving the quiz will submit it automatically' },
  { id: 3, text: 'Time will start immediately after beginning' },
];

const QuizWarning = ({ navigation, route }: QuizWarningProps) => {
  const { 
    // Video course params
    questionIds, 
    courseId, 
    moduleId, 
    sectionId, 
    subSectionId,
    // Library params
    quizId,
    paperId,
    // Custom quiz params
    estimatedQuestions,
    limit,
    topicId,
    // Common params
    type,
    quizName,
    durationSeconds,
  } = route.params;

  const initialMinutes = (() => {
    if (durationSeconds != null && durationSeconds > 0) {
      const m = Math.round(durationSeconds / 60);
      return Math.max(1, Math.min(60, m));
    }
    return 30;
  })();


  

  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const [showPicker, setShowPicker] = useState(false);

  // Only fetch library questions when type is 'library' (has paperId)
  const { 
    data: libraryData, 
    isLoading: isLibraryLoading 
  } = useLibraryPaperQuestions(
    quizId || '', 
    paperId || '',
  );
  console.log("Library Data:", libraryData);
  // Generate time options (1-60 minutes)
  const minutesArray = Array.from({ length: 60 }, (_, i) => i + 1);

  // Determine question count
  const getQuestionCount = () => {
  if (type === 'library' && libraryData?.data?.quiz) {
    return libraryData.data.quiz.questions?.length || 0;
  }

  if (type === 'custom') {
    return estimatedQuestions || 0;
  }

  if (Array.isArray(questionIds)) {
    return questionIds.length;
  }

  return 0;
};

  const handleStartQuiz = () => {
    const duration = selectedMinutes * 60;
    console.log("Quiz ID:", quizId);
    console.log("Type:", type);
    if (type === 'library') {
      // Navigate to Question screen with library type
      navigation.navigate('Question', {
        type: 'library',
        quizId: quizId!,
        paperId: paperId!,
        duration,
        quizName: quizName || 'Library Quiz',
      });
    } else if (type === 'custom') {
      
      // custom type

      navigation.navigate('Question', {
        type: 'custom',
  quizId: quizId!,
  topicId: topicId!,          
  limit: limit,
  duration,
  quizName: quizName || 'Custom Quiz',
      });
    } else {
      // video course type
      navigation.navigate('Question', {
        type: 'video',
        courseId: courseId!,
        moduleId: moduleId!,
        sectionId: sectionId!,
        subSectionId: subSectionId!,
        questionIds: questionIds!,
        duration,
        quizName: quizName || 'Quiz',
      });
    }
  };

  if (type === 'library' && isLibraryLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.mainBackground, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[FONTS.fontRegular, { marginTop: 16 }]}>Loading Quiz...</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Quiz Instructions" />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
          {/* total questions*/}
          <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 20 }}>
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={64}
              color={COLORS.primary}
            />
            <Text style={[FONTS.fontSemiBold, { fontSize: 24, marginTop: 16 }]}>
              Ready to Start?
            </Text>
            <Text style={[FONTS.fontRegular, { fontSize: 16, color: '#666', marginTop: 8 }]}>
              Total Questions: {getQuestionCount()}
            </Text>
            {quizName && (
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: '#999', marginTop: 4 }]}>
                {quizName}
              </Text>
            )}
          </View>


          <View style={{ 
            backgroundColor: '#fff', 
            borderRadius: 16, 
            padding: 20, 
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={[FONTS.fontSemiBold, { fontSize: 16, marginBottom: 12 }]}>
              Important Instructions:
            </Text>
            {warningQuestion.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="checkbox-marked-circle"
                  color="#4CAF50"
                  size={20}
                />
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 14, marginLeft: 12, flex: 1, color: '#333' },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </View>


          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              marginBottom: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="clock-outline"
                color={COLORS.primary}
                size={32}
              />
              <Text style={[FONTS.fontSemiBold, { fontSize: 16, marginTop: 12 }]}>
                Set Quiz Duration
              </Text>
              
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={{
                  marginTop: 16,
                  paddingHorizontal: 32,
                  paddingVertical: 12,
                  borderWidth: 2,
                  borderRadius: 12,
                  borderColor: COLORS.primary,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.primary }]}>
                  {selectedMinutes} minutes
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* picker modal */}
          <Modal visible={showPicker} transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#EEE',
                  }}
                >
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <Text style={[FONTS.fontSemiBold, { fontSize: 16 }]}>
                    Select Duration
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>

                <Picker
                  selectedValue={selectedMinutes}
                  onValueChange={setSelectedMinutes}
                >
                  {minutesArray.map((minute) => (
                    <Picker.Item
                      key={minute}
                      label={`${minute} minutes`}
                      value={minute}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </Modal>

          {/* action buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 40,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleStartQuiz}
              style={{
                backgroundColor: COLORS.primary,
                paddingHorizontal: 40,
                paddingVertical: 14,
                borderRadius: 25,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text style={[FONTS.fontSemiBold, { color: 'white', fontSize: 16 }]}>
                Start Quiz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                paddingHorizontal: 40,
                paddingVertical: 14,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: COLORS.primary,
                backgroundColor: 'white',
              }}
            >
              <Text style={[FONTS.fontSemiBold, { color: COLORS.primary, fontSize: 16 }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default QuizWarning;