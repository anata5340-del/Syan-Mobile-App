import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, SIZES } from '../Constants/theme';
import { NavigationProp } from '@react-navigation/native';
import { IMAGES } from '../Constants/Images';

type ModalProps = {
  laterPress: () => void;
  doItPress: () => void;
};

const CompleteYourProfileModal = ({ laterPress, doItPress }: ModalProps) => {
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: '8%',
          paddingVertical: '10%',
          backgroundColor: COLORS.modal_background,
          borderRadius: SIZES.radius,
          width: SIZES.width - 60,
        }}
      >
        <Text style={{ ...FONTS.h3, color: COLORS.secondary, marginBottom: 10 }}>
         Complete Your Profile
        </Text>
        <View>
                            <Image source={IMAGES.homeImage2} />
                          </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={laterPress}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 4,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: COLORS.secondary,
              marginHorizontal: 10,
            }}
          >
            <Text
              style={[
                FONTS.fontRegular,
                { fontSize: 13, color: COLORS.secondary },
              ]}
            >
              I will do it later
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={doItPress}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 4,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: COLORS.secondary,
              marginHorizontal: 10,
              backgroundColor: COLORS.secondary,
            }}
          >
            <Text
              style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.white }]}
            >
              Lets do it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CompleteYourProfileModal;
