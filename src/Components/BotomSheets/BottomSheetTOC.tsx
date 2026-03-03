import React, { useMemo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../Constants/theme';

// 🧩 Props
interface BottomSheetTOCProps {
  items: { title: string }[];
  onSelect: (index: number) => void;
  label?: string;
  completedItems?: number[];
  mode?: 'default' | 'quizExplanation' | 'notes';
}

const BottomSheetTOC = forwardRef<BottomSheet, BottomSheetTOCProps>(
  ({ items, onSelect, label = 'Jump to Section', mode = 'default', completedItems = [] }, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

    const renderBackdrop = (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    );

    const renderIcon = (item, index) => {
      if (mode === 'quizExplanation') {
        return (
          <FeatherIcon
            name={item.correct ? 'check-circle' : 'x-circle'}
            size={18}
            color={item.correct ? COLORS.secondary : COLORS.light_pink}
          />
        );
      }

      if (mode === 'notes') {
        const isCompleted = completedItems?.includes(index);

        return (
          <FeatherIcon
            name={isCompleted ? 'check-circle' : 'circle'}
            size={18}
            color={isCompleted ? COLORS.secondary : COLORS.gray}
          />
        );
      }

      return <FeatherIcon name="book-open" size={18} color={COLORS.primary} />;
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>{label}</Text>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => onSelect(index)}
            >
              {renderIcon(item, index)}
              <Text style={styles.text}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 10 },
  title: {
    ...FONTS.fontSemiBold,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 10,
  },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  text: {
    ...FONTS.fontRegular,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
});

export default BottomSheetTOC;
