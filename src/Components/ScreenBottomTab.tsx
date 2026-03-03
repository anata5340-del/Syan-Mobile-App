import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../Constants/theme';

interface Props {
  activeTabs: 'notes' | 'videos' | 'quiz';
  onChange: (tab: 'notes' | 'videos' | 'quiz') => void;
  tabs: Array<{ name: string; label: string; icon: string }>;
}

const tabs = [
  { name: 'notes', label: 'Read Notes', icon: 'book-open' },
  { name: 'quiz', label: 'Quiz', icon: 'check-circle' },
  { name: 'videos', label: 'Videos', icon: 'play-circle' },
];

const ScreenBottomTab = ({ activeTabs, onChange }: Props) => {
  const [scaleAnims] = React.useState(
    tabs.reduce((acc, tab) => {
      acc[tab.name] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const handlePressIn = (tabName: string) => {
    Animated.spring(scaleAnims[tabName], {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (tabName: string) => {
    Animated.spring(scaleAnims[tabName], {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTabs === tab.name;
          
          return (
            <Animated.View
              key={tab.name}
              style={[
                styles.tabWrapper,
                { transform: [{ scale: scaleAnims[tab.name] }] },
              ]}
            >
              <TouchableOpacity
                onPress={() => onChange(tab.name as any)}
                onPressIn={() => handlePressIn(tab.name)}
                onPressOut={() => handlePressOut(tab.name)}
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  isActive && styles.activeTab,
                ]}
              >
                <View style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}>
                  <FeatherIcon
                    name={tab.icon}
                    size={20}
                    color={isActive ? COLORS.primary : '#6b7280'}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && styles.activeLabel,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default ScreenBottomTab;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 6,
  },
  tabWrapper: {
    flex: 1,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    position: 'relative',
    minHeight: 70,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  activeIconContainer: {
    backgroundColor: COLORS.primary + '15',
  },
  tabLabel: {
    ...FONTS.fontTitle,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});