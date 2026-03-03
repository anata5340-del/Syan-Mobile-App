import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {IMAGES} from '../Constants/Images';
import {COLORS, FONTS} from '../Constants/theme';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import * as Progress from 'react-native-progress';
import CourseCard from '../Components/CourseCard';
import ScreenBottomTab from '../Components/ScreenBottomTab';


const tabs = [
  { name: 'notes', label: 'Read Notes', icon: 'align-right', screen: 'ReadNotes' },
  { name: 'quiz', label: 'Quiz', icon: 'check-square', screen: 'Quiz' },
  { name: 'videos', label: 'Videos', icon: 'play', screen: 'Videos' },
];


type HomeScreenProps = StackScreenProps<RootStackParamList, 'ReadNotes'>;

const ReadNotes = ({navigation}: HomeScreenProps) => {

  return (
    <View style={{backgroundColor: COLORS.mainBackground, flex: 1}}>
      <MainHeader screenName="Anatomy" />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: -15,
            paddingHorizontal: 15,
            marginBottom:25
          }}>

          <View
            style={{
              alignItems: 'center',
            }}>
            <Progress.Bar
              progress={0.7}
              width={200}
              height={8}
              borderRadius={28}
              animated
              animationType="spring"
              color="#F9954B"
            />
            <Text
              style={[
                FONTS.fontSemiBold,
                {
                  fontSize: 10,
                  color: '#227777',
                  textAlign: 'right',
                  marginLeft: '30%',
                  paddingVertical: '2%',
                },
              ]}>
              Completed 84%
            </Text>
          </View>

          <CourseCard onPress={() => navigation.navigate("Notes")} title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration='Read Notes' />
            <CourseCard onPress={() => navigation.navigate("Notes")} title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration='Read Notes' />
              <CourseCard onPress={() => navigation.navigate("Notes")} title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration='Read Notes' />
                <CourseCard onPress={() => navigation.navigate("Notes")} title="Alzheimer's disease" videoIcon={IMAGES.icon_readnotes} skullIcon={IMAGES.icon_skull} duration='Read Notes' />
         
        </View>

        
      </ScrollView>
      <ScreenBottomTab
      tabs={tabs}
      navigation={navigation}
    />
    </View>
  )
}

export default ReadNotes

const styles = StyleSheet.create({})