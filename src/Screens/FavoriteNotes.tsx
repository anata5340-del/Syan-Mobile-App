import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import { COLORS, FONTS } from '../Constants/theme';
import { IMAGES } from '../Constants/Images';
import MainHeader from '../layout/MainHeader';
import HistoryCard from '../Components/HistoryCard';
import { useFavoriteNotes, useNoteStatuses } from '../hooks/react-query/useFavorites';
import { parseNoteStatusUrl } from '../utils/parseNoteStatusUrl';
import { NoteStatus } from '../api/favorites.services';

type FavoriteNotesScreenProps = StackScreenProps<RootStackParamList, 'FavoriteNotes'>;

const FavoriteNotes = ({ navigation }: FavoriteNotesScreenProps) => {
  const { data: notes = [], isLoading } = useFavoriteNotes();
  const { data: noteStatuses = [] } = useNoteStatuses();


  console.log('Total Favorite Notes:', notes.length);
  console.log('Note Statuses:', noteStatuses.length);

  const calculateProgress = (noteId: string) => {
    const status = noteStatuses.find((s: any) => s.noteId === noteId);
    if (!status?.content || status.content.length === 0) return 0;
    
    const completed = status.content.filter((item: any) => item.completed).length;
    return Math.round((completed / status.content.length) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently added';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

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
    }
    
  };

  if (isLoading) {
    return (
      <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
        <MainHeader screenName="Favorite Notes" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[FONTS.fontRegular, { marginTop: 16 }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.mainBackground, flex: 1 }}>
      <MainHeader screenName="Favorite Notes" />
      <View style={{ marginHorizontal: -15, paddingHorizontal: 10 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {notes.length > 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginVertical: '5%',
                gap: 7,
                flexWrap: 'wrap',
                flexShrink: 1,
                marginBottom: '45%',
                justifyContent: 'space-around',
              }}
            >
              {notes.map((note: any, index: number) => (
                <HistoryCard
                  key={note._id || index}
                  onPress={() => handleNotePress(note)}
                  imageSource={IMAGES.notes_icon}
                  title={note.note?.name || 'Note'}
                  startDate={formatDate(note.createdAt)}
                  progress={calculateProgress(note.note?._id)}
                  backgroundColor="#EECEFF"
                  borderColor="#D684FF"
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50%',
              }}
            >
              <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: '#999' }]}>
                No Favorite Notes
              </Text>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: '#999', marginTop: 8 }]}>
                Start adding notes to your favorites!
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  marginTop: 20,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: 'white' }}>Go Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default FavoriteNotes;