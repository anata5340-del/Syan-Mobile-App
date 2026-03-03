// src/Components/EmptyState.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../Constants/theme';

interface EmptyStateProps {
  type: 'noData' | 'error';
  message?: string;
  buttonText?: string;
  onRetry?: () => void;
  showButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  message,
  buttonText = 'Retry',
  onRetry,
  showButton = false,
}) => {
  const config = {
    noData: {
      icon: 'inbox-outline',
      defaultMessage: 'No data available',
      color: COLORS.primary,
    },
    error: {
      icon: 'alert-circle-outline',
      defaultMessage: 'Something went wrong',
      color: '#FF4D4D',
    },
  }[type];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.mainBackground,
      }}
    >

      {/* Icon */}
      <MaterialCommunityIcons
        name={config.icon}
        size={70}
        color={config.color}
        style={{ marginBottom: 15 }}
      />

      {/* Message */}
      <Text
        style={[
          FONTS.fontSemiBold,
          { fontSize: 18, color: '#333', marginBottom: 8, textAlign: 'center' },
        ]}
      >
        {message || config.defaultMessage}
      </Text>

      {/* Retry Button */}
      {showButton && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            marginTop: 15,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 25,
          }}
        >
          <Text style={[FONTS.fontSemiBold, { color: 'white', fontSize: 16 }]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
