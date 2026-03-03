import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, SIZES } from '../Constants/theme';
import { NavigationProp } from '@react-navigation/native';

type Props = {
    navigation?: NavigationProp<any>,
    heading: string,
    description: string,
    ContinuePress:any,
    EndExamPress:any
}

const ConfirmModal = ({ navigation, heading, description , ContinuePress , EndExamPress }: Props) => {


    return (
        <>
            <View style={{
                alignItems:'center',
                paddingHorizontal:30,
                paddingVertical:20,
                paddingBottom:30,
                backgroundColor:COLORS.modal_background,
                borderRadius:SIZES.radius,
                marginHorizontal:30,
                width:320,
            }}>
                <View
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        marginBottom:15,
                        marginTop:10,
                    }}
                >
                    <View
                        style={{
                            height:80,
                            width:80,
                            opacity:.2,
                            backgroundColor:COLORS.secondary,
                            borderRadius:80,
                        }}
                    />
                    <View
                        style={{
                            height:65,
                            width:65,
                            backgroundColor:COLORS.secondary,
                            borderRadius:65,
                            position:'absolute',
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <FeatherIcon size={32} color={COLORS.white} name="alert-circle"/>
                    </View>
                </View>
                <Text style={{...FONTS.h5,color:COLORS.title,marginBottom:10}}>{heading}</Text>
                <Text style={{...FONTS.font,color:COLORS.text,textAlign:'center'}}>{description}</Text>
                <View style={{
                    flexDirection:'row',
                    justifyContent: 'space-between',
                    marginTop:20,
                }}>
                    <TouchableOpacity onPress={ContinuePress} style={{
                                        paddingHorizontal:20,
                                        paddingVertical:4,
                                        borderRadius:22,
                                        borderWidth:1,
                                        borderColor:COLORS.secondary,
                                        marginHorizontal:10
                                    }}>
                                        <Text style={[FONTS.fontRegular,{fontSize: 13, color: COLORS.secondary}]}>Continue</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={EndExamPress} style={{
                                        paddingHorizontal:20,
                                        paddingVertical:4,
                                        borderRadius:22,
                                        borderWidth:1,
                                        borderColor:COLORS.secondary,
                                        marginHorizontal:10,
                                        backgroundColor:COLORS.secondary
                                    }}>
                                        <Text style={[FONTS.fontRegular,{fontSize: 13, color: COLORS.white}]}>End Exam</Text>
                                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};


export default ConfirmModal;