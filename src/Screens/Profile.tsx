import React, { useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { IMAGES } from '../Constants/Images';
import Input from '../Components/Input';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '../Components/Button';
import { COLORS, FONTS } from '../Constants/theme';
import MainHeader from '../layout/MainHeader';
import { useAuthStore } from '../stores/auth.store';
import { ProfileForm, FieldConfig } from '../types/profile';
import CnicUploadBox from '../Components/CnicUploadBox';


const FIELD_CONFIG: Record<keyof ProfileForm, FieldConfig> = {
  firstName: {
    label: 'First Name',
    placeholder: 'Enter your first name',
  },
  lastName: {
    label: 'Last Name',
    placeholder: 'Enter your last name',
  },
  phone: {
    label: 'Phone Number',
    placeholder: 'e.g. +923xxxxxxxxx',
    keyboardType: 'phone-pad',
  },
  email: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
  country: {
    label: 'Country',
    placeholder: 'Enter your country',
  },
  city: {
    label: 'City',
    placeholder: 'Enter your city',
  },
  address: {
    label: 'Address',
    placeholder: 'Enter your full address',
  },
  institute: {
    label: 'Institute',
    placeholder: 'Your school/college/university',
  },
  jobStatus: {
    label: 'Job Designation',
    placeholder: 'Enter your job title',
  },
  jobLocation: {
    label: 'Job Location',
    placeholder: 'Where you work?',
  },
  yearOfGraduation: {
    label: 'Graduation Year',
    placeholder: 'YYYY',
    keyboardType: 'number-pad',
  },
  cnic: {
    label: 'CNIC/Passport Number',
    placeholder: 'xxxx-xxxxxxx-x',
    keyboardType: 'number-pad',
  }
};


const Profile: React.FC = () => {

  const [imageUrl, setImageUrl] = useState('');



  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    country: user?.country || '',
    city: user?.city || '',
    address: user?.address || '',
    institute: user?.institute || '',
    jobStatus: user?.jobStatus || '',
    jobLocation: user?.jobLocation || '',
    yearOfGraduation: user?.yearOfGraduation || '',
    cnic: user?.cnic || '',

  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };



  const onSubmit = async () => {
    try {
      setLoading(true);
      // call API update here
      // const res = await updateUser(user._id, form);

      // Fake delay
      setTimeout(() => {
        setUser({ ...user, ...form });
        setLoading(false);
      }, 1000);
    } catch (e) {
      setLoading(false);
    }
  };

  if (!user) return null;

  const pickCnicImage = async (type: 'front' | 'back') => {
    const image = await ImagePicker.openPicker({
      width: 600,
      height: 200,
      cropping: true,
      compressImageQuality: 0.8,
      cropperStatusBarColor: '#000000',
      cropperToolbarColor: '#000000',
      cropperToolbarTitle: 'Crop CNIC Image',
      cropperToolbarWidgetColor: '#ffffff',
      freeStyleCropEnabled: true,
    });

    handleChange(
      type === 'front' ? 'cnicFrontImage' : 'cnicBackImage',
      image.path
    );
  };



  // const handleImageSelect = () => { if(Platform.OS == 'android'){ try { ImagePicker.openPicker({ width: 200, height: 200, cropping: true }).then((image: { path: React.SetStateAction<string>; }) => { setImageUrl(image.path); }); } catch (e) { console.log(e); } } }




  return (
    <View style={{ backgroundColor: '#FFF0F2', flex: 1 }}>
      <MainHeader drawarNavigation />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, marginBottom: 50 }}>
        <View style={[GlobalStyleSheet.container, { backgroundColor: '#FFF0F2', borderRadius: 15 }]}>
          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <View style={{}}>
              <View style={styles.imageborder}>
                <Image
                  resizeMode='contain'
                  style={{ height: 82, width: 82, borderRadius: 50 }}
                  source={imageUrl ? { uri: imageUrl } : IMAGES.splashSyan}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { }}
                style={[styles.WriteIconBackground, { backgroundColor: COLORS.title }]}
              >
                <View style={styles.WriteIcon}>
                  <Image
                    style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: COLORS.card }}
                    source={IMAGES.gridHome}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexShrink: 1, alignItems: 'center', marginHorizontal: '10%' }}>
              <Text style={[FONTS.fontMedium, { fontSize: 19, color: COLORS.title }]}>Profile Details</Text>
              <Text style={[FONTS.fontRegular, { fontSize: 12, color: COLORS.title, textAlign: "center" }]}>You have full control to manage your own account setting.</Text>
            </View>
          </View>
        </View>

        {/* LOADING */}
        {loading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
        )}




        <View style={[GlobalStyleSheet.container, { backgroundColor: COLORS.mainBackground, marginTop: 10, paddingVertical: 10, borderRadius: 15 }]}>
          {/* Form Fields */}
          {Object.keys(form).map((key) => {
            const fieldKey = key as keyof ProfileForm;
            const field = FIELD_CONFIG[fieldKey];

            return (
              <View key={key} style={styles.inputWrapper}>
                <Input
                  label={field?.label}
                  placeholder={field?.placeholder}
                  keyboardType={field?.keyboardType}
                  value={form[fieldKey]}
                  onChangeText={(v) => handleChange(fieldKey, v)}
                  inputRounded
                  inputicon
                  icon={
                    field.icon ? (
                      <Image source={field.icon} style={[styles.icon, { tintColor: COLORS.title }]} />
                    ) : null
                  }
                />
              </View>
            );
          })}




          <View style={{ flexShrink: 1, alignItems: 'center', marginHorizontal: '10%', marginVertical: '5%' }}>
            <Text style={[FONTS.fontRegular, { fontSize: 15, color: COLORS.title }]}>College Card/ CNIC Picture</Text>
          </View>


          <CnicUploadBox
            label="Upload CNIC Front"
            image={user?.cnicFront}
            onPress={() => pickCnicImage('front')}
          />

          <CnicUploadBox
            label="Upload CNIC Back"
            image={user?.cnicBack}
            onPress={() => pickCnicImage('back')}
          />


        </View>
      </ScrollView>
      <View style={[GlobalStyleSheet.container]}>
        <Button
          title={loading ? 'Saving...' : 'Save Profile'}
          color={COLORS.primary}
          text={COLORS.white}
          onPress={onSubmit}
          style={{ borderRadius: 50, marginVertical: 30 }}
        />
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  icon: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },
  cardBackground: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mainBackground,
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginBottom: 10
  },
  imageborder: {
    borderWidth: 2,
    borderColor: COLORS.black,
    height: 90,
    width: 90,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  WriteIconBackground: {
    height: 42,
    width: 42,
    borderRadius: 40,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 60
  },
  WriteIcon: {
    height: 36,
    width: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary
  },
  InputTitle: {
    ...FONTS.fontMedium,
    fontSize: 13,
    color: COLORS.title,
    marginBottom: 5
  },
  bottomBtn: {
    height: 75,
    width: '100%',
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: .1,
    shadowRadius: 5,
  },
  title: {
    ...FONTS.fontMedium,
    fontSize: 18,
    marginTop: 10,
    color: COLORS.title,
  },
  subtitle: {
    ...FONTS.fontRegular,
    fontSize: 12,
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    marginVertical: 10,
  },
})