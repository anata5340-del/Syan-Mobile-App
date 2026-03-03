import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS, SIZES } from '../Constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ThemeBtn from '../Components/ThemeBtn';
import { useDispatch } from 'react-redux';
import { closeDrawer } from '../redux/action/Action';
import { GlobalStyleSheet } from '../Constants/StyleSheet';






const MenuItems = [
    {
        id:"0",
        icon: IMAGES.drawer_overview,
        name: "Overview",
        navigate: "Home",
    },
    {
        id:"1",
        icon: IMAGES.drawer_video,
        name: "Video",
        navigate: "Courses",
    },
    {
        id:"2",
        icon: IMAGES.drawer_quiz,
        name: "Quiz",
        navigate: "QuizCourses",
    },
    {
        id:"3",
        icon: IMAGES.drawer_favorite,
        name: "Favorite",
        navigate: "Favorite",
    },
    {
        id:"4",
        icon: IMAGES.drawer_chat,
        name: "Chat Forum",
        navigate: "ChatForum",
    },
    
    
    
    
    
    
]


const MenuItemsSettings = [
    {
        id:"0",
        icon: IMAGES.drawer_editProfile,
        name: "Edit Profile",
        navigate: "Profile",
    },
    {
        id:"1",
        icon: IMAGES.drawer_security,
        name: "Security",
        navigate: "Security",
    },
    {
        id:"2",
        icon: IMAGES.drawer_subscription,
        name: "Subscriptions",
        navigate: "Subscriptions",
    },
    {
        id:"3",
        icon: IMAGES.drawer_invoice,
        name: "Invoices",
        navigate: "Invoices",
    },
]

const DrawerMenu = ({navigation}:any) => {

    const [settingsOpen, setSettingsOpen] = useState(false)
    const dispatch = useDispatch();

    const [active, setactive] = useState(MenuItems[0]);

    //const navigation = useNavigation<any>();


    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View
                style={{
                    flex:1,
                    // backgroundColor:colors.background,
                    paddingHorizontal:15,
                    paddingVertical:15,
                }}
            >
                <View
                    style={{
                        alignItems:'flex-end',
                        paddingVertical:30,
                        paddingRight:10
                    }}
                >
                    <Image
                        style={{alignItems:'flex-end'}}
                        source={IMAGES.headerIcons}
                    />
                </View>
                <View
                    style={[GlobalStyleSheet.flex,{
                        paddingHorizontal:15,
                        paddingBottom:20
                    }]}
                >
                    <Text style={{...FONTS.fontSemiBold,fontSize:20,color:COLORS.title}}>Main Menus</Text>
                    <TouchableOpacity
                        onPress={() => navigation.closeDrawer()}
                        activeOpacity={0.5}
                    >
                        <FeatherIcon size={24} color={COLORS.title} name='x'/>
                    </TouchableOpacity>
                </View>
                <View style={{paddingBottom:10}}>
                    {MenuItems.map((data:any,index:any) => {
                        return(
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { data.navigate === "DrawerNavigation" ? dispatch(closeDrawer()) : dispatch(closeDrawer());  navigation.navigate("StackNavigator", { screen: data.navigate, }) }}
                                key={index}
                                style={[GlobalStyleSheet.flex,{
                                    paddingVertical:5,
                                    marginBottom:0,
                                }]}
                            >
                                <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
                                    <View style={{height:45,width:45,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                        <Image
                                            source={data.icon}
                                            style={{
                                                height:24,
                                                width:24,
                                                tintColor:data.id == '9' ? '#FF8484' :data.id === '0' ? COLORS.primary : '#BDBDBD',
                                                //marginRight:14,
                                                resizeMode:'contain'
                                            }}
                                        />
                                    </View>
                                    <Text style={[FONTS.fontRegular,{color:COLORS.title,fontSize:16,opacity:.6},data.id === '0' && {...FONTS.fontSemiBold,fontSize:16,color:COLORS.primary}]}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

<TouchableOpacity
                                activeOpacity={0.8}
                                style={[GlobalStyleSheet.flex,{
                                    paddingVertical:5,
                                    marginBottom:0,
                                }]}
                            >
            <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
                                    <View style={{height:45,width:45,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                        <Image
                                            source={IMAGES.drawer_settings}
                                            style={{
                                                height:24,
                                                width:24,
                                                tintColor:1 == '9' ? '#FF8484' :2 === '0' ? COLORS.primary : '#BDBDBD',
                                                //marginRight:14,
                                                resizeMode:'contain'
                                            }}
                                        />
                                    </View>
                                    
                                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={toggleSettings}>
                                    <Text style={[FONTS.fontRegular,{color:COLORS.title,fontSize:16,opacity:.6,marginRight:8},2 === '0' && {...FONTS.fontSemiBold,fontSize:16,color:COLORS.primary}]}>Settings</Text>
                                        <FeatherIcon size={24} color={COLORS.title} name={settingsOpen ? 'chevron-down' : 'chevron-right'} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>



                            {
                                settingsOpen && (
                                    <View>
                                        {MenuItemsSettings.map((data:any,index:any) => {
                                        return(
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => { data.navigate === "DrawerNavigation" ? dispatch(closeDrawer()) : dispatch(closeDrawer());  navigation.navigate("StackNavigator", { screen: data.navigate, }) }}
                                                key={index}
                                                style={[GlobalStyleSheet.flex,{
                                                    paddingVertical:5,
                                                    marginBottom:0,
                                                }]}
                                            >
                                                <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
                                                    <View style={{height:45,width:45,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                                        <Image
                                                            source={data.icon}
                                                            style={{
                                                                height:24,
                                                                width:24,
                                                                tintColor:COLORS.secondary,
                                                                //marginRight:14,
                                                                resizeMode:'contain'
                                                            }}
                                                        />
                                                    </View>
                                                    <Text style={[FONTS.fontRegular,{color:COLORS.secondary,fontSize:16,opacity:.6},data.id === '0' && {...FONTS.fontSemiBold,fontSize:16,color:COLORS.secondary}]}>{data.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                         
                                    </View>       )
                            }
                </View>
            </View> 
        </ScrollView>
    )
}

export default DrawerMenu