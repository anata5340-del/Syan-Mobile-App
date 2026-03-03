// import React from 'react';
// import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
// import {COLORS, FONTS} from '../Constants/theme';
// import {StackScreenProps} from '@react-navigation/stack';
// import {RootStackParamList} from '../Navigation/RootStackParamList';
// import { useNavigation } from '@react-navigation/native';

// type CourseCardProps = {
//   title: string;
//   Imageicon: any;
//   image: string | { uri: string };
//   duration: string;
//   backgroundColor?: string;
//   onPress?:any;
// };

// const CourseCard: React.FC<CourseCardProps> = ({
//   title,
//   Imageicon,
//   image,
//   duration,
//   backgroundColor = COLORS.gray,
//   onPress,
// }) => {

//   const navigation = useNavigation();
//   return (
//     <TouchableOpacity onPress={onPress} style={[
//       styles.container,
//       {backgroundColor: backgroundColor || COLORS.gray},
//     ]}>
//       <View>
//         <Text style={[FONTS.fontSemiBold, styles.title]}>{title}</Text>
//       </View>
//       <View style={styles.contentRow}>
//         <View style={styles.durationRow}>
//             <Image source={Imageicon} style={styles.icon} />
//           <Text style={[FONTS.fontLight, styles.durationText]}>{duration}</Text>
//         </View>
//         <View>
//           <Image source={typeof image === 'string' ? { uri: image } : image} />
//         </View>
//       </View>
//     </TouchableOpacity>
      
//   );
// };

// export default CourseCard;

// const styles = StyleSheet.create({
//   container: {
//     marginTop: '6%',
//     borderRadius: 18,
//     padding: 15,
//   },
//   title: {
//     fontSize: 17,
//     color: 'black',
//   },
//   contentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   durationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop:"15%"
//   },
//   icon: {
//     marginRight:'4%'
//   },
//   durationText: {
//     fontSize: 15,
//     color: 'black',
//     textAlign:"center"
//   },
// });











import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../Constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CourseCardProps = {
  title: string;
  Imageicon?: any;
  image: string | { uri: string };
  duration: string;
  backgroundColor?: string;
  onPress?: any;
  // New props for checkbox
  isCheckboxVisible?: boolean;
  isChecked?: boolean;
  onCheckboxPress?: () => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  Imageicon,
  image,
  duration,
  backgroundColor = COLORS.gray,
  onPress,
  isCheckboxVisible = false,
  isChecked = false,
  onCheckboxPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {backgroundColor: backgroundColor || COLORS.gray},
      ]}
    >
      {/* Title Row with Checkbox */}
      <View style={styles.titleRow}>
        
        <Text
          style={[
            FONTS.fontSemiBold,
            styles.title,
            isCheckboxVisible && styles.titleWithCheckbox,
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>

      {/* Content Row */}
      <View style={styles.contentRow}>
        <View style={styles.durationRow}>
          <Image source={Imageicon} style={styles.icon} />
          {isCheckboxVisible && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onCheckboxPress?.();
            }}
            style={styles.checkboxContainer}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <MaterialCommunityIcons
              name={isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={26}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
          <Text style={[FONTS.fontLight, styles.durationText]}>{duration}</Text>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Image
            source={typeof image === 'string' ? {uri: image} : image}
            style={styles.courseImage}
          />
          
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  container: {
    marginTop: '6%',
    borderRadius: 18,
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkboxContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  title: {
    fontSize: 17,
    color: 'black',
    flex: 1,
  },
  titleWithCheckbox: {
    paddingRight: 10,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '15%',
  },
  icon: {
    marginRight: '4%',
  },
  durationText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  courseImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});