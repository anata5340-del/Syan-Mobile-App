import React, { useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { GlobalStyleSheet } from "../Constants/StyleSheet";
import { COLORS, FONTS } from "../Constants/theme";
import MainHeader from "../layout/MainHeader";
import Input from "../Components/Input";
import Button from "../Components/Button";
import OTPModal from "../Components/OTPModal";
import { IMAGES } from "../Constants/Images";

import { useAuthStore } from "../stores/auth.store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  changePasswordSchema,
  ChangePasswordForm,
} from "../validation/security";

import {
  useRequestOtp,
  useVerifyOtp,
  useUpdatePassword,
} from "../hooks/react-query/useSecurity";

import PopupMessage from "../Components/PopupMessage";

export default function Security() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  if (!user) return null;

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const updatePassMutation = useUpdatePassword();


  //POP UP message States
  const [popup, setPopup] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    message: '',
  });


  // Hook Form Setup
  const { control, handleSubmit, formState, getValues } =
    useForm<ChangePasswordForm>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        currentPass: user.password, 
        newPass: "",
        confirmPass: "",
      },
    });

  const onSubmitPassword = async () => {
    try {
      const res = await requestOtpMutation.mutateAsync(user.email);
      setOtpToken(res.token);
      setOtpModal(true);
    } catch (err: any) {
  console.log(" OTP ERROR:", err?.response?.data || err);
  setPopup({
      visible: true,
      type: "error",
      message: err?.response?.data?.message || "Failed to send OTP",
    });
    }
  };

  // verify otp and update password
  const verifyOtpAndUpdate = async () => {
    try {
      await verifyOtpMutation.mutateAsync({
        otp,
        token: otpToken,
      });

      const values = getValues(); // get form values

      // Update password API
      const res = await updatePassMutation.mutateAsync({
        id: user._id,
        password: values.newPass,
        email: user.email,
      });

      setUser(res.data);
      setOtpModal(false);

      setPopup({
      visible: true,
      type: "success",
      message: "Password updated successfully",
    });

    } catch (err) {

       setPopup({
      visible: true,
      type: "error",
      message: "Invalid OTP",
    });

    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader drawarNavigation />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            GlobalStyleSheet.container,
            { backgroundColor: COLORS.card, borderRadius: 15 },
          ]}
        >
          {/* Email Address */}

          <View style={styles.inputWrapper}>
            <Input
              label="Email Address"
              placeholder={user.email} 
              keyboardType="email-address"
              value={user.email}
              onChangeText={() => {}} // no backend yet, placeholder only
              inputRounded
              inputicon
              icon={
                <Image
                  source={IMAGES.emailInput}
                  style={[styles.icon, { tintColor: COLORS.title }]}
                />
              }
            />
          </View>

            {/* Current Password */}

          <Controller
            control={control}
            name="currentPass"
            render={({ field }) => (
              <View style={styles.inputWrapper}>
                <Input
                  label="Current Password"
                  placeholder={user.password}
                  value={field.value}
                  onChangeText={field.onChange}
                  type="password"
                  inputicon
                    inputRounded
                  icon={
                    <Image
                      source={IMAGES.lockInput}
                      style={[styles.icon, { tintColor: COLORS.title }]}
                    />
                  }
                />
              </View>
            )}
          />
          {formState.errors.currentPass && (
            <Text style={styles.error}>{formState.errors.currentPass.message}</Text>
          )}

          {/* New Password */}

          <Controller
            control={control}
            name="newPass"
            render={({ field }) => (
              <View style={styles.inputWrapper}>
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  value={field.value}
                  onChangeText={field.onChange}
                  inputRounded
                  type="password"
                  inputicon
                  icon={
                    <Image
                      source={IMAGES.lockInput}
                      style={[styles.icon, { tintColor: COLORS.title }]}
                    />
                  }
                />
              </View>
            )}
          />
          {formState.errors.newPass && (
            <Text style={styles.error}>{formState.errors.newPass.message}</Text>
          )}

          <Controller
            control={control}
            name="confirmPass"
            render={({ field }) => (
              <View style={styles.inputWrapper}>
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter new password"
                  value={field.value}
                  onChangeText={field.onChange}
                  inputRounded
                  type="password"
                  inputicon
                  icon={
                    <Image
                      source={IMAGES.lockInput}
                      style={[styles.icon, { tintColor: COLORS.title }]}
                    />
                  }
                />
              </View>
            )}
          />
          {formState.errors.confirmPass && (
            <Text style={styles.error}>
              {formState.errors.confirmPass.message}
            </Text>
          )}

          <Button
            title={
              requestOtpMutation.isPending
                ? "Sending OTP..."
                : "Update Password"
            }
            onPress={handleSubmit(onSubmitPassword)}
            color={COLORS.secondary}
            text={COLORS.white}
            style={{ borderRadius: 50, marginTop: 20 }}
          />
        </View>
      </ScrollView>

      {/* model otp */}

      <OTPModal
        visible={otpModal}
        otp={otp}
        setOtp={setOtp}
        onClose={() => setOtpModal(false)}
        onSubmit={verifyOtpAndUpdate}
        loading={
          verifyOtpMutation.isPending || updatePassMutation.isPending
        }
      />


      <PopupMessage
        type={popup.type}
        message={popup.message}
        visible={popup.visible}
        onClose={() => setPopup({ ...popup, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginVertical: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  error: {
    color: "red",
    marginLeft: 5,
    marginBottom: 5,
  },
});
