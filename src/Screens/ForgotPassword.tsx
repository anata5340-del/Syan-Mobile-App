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
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequestResetEmail, useSendOtp } from '../hooks/react-query/useResetPassword';
import PopupMessage from '../Components/PopupMessage';


type SingInScreenProps = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
});


type FormData = z.infer<typeof schema>;




const ForgotPassword = ({ navigation }: SingInScreenProps) => {

    const [isFocused, setisFocused] = useState(false);


    const [popup, setPopup] = useState({
        visible: false,
        type: 'success' as 'success' | 'error',
        message: '',
    });


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
    });



    const requestResetMutation = useRequestResetEmail();
    const sendOtpMutation = useSendOtp();




    const onSubmit = async (values: FormData) => {
        try {
            const resp = await requestResetMutation.mutateAsync(values.email);

            const { type, id } = resp;

            // now call sendOtp to send OTP email. Back-end expects type (like "password")
            const sendResp = await sendOtpMutation.mutateAsync({ type: 'password', email: values.email });

            // sendResp contains token
            const otpToken = sendResp.token;

            // Navigate to OTP screen with necessary params
            navigation.navigate('OTP', { email: values.email, type, id, otpToken });
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to send reset email';
            setPopup({
                visible: true,
                type: "error",
                message: message,
            });
        }
    };




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.mainBackground, }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <HeaderOnboarding icon='arrow-left-circle' />
            </View>
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingVertical: '8%', paddingHorizontal: 30, }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={[styles.title1, { color: COLORS.title }]}>Enter your email</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        onFocus={() => setisFocused(true)}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        isFocused={isFocused}
                                        icon={<Image source={IMAGES.userInput} style={[styles.icon, { tintColor: COLORS.title }]} />}
                                        placeholder='example@gmail.com'
                                    />
                                )}
                            />
                            {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title2, { color: COLORS.title }]}>Retrieve your account password. Enter your email address or username to get started.</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Button
                            title={requestResetMutation.isPending || sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
                            text={'white'}
                            onPress={handleSubmit(onSubmit)}
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

export default ForgotPassword

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