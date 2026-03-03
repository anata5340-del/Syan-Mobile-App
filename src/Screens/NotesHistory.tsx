import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import HistoryCard from '../Components/HistoryCard';
import { useNoteStatuses } from '../hooks/react-query/useFavorites';
import { parseNoteStatusUrl } from '../utils/parseNoteStatusUrl';
import type { NoteStatus } from '../api/favorites.services';

type NotesHistoryScreenProps = StackScreenProps<RootStackParamList, 'NotesHistory'>;

const NotesHistory = ({ navigation }: NotesHistoryScreenProps) => {
  const { data: noteStatuses, isLoading, error } = useNoteStatuses();

  // Helper function to calculate progress from content array
  const calculateProgress = (content: any[]) => {
    if (!content || content.length === 0) return 0;
    const completed = content.filter(item => item.completed).length;
    return Math.round((completed / content.length) * 100);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Handle note card press - parse URL and navigate to Notes with course path params
  const handleNotePress = (note: NoteStatus) => {
    const parsed = note.url ? parseNoteStatusUrl(note.url) : null;

    if (parsed) {
      navigation.navigate('Notes', {
        courseId: parsed.courseId,
        moduleId: parsed.moduleId,
        sectionId: parsed.sectionId,
        subSectionId: parsed.subSectionId,
        subSectionBlockId: parsed.subSectionBlockId,
      });
    } else {
      navigation.navigate('ReadNotes');
    }
  };

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName='Notes History' drawarNavigation />
      <View
        style={{
          marginHorizontal: -15,
          paddingHorizontal: 10,
        }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20 }}>

          {isLoading ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <ActivityIndicator size="large" color="#227777" />
              <Text style={[FONTS.fontRegular, { marginTop: 10, color: COLORS.text }]}>
                Loading notes history...
              </Text>
            </View>
          ) : error ? (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <Text style={[FONTS.fontRegular, { color: '#FF0000' }]}>
                Error loading notes history
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={{
                  marginTop: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor: '#227777',
                  borderRadius: 8
                }}
              >
                <Text style={[FONTS.fontRegular, { color: '#FFFFFF' }]}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          ) : noteStatuses && noteStatuses.length > 0 ? (
            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              gap: 7, 
              flexWrap: 'wrap', 
              flexShrink: 1, 
              marginBottom: '45%' 
            }}>
              {noteStatuses.map((note) => (
                <HistoryCard
                  key={note._id}
                  onPress={() => handleNotePress(note)}
                  imageSource={IMAGES.notes_icon}
                  title={note.noteName || 'Note'}
                  startDate={formatDate(note.updatedAt)}
                  progress={calculateProgress(note.content)}
                  backgroundColor='#EECEFF'
                  borderColor='#D684FF'
                />
              ))}
            </View>
          ) : (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 50 
            }}>
              <Text style={[FONTS.fontRegular, { fontSize: 16, color: COLORS.text }]}>
                No notes history available
              </Text>
              <Text style={[FONTS.fontLight, { 
                fontSize: 14, 
                color: COLORS.text, 
                marginTop: 10,
                textAlign: 'center',
                paddingHorizontal: 40
              }]}>
                Read a note to see your progress here
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default NotesHistory;