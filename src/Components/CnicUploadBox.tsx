import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../Constants/theme';

type Props = {
  label: string;
  image?: string;
  onPress: () => void;
};

const CnicUploadBox: React.FC<Props> = ({ label, image, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CnicUploadBox;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.text,
    borderRadius: 12,
    marginBottom: 15,
    paddingVertical: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  label: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.text,
  },
});
