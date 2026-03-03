import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../Constants/theme';
import { IMAGES } from '../Constants/Images';

interface CourseCardProps {
  backgroundColor: string;
  heading: string;
  image: any; // Image source, can be imported from IMAGES or passed dynamically
  users: string;
  duration: string;
  onPress: () => void;
  isAccessible: boolean;
}

const CourseComponent: React.FC<CourseCardProps> = ({
  backgroundColor,
  heading,
  image,
  users,
  duration,
  onPress,
  isAccessible,
}) => {
  return (
    <TouchableOpacity  style={[
        styles.container,
      ]}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={!isAccessible}>
      <ImageBackground source={image} resizeMode="cover">
        <View style={[styles.overlay, { backgroundColor }]}>
          {/* Unlock Icon */}
          <View style={styles.unlockIconContainer}>
            <Image source={isAccessible ? IMAGES.icon_unlock : IMAGES.icon_lock} />
          </View>

          {/* Center Heading */}
          <View style={styles.headingContainer}>
            <Text style={[FONTS.fontSemiBold, styles.headingText]}>{heading}</Text>
          </View>

          {/* User and Duration Info */}
          <View style={styles.infoContainer}>
            {/* Users Info */}
            <View style={styles.infoSection1}>
              <FeatherIcon size={20} color={COLORS.white} name="users" style={styles.icon} />
              <Text style={[FONTS.fontRegular, styles.infoText]}>{users}</Text>
            </View>
            {/* Duration Info */}
            <View style={styles.infoSection2}>
              <FeatherIcon size={20} color={COLORS.white} name="clock" style={styles.icon} />
              <Text style={[FONTS.fontRegular, styles.infoText]}>{duration}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    overflow: 'hidden',
    marginVertical: 10,
  },
  overlay: {
    opacity: 0.7,
  },
  unlockIconContainer: {
    alignItems: 'flex-end',
    top: 10,
    right: 10,
  },
  headingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '5%',
    textAlign: 'center',
  },
  headingText: {
    fontSize: 24,
    color: COLORS.white,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '5%',
  },
  infoSection1: {
    flexDirection:'row',justifyContent:"center",alignItems:'center' ,borderRightWidth:1,borderColor:COLORS.white,paddingRight:5
  },
  infoSection2:{
    flexDirection:'row',justifyContent:"center",alignItems:'center'
  },
  icon: {
    paddingHorizontal: '2%',
  },
  infoText: {
    fontSize: 15,
    color: COLORS.white,
    paddingTop: 5,
  },
});

export default CourseComponent;
