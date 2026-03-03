  import React, { useState } from 'react';
  import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
  import { GlobalStyleSheet } from '../../Constants/StyleSheet';
  import { COLORS, FONTS } from '../../Constants/theme';
  import FeatherIcon from 'react-native-vector-icons/Feather';

  type Props = {
    sheetRef?: any;
    contentTitles: string[]; // Dynamically passed content titles
    onContentSelect: (index: number) => void; // Callback when a TOC item is selected
  };

  const FilterSheet = ({ sheetRef, contentTitles, onContentSelect }: Props) => {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

    const handleContentRead = (key: string, index: number) => {
      setSelectedItems((prevState) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
      onContentSelect(index); // Notify parent component of selection
    };

    return (
      <View style={[GlobalStyleSheet.container, { paddingTop: 0, backgroundColor: "#ef6a77", paddingBottom: 50 ,borderTopLeftRadius:15, borderTopRightRadius:15  }]}>
        <View style={[styles.filterBackground, { borderBottomColor: COLORS.inputborder, borderStyle: 'dashed' }]}>
          <Text style={[FONTS.fontRegular, { color: COLORS.white, fontSize: 18 }]}>Keypoints</Text>
          <TouchableOpacity
            style={[styles.Closebackgrond, { backgroundColor: COLORS.white, flexDirection: 'row', overflow: 'hidden' }]}
            onPress={() => sheetRef?.current?.close()}
          >
            <FeatherIcon size={20} color={'#ef6a77'} name={'x'} />
            <Text style={[FONTS.fontRegular, { fontSize: 12, paddingLeft: 5,color:COLORS.title }]}>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentList}>
            {contentTitles.map((title, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contentItem}
                onPress={() => handleContentRead(title, index)}
              >
                <Text style={styles.contentText}>{title}</Text>
                <View style={[styles.iconWrapper, selectedItems[title] && styles.iconSelected]}>
                  {selectedItems[title] && (
                    <FeatherIcon name="check" size={16} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    filterBackground: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.inputborder,
      paddingBottom: 10,
      paddingTop: 10,
      marginHorizontal: -15,
      paddingHorizontal: 15,
    },
    Closebackgrond: {
      paddingHorizontal: 5,
      backgroundColor: COLORS.card,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentList: {
      marginTop: 7,
    },
    contentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      marginHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.inputborder,
    },
    iconWrapper: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconSelected: {
      backgroundColor: COLORS.green,
      borderColor: COLORS.green,
    },
    contentText: {
      ...FONTS.fontRegular,
      fontSize: 14,
      color: COLORS.white,
    },
  });

  export default FilterSheet;
