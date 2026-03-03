import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { COLORS, FONTS } from '../Constants/theme'
import { GlobalStyleSheet } from '../Constants/StyleSheet'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../Navigation/RootStackParamList'
import Input from '../Components/Input'
import { IMAGES } from '../Constants/Images'
import Button from '../Components/Button'
import { SafeAreaView } from 'react-native-safe-area-context';


type SingInScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({navigation} : SingInScreenProps) => {

    const [isFocused , setisFocused] = useState(false);
    const [isFocused2 , setisFocused2] = useState(false);


  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.mainBackground,}}>
        <View style={[GlobalStyleSheet.container,{justifyContent:'center',alignItems:'center',paddingVertical:40}]}>
            <Image
                style={{resizeMode:'contain',height:36}}
                source={IMAGES.headerIcons}
            />
        </View>
        <ScrollView style={{flexGrow:1,}} showsVerticalScrollIndicator={false}>
            <View style={[GlobalStyleSheet.container,{flexGrow:1,paddingBottom:0,paddingHorizontal:30,paddingTop:0}]}>
                <View style={{}}>
                    <View style={{marginBottom:30}}>
                        <Text style={[styles.title1,{color:COLORS.title}]}>Sign Up</Text>
                        <Text style={[styles.title2, {color: COLORS.title }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            onChangeText={(value) => console.log(value)}
                            isFocused={isFocused}
                            icon={<Image source={IMAGES.userInput} style={[styles.icon,{tintColor:COLORS.title}]}/>}
                            placeholder='User Name'
                        />
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Input
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            onChangeText={(value) => console.log(value)}
                            isFocused={isFocused}
                            icon={<Image source={IMAGES.emailInput} style={[styles.icon,{tintColor:COLORS.title}]}/>}
                            placeholder='User Name'
                            keyboardType={'email-address'}
                        />
                    </View>
                    <View style={{ marginBottom: 10,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            onChangeText={(value) => console.log(value)}
                            isFocused={isFocused2}
                            type={'password'}
                            placeholder='Password'
                            icon={<Image source={IMAGES.lockInput} style={[styles.icon,{tintColor:COLORS.title}]}/>}
                        />
                    </View>
                    <View style={{ marginBottom: 10,marginTop:10 }}>
                        <Input
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            onChangeText={(value) => console.log(value)}
                            isFocused={isFocused2}
                            type={'password'}
                            placeholder='Confirm Password'
                            icon={<Image source={IMAGES.lockInput} style={[styles.icon,{tintColor:COLORS.title}]}/>}
                        />
                    </View>
                </View>
                <View style={{marginTop:30}}>
                    <Button
                        title={"Sign Up"}
                        onPress={() => navigation.navigate('SignIn')}
                        text={'white'}
                        color={COLORS.secondary}
                        style={{borderRadius:52}}
                    />
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
    text:{
        ...FONTS.fontRegular,
        fontSize:14,
        color:COLORS.title,
    },
    title1:{
        ...FONTS.fontSemiBold,
         fontSize: 24,
        color: COLORS.title,
        marginBottom: 5 
    },
    title2:{
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title, 
    },
    title3:{
        ...FONTS.fontMedium,
        fontSize:14,
        color:'#8A8A8A'
    },
    icon:{
        height:28,
        width:28,
        resizeMode:'contain',
    },
})