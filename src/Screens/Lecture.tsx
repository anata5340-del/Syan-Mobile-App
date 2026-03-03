import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { COLORS, FONTS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import Loader from '../Components/Loader';
import { useModuleSections } from '../hooks/react-query/useVideoCourses';

type Props = StackScreenProps<RootStackParamList, 'Lecture'>;

const Lecture = ({ navigation, route }: Props) => {
  const { courseId, moduleId, moduleName } = route.params;

  const { data, isLoading, isError } = useModuleSections(
    courseId,
    moduleId
  );
 

  const sections = data?.sections || [];
  const subSections = sections[0]?.subSections || [];

  if (isError) {
    return <Text style={{ color: 'red' }}>Failed to load lectures</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader screenName={moduleName || 'Lecture'} />

      {isLoading && <Loader visible />}

      <ScrollView>
        <View style={{ paddingHorizontal: 15 }}>
          {subSections.map((sub: any) => (
            <TouchableOpacity
              key={sub._id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('LearningTabs', {
                  courseId,
                  moduleId,
                  sectionId: sections[0]?._id,
                  subSectionId: sub._id,
                  subSectionName: sub.name,
                  subSectionBlocks: sub.subSectionBlocks,
                })
              }
              activeOpacity={0.8}
            >
              {/* Image from API */}
              <Image
                source={{ uri: sub.image }}
                style={styles.image}
                resizeMode="contain"
              />

              {/* Title */}
              <Text style={styles.title}>{sub.name}</Text>

              {/* Block count */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  Topics: {sub.subSectionBlocks?.length || 0}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Lecture;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 12,
    marginVertical: 12,
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },
  title: {
    ...FONTS.fontSemiBold,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#F9954B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
  },
  badgeText: {
    ...FONTS.fontSemiBold,
    fontSize: 14,
    color: 'white',
  },
});
