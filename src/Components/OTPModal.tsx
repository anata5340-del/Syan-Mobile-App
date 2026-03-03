import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Input from "./Input";
import Button from "./Button";
import { COLORS, FONTS } from "../Constants/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  otp: string;
  setOtp: (val: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

const OTPModal = ({ visible, onClose, otp, setOtp, onSubmit, loading }: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={[FONTS.fontMedium, { fontSize: 18, color: COLORS.title }]}>
            Enter OTP
          </Text>

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            style={{ marginTop: 15 }}
          />

          <Button
            title={loading ? "Verifying..." : "Verify OTP"}
            onPress={onSubmit}
            color={COLORS.primary}
            text={COLORS.white}
            style={{ marginTop: 20 }}
          />

          <Button
            title="Cancel"
            onPress={onClose}
            color={COLORS.secondary}
            text={COLORS.white}
            style={{ marginTop: 10 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default OTPModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modal: {
    width: "100%",
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 12,
  },
});
