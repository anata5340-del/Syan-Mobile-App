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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useResetPasswordBackend } from '../hooks/react-query/useResetPassword';
import { useAuthStore } from '../stores/auth.store';
import PopupMessage from "../Components/PopupMessage";


const schema = z.object({
    password: z.string().min(6, 'Password must be 6+ chars'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});




type FormData = z.infer<typeof schema>;
type SingInScreenProps = StackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPassword = ({ route, navigation }: SingInScreenProps) => {

    const [isFocused, setisFocused] = useState(false);
    const [isFocused2, setisFocused2] = useState(false);

    //POP UP message States
    const [popup, setPopup] = useState({
        visible: false,
        type: 'success' as 'success' | 'error',
        message: '',
    });


    const { type, id, email } = route.params as { type: string; id: string; email: string };

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { password: '', confirmPassword: '' },
    });


    const resetMutation = useResetPasswordBackend();
    const authLogin = useAuthStore((s) => s.login); // we will call existing login action to get token




    const onSubmit = async (values: FormData) => {
        try {
            await resetMutation.mutateAsync({ password: values.password, type, id, email });

            
            await authLogin(email, values.password); // this saves token via keychain

            
            await authLogin(email, values.password);
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to reset password';
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
                            <Text style={[styles.title1, { color: COLORS.title }]}>Enter New Password</Text>
                            <Text style={[styles.title2, { color: COLORS.title }]}>Re-enter your new password to confirm. Secure your account</Text>
                        </View>
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        onFocus={() => setisFocused(true)}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        isFocused={isFocused}
                                        icon={<Image source={IMAGES.userInput} style={[styles.icon, { tintColor: COLORS.title }]} />}
                                        placeholder="New password"
                                    />
                                )}
                            />
                            {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}
                        </View>



                        <View style={{ marginBottom: 20, marginTop: 10 }}>

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        onFocus={() => setisFocused(true)}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        isFocused={isFocused}
                                        icon={<Image source={IMAGES.lockInput} style={[styles.icon, { tintColor: COLORS.title }]} />}
                                        placeholder="Confirm password"
                                        value={value}
                                    />
                                )}
                            />
                            {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword.message}</Text>}
                        </View>

                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Button
                            title={resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword

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