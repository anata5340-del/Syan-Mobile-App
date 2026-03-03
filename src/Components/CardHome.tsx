import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '../Constants/theme';

const { width } = Dimensions.get('window');

interface HomeCardProps {
  title: string;
  startDate: string;
  progress: number;
  imageSource: ImageSourcePropType;
  leftSideColor?: string;
  onPress?: () => void;
}

const CARD_HORIZONTAL_MARGIN = 16;
const IMAGE_SIZE = width * 0.11; // responsive image
const CARD_WIDTH = width - CARD_HORIZONTAL_MARGIN * 2;

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  startDate,
  progress,
  imageSource,
  leftSideColor = COLORS.light_brown,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.cardContainer, { backgroundColor: leftSideColor }]}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.quizImage} />
      </View>

      <View style={styles.cardContent}>
        <Text numberOfLines={1} style={[styles.title, FONTS.fontMedium]}>
          {title}
        </Text>

        <Text style={[styles.date, FONTS.fontRegular]}>
          Started at: {startDate}
        </Text>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.progressText}>Completed {progress}%</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: width * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  quizImage: {
    width: '80%',
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  title: {
    fontSize: width * 0.045,
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: width * 0.035,
    color: COLORS.text,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.light_pink,
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: width * 0.032,
    color: COLORS.green,
    textAlign: 'right',
  },
});
