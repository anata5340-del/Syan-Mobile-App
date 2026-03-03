import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

interface MainHeaderProps {}

const SimpleHeader: React.FC<MainHeaderProps> = ({ }) => {
  const theme = useTheme();
  const { colors } = theme;
  const navigation = useNavigation();

  return (
        <View style={[GlobalStyleSheet.container, { paddingHorizontal: 25, padding: 0, paddingTop: 30 }]}>
          <View style={[GlobalStyleSheet.flex]}>
            {/* Go back button */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FeatherIcon
                size={30}
                color={COLORS.title}
                name={'arrow-left-circle'}
                style={{ paddingVertical: '3%' }}
              />
            </TouchableOpacity>

            {/* Drawer icon */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.openDrawer()}
                style={[GlobalStyleSheet.background3]}>
                <Image
                  style={[GlobalStyleSheet.image3, { tintColor: '#5F5F5F' }]}
                  source={IMAGES.gridHome}
                />
              </TouchableOpacity>
            </View>
          </View>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  TextInput: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.title,
    borderRadius: 61,
    paddingHorizontal: '20%',
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
