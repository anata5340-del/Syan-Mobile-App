import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

interface MainHeaderProps {
  screenName?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  searchBar?: boolean;
  heartIcon?: boolean;
  drawarNavigation?: boolean;
  // New props for favorites functionality
  isHeartFilled?: boolean;
  onHeartPress?: () => void;
  heartLoading?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  screenName,
  placeholder = "Search",
  onSearch,
  searchBar,
  heartIcon,
  drawarNavigation,
  // New props
  isHeartFilled = false,
  onHeartPress,
  heartLoading = false,
}) => {
  const navigation = useNavigation();

  // Local state for backward compatibility (when onHeartPress is not provided)
  const [isHeartTouch, setIsHeartTouch] = useState(false);

  const handleTouch = () => {
    if (onHeartPress) {
      // Use new functionality if provided
      onHeartPress();
    } else {
      // Fallback to old behavior
      setIsHeartTouch(!isHeartTouch);
    }
  };

  const handleSearch = (text: string) => {
    if (onSearch) {
      onSearch(text);
    }
  };

  // Determine heart icon (filled vs outline) and color
  const getHeartIconName = () => {
    // Always use 'heart' icon, filled status determined by color
    return 'heart';
  };

  const getHeartColor = () => {
    if (onHeartPress) {
      // Use bright red when filled, light gray when not
      return isHeartFilled ? '#EF476F' : '#D1D5DB';
    }
    // Fallback for old behavior
    return isHeartTouch ? '#EF476F' : '#D1D5DB';
  };

  return (
    <View style={[GlobalStyleSheet.container, { paddingHorizontal: 25, padding: 0, paddingTop: 13, paddingBottom: 8 }]}>
      <View style={[GlobalStyleSheet.flex]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Go back button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FeatherIcon
              size={27}
              color={COLORS.title}
              name={'arrow-left-circle'}
              style={{ paddingVertical: '3%', alignItems: 'center', paddingRight: 16 }}
            />
          </TouchableOpacity>

          {/* Screen name */}
          <View>
            <Text style={{ ...FONTS.fontSemiBold, fontSize: 16, color: COLORS.title }}>
              {screenName}
            </Text>
          </View>
        </View>

        {/* Right side icons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Heart icon */}
          {heartIcon && (
            <View style={{ paddingRight: 5 }}>
              <TouchableOpacity 
                onPress={handleTouch}
                disabled={heartLoading}
                style={{ 
                  minWidth: 32, 
                  height: 32,
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {heartLoading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <FeatherIcon 
                    name={getHeartIconName()} 
                    size={24} 
                    color={getHeartColor()}
                    style={isHeartFilled && onHeartPress ? { opacity: 1 } : {}}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Drawer navigation */}
          {drawarNavigation && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.openDrawer()}
              style={[GlobalStyleSheet.background3]}
            >
              <Image
                style={[GlobalStyleSheet.image3, { tintColor: '#000000', width: 23, height: 20 }]}
                source={IMAGES.gridHome}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search bar */}
      {searchBar && (
        <View style={[GlobalStyleSheet.container, { padding: 0, paddingTop: 15 }]}>
          <View>
            <TextInput
              placeholder={placeholder}
              style={[styles.TextInput, { color: COLORS.title, backgroundColor: '#FAFAFA' }]}
              placeholderTextColor={'#929292'}
              onChangeText={handleSearch}
            />
            <View style={{ position: 'absolute', top: 12, right: 20 }}>
              <FeatherIcon name="search" size={24} color={'#C9C9C9'} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  TextInput: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.title,
    borderRadius: 61,
    paddingHorizontal: '20%',
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});