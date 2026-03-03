import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { IMAGES } from '../Constants/Images';
import { COLORS } from '../Constants/theme';


type OboardHeaderProp = {
    icon?: string;
}

// Reusable Header Component
const HeaderOnboarding = ({icon} : OboardHeaderProp) => {
    const navigation = useNavigation();

    return (
        <View style={{ flexDirection: 'row', marginTop: '7%' }}>
            {/* Arrow icon wrapped in TouchableOpacity for goBack functionality */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <FeatherIcon 
                    size={30} 
                    color={COLORS.title} 
                    name={icon}
                    style={{ paddingVertical:'3%' , }}
                />
            </TouchableOpacity>

            {/* Header Icon Image */}
            <Image
                style={{
                    width: 240,
                    height: 45,
                    resizeMode: 'contain'
                }}
                source={IMAGES.headerIcons}
            />
            </View>
    );
};

export default HeaderOnboarding;
