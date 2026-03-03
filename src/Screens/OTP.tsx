import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { COLORS, FONTS } from '../Constants/theme'
import { GlobalStyleSheet } from '../Constants/StyleSheet'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../Navigation/RootStackParamList'
import Input from '../Components/Input'
import { IMAGES } from '../Constants/Images'
import Button from '../Components/Button'
import HeaderOnboarding from '../layout/HeaderOnboarding';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVerifyOtp } from '../hooks/react-query/useResetPassword';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import PopupMessage from '../Components/PopupMessage';


type SingInScreenProps = StackScreenProps<RootStackParamList, 'OTP'>;

const schema = z.object({ otp: z.string().min(4, 'Enter OTP') });
type FormData = z.infer<typeof schema>;

const OTP = ({ route, navigation }: SingInScreenProps) => {

    const [isFocused, setisFocused] = useState(false);


    const [popup, setPopup] = useState({
            visible: false,
            type: 'success' as 'success' | 'error',
            message: '',
        });
    


    const { email, type, id, otpToken } = route.params as { email: string; type: string; id: string; otpToken: string };

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { otp: '' },
    });

    const verifyMutation = useVerifyOtp();


    const onSubmit = async (values: FormData) => {
        try {
            await verifyMutation.mutateAsync({ otp: values.otp, token: otpToken });
            // now OTP verified -> navigate to ResetPassword screen, pass type & id & email
            navigation.navigate('ResetPassword', { type, id, email });
        } catch (err: any) {
            const msg = err?.response?.data?.error || err?.message || 'Invalid OTP';
            setPopup({
                visible: true,
                type: "error",
                message: msg,
            });
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.mainBackground, }}>
            <HeaderOnboarding />
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingVertical: "8%", paddingHorizontal: 30, }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title1, { color: COLORS.title }]}>Enter OTP Code</Text>
                            <Text style={[styles.title2, { color: COLORS.title }]}>Please enter the 6-digit code sent to your email/phone number to verify your account.</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Controller
                                control={control}
                                name="otp"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        onFocus={() => setisFocused(true)}
                                        onBlur={onBlur}
                                        value={value}
                                        onChangeText={onChange}
                                        isFocused={isFocused}
                                        icon={<Image source={IMAGES.lockInput} style={[styles.icon, { tintColor: COLORS.title }]} />}
                                        placeholder='Enter OTP'
                                        keyboardType={'numeric'}
                                    />
                                )}
                            />
                            {errors.otp && <Text style={{ color: 'red' }}>{errors.otp.message}</Text>}
                        </View>

                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Button
                            title={verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                            onPress={handleSubmit(onSubmit)}
                            text={'white'}
                            color={COLORS.secondary}
                            style={{ borderRadius: 52 }}
                        />
                    </View>
                </View>
            </ScrollView>
            <PopupMessage
                    type={popup.type}
                    message={popup.message}
                    visible={popup.visible}
                    onClose={() => setPopup({ ...popup, visible: false })}
                  />
        </SafeAreaView>
    )
}

export default OTP

const styles = StyleSheet.create({
    text: {
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title,
    },
    title1: {
        ...FONTS.fontSemiBold,
        fontSize: 24,
        color: COLORS.title,
        marginBottom: 5
    },
    title2: {
        ...FONTS.fontRegular,
        fontSize: 14,
        color: COLORS.title,
    },
    title3: {
        ...FONTS.fontMedium,
        fontSize: 14,
        color: '#8A8A8A'
    },
    icon: {
        height: 28,
        width: 28,
        resizeMode: 'contain',
    },
})