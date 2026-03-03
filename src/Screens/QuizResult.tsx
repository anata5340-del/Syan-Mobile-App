import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../Constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import { PieChart } from 'react-native-chart-kit';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'QuizResult'>;

const QuizResult = ({ navigation, route }: HomeScreenProps) => {
  const { summary, questions, submissions, meta , quizId } = route.params;

  console.log('Quiz Result Route Params:', route.params);

  const data = [
    {
      name: 'Correct',
      population: summary.correct,
      color: '#277C72',
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    },
    {
      name: 'Incorrect',
      population: summary.incorrect,
      color: '#EF6A77',
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    },
    {
      name: 'Unanswered',
      population: summary.unanswered,
      color: '#dedef5',
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    },
  ];

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text
                style={[
                  FONTS.fontSemiBold,
                  { fontSize: 24, color: '#227777', textAlign: 'center' },
                ]}
              >
                You're all done.
              </Text>

              <Text
                style={[
                  FONTS.fontLight,
                  { fontSize: 15, color: '#227777', textAlign: 'center' },
                ]}
              >
                You scored {summary.score}/{summary.total}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: '7%',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Library', {
              quizId: quizId,
            })}
            style={{
              paddingHorizontal: 25,
              paddingVertical: 4,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: '#227777',
            }}
          >
            <Text style={[FONTS.fontLight, { fontSize: 12, color: '#227777' }]}>
              Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.replace('QuizWarning', {
                ...meta, // SAME quiz identifiers
              })
            }
            style={{
              paddingHorizontal: 25,
              paddingVertical: 4,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: '#227777',
              backgroundColor: '#227777',
            }}
          >
            <Text
              style={[FONTS.fontLight, { fontSize: 12, color: COLORS.white }]}
            >
              Retake Exam
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#FFE3E6',
            borderRadius: 10,
            paddingHorizontal: '5%',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: '4%',
            }}
          >
            <Text
              style={[FONTS.fontRegular, { fontSize: 15, color: COLORS.black }]}
            >
              Overall performance
            </Text>
          </View>

          <PieChart
            data={data}
            width={SIZES.width - 60}
            height={200}
            chartConfig={{
              color: () => '#5384d7',
              labelColor: () => COLORS.text,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'0'}
            center={[10, 6]}
          />
        </View>

        <View
          style={{
            marginVertical: '6%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('QuizExplanations', {
                questions,
                submissions,
                meta,
              })
            }
            style={{
              paddingHorizontal: 25,
              paddingVertical: 4,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: '#227777',
              backgroundColor: '#227777',
            }}
          >
            <Text
              style={[FONTS.fontLight, { fontSize: 12, color: COLORS.white }]}
            >
              Review Answers
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default QuizResult;
