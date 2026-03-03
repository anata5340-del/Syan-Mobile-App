import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from '../hooks/react-query/useLogin';
import { COLORS, FONTS } from '../Constants/theme'
import { GlobalStyleSheet } from '../Constants/StyleSheet'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../Navigation/RootStackParamList'
import Input from '../Components/Input'
import { IMAGES } from '../Constants/Images'
import Button from '../Components/Button'
import HeaderOnboarding from '../layout/HeaderOnboarding';
import { SafeAreaView } from 'react-native-safe-area-context';
import PopupMessage from '../Components/PopupMessage';


type SingInScreenProps = StackScreenProps<RootStackParamList, 'SignIn'>;



const schema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;


const SignIn = ({ navigation }: SingInScreenProps) => {

    const { mutate: loginUser, isPending } = useLogin();

    const [isFocused, setisFocused] = useState(false);
    const [isFocused2, setisFocused2] = useState(false);

    //Pop Up Message State
    const [popup, setPopup] = useState({
        visible: false,
        type: 'success' as 'success' | 'error',
        message: '',
    });




    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (form: FormData) => {
        loginUser(
            { email: form.email, password: form.password },
            {
                onSuccess: () => {
                    navigation.navigate('DrawerNavigation', { screen: 'Home' })
                },
                onError: (err: any) => {
                    console.log('Login error:', err);
                    setPopup({
                        visible: true,
                        type: "error",
                        message: err?.response?.data?.message || "Invalid credentials",
                    });
                },
            }
        );
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.mainBackground, }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <HeaderOnboarding />
            </View>
            <ScrollView style={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, paddingHorizontal: 30, paddingVertical: '8%' }]}>
                    <View style={{}}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[styles.title1, { color: COLORS.title }]}>Sign In</Text>
                            <Text style={[styles.title2, { color: COLORS.title }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
                        </View>
                        {/* Email Input */}
                        <View style={{ marginBottom: 20, marginTop: 10 }}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input
                                        placeholder="Email"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        icon={
                                            <Image
                                                source={IMAGES.userInput}
                                                style={[styles.icon, { tintColor: COLORS.title }]}
                                            />
                                        }
                                    />
                                )}
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </View>


                        {/* Password Input */}
                        <View style={{ marginBottom: 20 }}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        icon={
                                            <Image
                                                source={IMAGES.lockInput}
                                                style={[styles.icon, { tintColor: COLORS.title }]}
                                            />
                                        }
                                    />
                                )}
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </View>

                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Button
                            title={isPending ? "LOGIN..." : "LOGIN"}
                            style={{ borderRadius: 52 }}
                            onPress={handleSubmit(onSubmit)}
                            color={COLORS.primary}
                        />
                        <View
                            style={[GlobalStyleSheet.flex, {
                                marginBottom: 20,
                                marginTop: 10,
                                paddingHorizontal: 10,
                                justifyContent: 'center',
                                gap: 5
                            }]}
                        >
                            <Text style={[styles.text, { color: COLORS.title }]}>Forgot Password?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: COLORS.primary }}>Reset here</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{ marginBottom: 15 }}>
                            <Text style={[styles.title2, { color: COLORS.title, textAlign: 'center', opacity: .5 }]}>Don’t have an account?</Text>
                        </View>
                        <Button
                            title={"SIGN UP"}
                            // onPress={() => navigation.navigate('DrawerNavigation',{screen : 'Home'} )}
                            onPress={() => navigation.navigate('SignUp')}
                            style={{ borderRadius: 52 }}
                            color={COLORS.secondary}
                        /> */}
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

export default SignIn

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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },

})