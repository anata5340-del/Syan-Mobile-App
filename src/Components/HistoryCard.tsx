import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet , ImageSourcePropType } from 'react-native';
import { IMAGES } from '../Constants/Images';
import { FONTS , COLORS  } from '../Constants/theme';

interface QuizCardProps {
  title: string;
  startDate: string;
  progress: number; // Progress in percentage
  backgroundColor: string;
  borderColor: string;
  imageSource: ImageSourcePropType,
  onPress?: () => void;
}

const HistoryCard: React.FC<QuizCardProps> = ({ title, startDate, progress, imageSource, backgroundColor, borderColor, onPress }) => {
  return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.cardContainer,
          {
            backgroundColor: backgroundColor, // Dynamic background color
            borderColor: borderColor, // Dynamic border color
          },
        ]}
      >
        {/* Quiz Image */}
        <View>
          <Image source={imageSource} />
        </View>

        {/* Quiz Title and Start Date */}
        <View style={styles.textContainer}>
          <Text style={[FONTS.fontSemiBold, styles.quizTitle]}>{title}</Text>
          <Text style={[FONTS.fontLight, styles.quizDate]}>Started At: {startDate}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {/* Completion Percentage */}
        <Text style={[FONTS.fontLight, styles.progressText]}>Completed {progress}%</Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 1,
    paddingVertical:'3%',
    width: '47%',
    marginBottom: '4%',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4%',
  },
  quizTitle: {
    fontSize: 16,
    color:COLORS.text,
    textAlign: 'center',
  },
  quizDate: {
    fontSize: 10,
    color:COLORS.text,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 10,
    width: 120,
    borderRadius: 5,
    borderWidth:1,
    borderColor:COLORS.green,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.green,
  },
  progressText: {
    fontSize: 10,
    color: 'black',
    marginTop: 5,
  },
});

export default HistoryCard;
