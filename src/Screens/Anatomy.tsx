import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import { Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { NavigationProp } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetTOC from '../Components/BotomSheets/BottomSheetTOC';
// import Video, {VideoRef} from 'react-native-video';


const { height } = Dimensions.get('window');

const Anatomy = ({ navigation }: { navigation: NavigationProp<any> }, ref: React.Ref<any>) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHeartTouch, setIsHeartTouch] = useState(false);


 const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<number[]>([]);
  const [contentSections, setContentSections] = useState<
    { title: string; content: string[] }[]
  >([]);



  useEffect(() => {
      // Mock Data Example (replace later with API data)
      setContentSections([
        {
          title: 'Acute Coronary Syndrome',
          content: [
            'Acute coronary syndrome (ACS) refers to a range of conditions associated with sudden, reduced blood flow to the heart.',
            'It includes unstable angina, non-ST-elevation myocardial infarction (NSTEMI), and ST-elevation myocardial infarction (STEMI).',
            'Common symptoms include chest pain, sweating, and shortness of breath.',
          ],
        },
        {
          title: 'Pathophysiology',
          content: [
            'ACS usually results from rupture of an atherosclerotic plaque and subsequent thrombus formation.',
            'This limits or completely obstructs blood flow to myocardial tissue, causing ischemia and potential necrosis.',
          ],
        },
        {
          title: 'Diagnosis',
          content: [
            'Diagnosis is based on symptoms, ECG findings, and cardiac biomarkers (troponins).',
            'Early recognition and management are crucial to improving outcomes.',
          ],
        },
        {
          title: 'Treatment Overview',
          content: [
            'Initial management involves MONA (Morphine, Oxygen, Nitrates, Aspirin).',
            'Definitive treatment may include percutaneous coronary intervention (PCI) or thrombolysis.',
          ],
        },
      ]);
    }, []);
  
    const handleScrollToSection = (index: number) => {
      const y = sectionPositions.current[index];
      if (y !== undefined) {
        scrollViewRef.current.scrollTo({ y, animated: true });
        bottomSheetRef.current?.close();
      }
    };


  const handleTouch = () => {
    setIsHeartTouch(!isHeartTouch);
  }

  // const videoRef = useRef<VideoRef>(null);
  // const background = require('../assets/images/mdf.mp4');

  const toggleExpend = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName='Anatomy' heartIcon />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: -15,
            paddingHorizontal: 15,
            paddingTop: 8
          }}>


          <View style={{ justifyContent: 'center' }}>
            <Text
              style={[FONTS.fontRegular, { fontSize: 16, color: COLORS.black }]}>
              Acute coronary syndrome
            </Text>
          </View>

          <View style={{ justifyContent: 'space-between', flexDirection: "row", marginVertical: 5 }}>
            <View>
              <Text
                style={[FONTS.fontLight, { fontSize: 14, color: COLORS.black }]}>
                13 MINUTES
              </Text>
            </View>
            <View>
              <Text
                style={[FONTS.fontLight, { fontSize: 14, color: COLORS.black }]}>
                ID: 1001
              </Text>
            </View>
          </View>

          <View style={{
            backgroundColor: COLORS.light_pink,
            marginRight: '35%',
            padding: '2%',
            borderRadius: 7,
            marginVertical: 10
          }}>
            <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.black }]}>By: Dr M.Sufyan Ahmed</Text>
          </View>

          {/* Video
                                    {/* <Video 
                        // Can be a URL or a local file.
                        source={background}
                        // Store reference  
                        ref={videoRef}
                        // Callback when remote video is buffering                                      
                        // onBuffer={onBuffer}
                        // Callback when video cannot be loaded              
                        // onError={onError}               
                        style={styles.backgroundVideo} 
                    /> */}



          <View style={{
            borderRadius: 22,
            overflow: "hidden",
            marginVertical: 22
          }}>
            <ImageBackground source={IMAGES.courses_pic1} resizeMode='cover'>
              <View style={{
                backgroundColor:COLORS.video_images_background,
                opacity: 0.7
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: '18%'
                }}>
                  <TouchableOpacity>
                    <FeatherIcon
                      size={40}
                      color={COLORS.white}
                      name={'video'}
                      style={{ paddingHorizontal: '2%' }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={{}}>
            <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.black, marginBottom: 5 }]}>Description</Text>
            <View style={{ backgroundColor: COLORS.gray, padding: 10, paddingHorizontal: 15, borderRadius: 15 }}>
              {/* Notes Section */}
                      {contentSections.map((section, index) => (
                        <View
                          key={index}
                          onLayout={(event) => {
                            const { y } = event.nativeEvent.layout;
                            sectionPositions.current[index] = y;
                          }}
                          style={styles.sectionContainer}
                        >
                          <Text style={styles.sectionTitle}>{section.title}</Text>
                          {section.content.map((paragraph, i) => (
                            <Text key={i} style={styles.paragraph}>
                              {paragraph}
                            </Text>
                          ))}
                        </View>
                      ))}
            </View>
          </View><View style={{ paddingHorizontal: '2%', marginVertical: '5%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.black }]}>Have comments about this video?</Text>
            <TouchableOpacity>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.primary }]}>Leave us feedback</Text>
            </TouchableOpacity>
          </View><View style={{ backgroundColor: COLORS.small_card_background, borderWidth: 1, borderColor: COLORS.light_pink, borderRadius: 20, padding: 15, marginBottom: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
              <Text style={[FONTS.fontRegular, { fontSize: 18, color: COLORS.black }]}>Author</Text>
              <Image source={IMAGES.headerIcons} style={{ height: 25, width: 110 }} resizeMode='contain' />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.black }]}>The SYAN Team</Text>
              <Text style={[FONTS.fontLight, { fontSize: 13, color: COLORS.black }]}>A dedicated team of UK doctors who want to make learning medicine beautifully simple.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
        <View style={{ marginTop: "2%" }}>
          <View style={{ marginBottom: "2%" }}>
            <Text style={[FONTS.fontSemiBold, { fontSize: 16, color: COLORS.black }]}>Further Study:</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={() => navigation.navigate("Notes")} style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'black', borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3, alignItems: "center" }}>
              <FeatherIcon size={20} color={COLORS.black} name={'align-right'} />
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.black, paddingLeft: 9 }]}>Read Notes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Quiz")} style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'black', borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3, alignItems: "center" }}>
              <FeatherIcon size={20} color={COLORS.black} name={'check-square'} />
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.black, paddingLeft: 9 }]}>Practice Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>



      {/* Floating Keypoints Button */}
      <TouchableOpacity
        style={styles.keypointsButton}
        onPress={() => {
          bottomSheetRef.current?.snapToIndex(1);
        }}
      >
        <Text style={styles.keypointsText}>Keypoints</Text>
      </TouchableOpacity>

      <BottomSheetTOC
        ref={bottomSheetRef}
        items={contentSections}
        onSelect={handleScrollToSection}
        label="Jump to Section"
      />
    </View>
  )
}

export default Anatomy

const styles = StyleSheet.create({
  expandedContent: {
    marginVertical: 10,
  },
  expandedTitle: {
    ...FONTS.fontSemiBold,
    fontSize: 15,
    color: COLORS.black,
  },
  expandedDescription: {
    ...FONTS.fontRegular,
    fontSize: 13,
    color: COLORS.black,
  },
 keypointsButton: {
    position: 'absolute',
    right: 0,
    top: height / 2 - 40,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  keypointsText: {
    ...FONTS.fontRegular,
    fontSize: 11,
    color: COLORS.white,
    transform: [{ rotate: '-90deg' }],
  },
  sectionContainer: { marginBottom: 25 },
  sectionTitle: { ...FONTS.fontSemiBold, fontSize: 18, color: COLORS.title, marginBottom: 8 },
  paragraph: { ...FONTS.fontRegular, fontSize: 14, color: COLORS.text, lineHeight: 22 },
})