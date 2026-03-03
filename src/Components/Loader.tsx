// Loader.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { COLORS } from '../Constants/theme';

const { width, height } = Dimensions.get('window');

interface LoaderProps {
  visible: boolean;
  backgroundColor?: string; // optional semitransparent overlay color
}

const Loader: React.FC<LoaderProps> = ({ visible, backgroundColor = 'rgba(0, 0, 0, 0.04);' }) => {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor }]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
});

export default Loader;
