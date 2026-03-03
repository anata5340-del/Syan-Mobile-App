
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {IMAGES} from '../Constants/Images';
import {COLORS} from '../Constants/theme';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import { Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'ChatForum'>;

const ChatForum = ({navigation}: HomeScreenProps) => {
  return (
    <View style={{backgroundColor: COLORS.mainBackground, flex: 1}}>
      <MainHeader screenName="Chat Forums" drawarNavigation />
        <ScrollView contentContainerStyle={{paddingHorizontal: 20, flexGrow: 1, justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
            
            {/* Coming Soon Card */}
            <View style={styles.comingSoonContainer}>
              <View style={styles.comingSoonCard}>
                {/* Logo/Icon Placeholder */}
                <View style={styles.logoContainer}>
                  <Image 
                    source={IMAGES.splashSyan} // Replace with your app logo
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Coming Soon Text */}
                <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
                <Text style={styles.comingSoonSubtitle}>
                  Chat Forums feature is under development
                </Text>

                {/* Decorative Elements */}
                <View style={styles.decorativeDotsContainer}>
                  <View style={[styles.dot, {backgroundColor: '#227777'}]} />
                  <View style={[styles.dot, {backgroundColor: '#2A9D8F'}]} />
                  <View style={[styles.dot, {backgroundColor: '#E76F51'}]} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                  Connect with fellow learners, share knowledge, and engage in meaningful discussions. Stay tuned!
                </Text>

                {/* Notification Button */}
                <TouchableOpacity style={styles.notifyButton}>
                  <FeatherIcon name="bell" size={18} color="#FFFFFF" />
                  <Text style={styles.notifyButtonText}>Notify Me</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Original commented code below */}
            {/* <View
            style={{
            marginHorizontal: -15,
            paddingHorizontal: 10,
            }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[FONTS.fontSemiBold, {fontSize: 19, color: '#227777'}]}>
                    Joined Chat Forums 
                    </Text>
                </View>

                <View style={{
                  flexDirection:"row",
                  marginVertical:"5%",
                  gap:10,
                  flexWrap:'wrap',
                  justifyContent:'center',
                }}>
                  <View style={{
                    backgroundColor:'#FFFFFF',
                    shadowColor:"black",
                    shadowOffset:{
                      width:0,
                      height:3
                    },
                    elevation:9,
                    justifyContent: 'center',
                    padding:'5%'
                  }}>
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                      <Image source={IMAGES.joined_chat} />
                    </View>
                    <View style={{marginVertical:'7%'}}>
                      <Text style={[FONTS.fontRegular,{fontSize: 13, color: 'black'}]}>Medical Lectures</Text>
                    </View>
                    <View style={{
                      flexDirection:'row',
                      justifyContent: 'space-around',
                      alignItems:'center',
                      flex:1
                    }}>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm1} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm2} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{
                    backgroundColor:'#FFFFFF',
                    shadowColor:"black",
                    shadowOffset:{
                      width:0,
                      height:3
                    },
                    elevation:9,
                    justifyContent: 'center',
                    padding:'5%'
                  }}>
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                      <Image source={IMAGES.joined_chat} />
                    </View>
                    <View style={{marginVertical:'7%'}}>
                      <Text style={[FONTS.fontRegular,{fontSize: 13, color: 'black'}]}>Medical Lectures</Text>
                    </View>
                    <View style={{
                      flexDirection:'row',
                      justifyContent: 'space-around',
                      alignItems:'center',
                      flex:1
                    }}>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm1} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm2} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{
                    backgroundColor:'#FFFFFF',
                    shadowColor:"black",
                    shadowOffset:{
                      width:0,
                      height:3
                    },
                    elevation:9,
                    justifyContent: 'center',
                    padding:'5%'
                  }}>
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                      <Image source={IMAGES.joined_chat} />
                    </View>
                    <View style={{marginVertical:'7%'}}>
                      <Text style={[FONTS.fontRegular,{fontSize: 13, color: 'black'}]}>Medical Lectures</Text>
                    </View>
                    <View style={{
                      flexDirection:'row',
                      justifyContent: 'space-around',
                      alignItems:'center',
                      flex:1
                    }}>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm1} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm2} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{
                    backgroundColor:'#FFFFFF',
                    shadowColor:"black",
                    shadowOffset:{
                      width:0,
                      height:3
                    },
                    elevation:9,
                    justifyContent: 'center',
                    padding:'5%'
                  }}>
                    <View style={{justifyContent: 'center',alignItems:'center'}}>
                      <Image source={IMAGES.joined_chat} />
                    </View>
                    <View style={{marginVertical:'7%'}}>
                      <Text style={[FONTS.fontRegular,{fontSize: 13, color: 'black'}]}>Medical Lectures</Text>
                    </View>
                    <View style={{
                      flexDirection:'row',
                      justifyContent: 'space-around',
                      alignItems:'center',
                      flex:1
                    }}>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm1} />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image source={IMAGES.joined_chat_btm2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            </View> */}
        </ScrollView>
    </View>
  )
}

export default ChatForum

const styles = StyleSheet.create({
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    width: '90%',
    maxWidth: 400,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#227777',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#227777',
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  decorativeDotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  notifyButton: {
    flexDirection: 'row',
    backgroundColor: '#227777',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#227777',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  notifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})