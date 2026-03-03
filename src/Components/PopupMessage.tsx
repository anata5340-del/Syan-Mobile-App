import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FONTS } from '../Constants/theme';

const { width } = Dimensions.get('window');

interface PopupMessageProps {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
  onClose: () => void;
}

const PopupMessage: React.FC<PopupMessageProps> = ({
  type,
  message,
  visible,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  const colors = {
    success: '#27ae60',
    error: '#e74c3c',
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        hidePopup();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const hidePopup = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View
        style={[
          styles.box,
          { borderLeftColor: colors[type] },
        ]}
      >
        <Text style={[styles.title, { color: colors[type] }]}>
          {type === 'success' ? 'Success' : 'Error'}
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,                    // moved from top to bottom
    alignSelf: 'center',
    zIndex: 999,
  },

  box: {
    width: width * 0.8,            //  80% of screen width
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  title: {
    ...FONTS.fontRegular,
    fontSize: 16,
  },

  message: {
    ...FONTS.fontLight,
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
});

export default PopupMessage;
