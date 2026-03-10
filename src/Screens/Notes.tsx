import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import BottomSheet from '@gorhom/bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import WebView from 'react-native-webview';
import { marked } from 'marked';

import MainHeader from '../layout/MainHeader';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import BottomSheetTOC from '../Components/BotomSheets/BottomSheetTOC';
import Loader from '../Components/Loader';
import { useUpdateNoteStatus, useNoteStatus } from '../hooks/react-query/useStatus';
import { useSubSectionBlockNote } from '../hooks/react-query/useVideoCourses';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import {
  useFavoriteNotes,
  useAddNoteToFavorites,
  useRemoveNoteFromFavorites,
} from '../hooks/react-query/useFavorites';
import Feather from 'react-native-vector-icons/Feather';
import ImageViewing from 'react-native-image-viewing';
import FavoriteNotes from './FavoriteNotes';

const { height, width } = Dimensions.get('window');

type Props = StackScreenProps<RootStackParamList, 'Notes'>;

// HTML WebView Component with styled content
const HTMLWebViewContent = ({ html, onImagePress }: { html: string; onImagePress?: (uri: string) => void }) => {
  const [contentHeight, setContentHeight] = useState(0);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    setContentHeight(0);
  }, [html]);

  const measureHeightJS = `
    (function() {
      var content = document.getElementById('content');
      if (!content) return;
      var h = content.offsetHeight + 20;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', value: h }));
    })();
    true;
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #000;
          background-color:rgb(230, 224, 224);
          padding: 10px;
        }
        
        .content-wrap {
          overflow-x: auto;
          max-width: 100%;
        }
        
        h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 16px 0 12px 0;
          line-height: 1.3;
          color: #000;
        }
        
        h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 14px 0 10px 0;
          line-height: 1.3;
          color: #000;
        }
        
        h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 12px 0 8px 0;
          line-height: 1.3;
          color: #000;
        }
        
        h4, h5, h6 {
          font-size: 14px;
          font-weight: 600;
          margin: 10px 0 6px 0;
          color: #000;
        }
        
        p {
          margin-bottom: 10px;
          margin-top: 10px;
          line-height: 1.6;
        }
        
        p:empty,
        p:has-only-nbsp {
          display: none;
        }
        
        ul, ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        ul ul, ol ol, ul ol, ol ul {
          margin: 4px 0;
        }
        
        li {
          margin: 4px 0;
          line-height: 1.6;
        }
        
        strong, b {
          font-weight: 600;
        }
        
        em, i {
          font-style: italic;
        }
        
        u {
          text-decoration: underline;
        }
        
        s, del {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        code {
          background-color: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #d63384;
        }
        
        pre {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 12px;
          margin: 10px 0;
          overflow-x: auto;
          line-height: 1.4;
        }
        
        pre code {
          background-color: transparent;
          padding: 0;
          color: #333;
        }
        
        blockquote {
          border-left: 4px solid #d63384;
          padding: 10px 15px;
          margin: 10px 0;
          background-color: #fafafa;
          border-radius: 4px;
          color: #666;
          font-style: italic;
        }
        
        .table-scroll {
          overflow-x: auto;
          max-width: 100%;
          margin: 12px 0;
        }
        
        table {
          width: 100%;
          min-width: 200px;
          border-collapse: collapse;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        thead {
          background-color: #f8f9fa;
        }
        
        th {
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #ddd;
          background-color: #f8f9fa;
          color: #000;
          white-space: nowrap;
        }
        
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
        }
        
        tr:last-child td {
          border-bottom: none;
        }
        
        tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        a {
          color: #d63384;
          text-decoration: none;
        }
        
        a:active {
          opacity: 0.7;
        }
        
        img {
          max-width: 100%;
          width: 100%;
          height: auto;
          margin: 10px 0;
          border-radius: 4px;
          display: block;
          cursor: pointer;
        }
        
        hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 15px 0;
        }
        
        span[style*="color"] {
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="content-wrap" id="content">
        ${html}
      </div>
      <script>
        document.addEventListener('click', function(e) {
          var el = e.target;
          if (el.tagName === 'IMG' && el.src) {
            e.preventDefault();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'imagePress', value: el.src }));
          }
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'height' && typeof data.value === 'number' && data.value > 0) {
        setContentHeight(data.value);
      } else if (data.type === 'imagePress' && data.value && onImagePress) {
        onImagePress(data.value);
      }
    } catch (_) {}
  };

  const onLoadEnd = () => {
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(measureHeightJS);
    }, 300);
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(measureHeightJS);
    }, 800);
  };

  if (!html) return null;

  return (
    <View style={{ height: contentHeight > 0 ? contentHeight : undefined, marginVertical: 5, borderRadius: 6, overflow: 'hidden', backgroundColor: '#f5f5f5', width: '100%' }}>
      <WebView
        ref={webViewRef}
        key={html}
        source={{ html: htmlContent }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        onLoadEnd={onLoadEnd}
        style={{ width: '100%', opacity: contentHeight > 0 ? 1 : 0 }}
      />
    </View>
  );
};

const Notes = ({ navigation, route }: Props) => {
  const {
    courseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,  
    questionIds,
  } = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const sectionPositions = useRef<{ y: number; height: number }[]>([]);
  const viewingTimeouts = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const markedComplete = useRef<Set<number>>(new Set());

  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const { data, isLoading, isError } = useSubSectionBlockNote(
    courseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId
  );

  const note = data?.note;
  const noteId = note?._id;
  const noteName = note?.noteName || 'Untitled';

  const { data: statusData } = useNoteStatus();
  const { data: favoriteNotes = [] } = useFavoriteNotes();


  const favURL = favoriteNotes.find(fav => fav?.note?._id === noteId)?.url;
  

  const { mutate: addToFavorites, isPending: adding } = useAddNoteToFavorites();
  const { mutate: removeFromFavorites, isPending: removing } = useRemoveNoteFromFavorites();
  const { mutate: updateStatus } = useUpdateNoteStatus();

  const isHtmlContent = (content: string): boolean => {
    return /<[^>]*>/g.test(content);
  };

  const processContent = (content: string) => {
    // If it's already HTML, return as-is
    if (isHtmlContent(content)) {
      return content;
    }
    // Otherwise, parse Markdown
    return marked.parse(content);
  };

  const sections =
    note?.content?.map((item: any) => ({
      title: item.name,
      html: processContent(item.content),
      contentId: item._id,
    })) || [];

  const totalSections = sections.length;
  const progress =
    totalSections > 0
      ? Math.round((completedSections.length / totalSections) * 100)
      : 0;

  const favoriteRecord = useMemo(() => {
    return favoriteNotes.find(fav => fav?.note?._id === noteId);
  }, [favoriteNotes, noteId]);

  const isFavorited = !!favoriteRecord;

  useEffect(() => {
    if (!statusData || !note?.content?.length) return;

    const noteStatus = statusData.find(
      (status: any) => status.noteId === noteId
    );

    if (!noteStatus) return;

    const completedIndexes = note.content
      .map((item: any, index: number) => {
        const found = noteStatus.content.find(
          (c: any) => c.contentId === item._id && c.completed
        );
        return found ? index : null;
      })
      .filter((v: number | null) => v !== null) as number[];

    setCompletedSections(completedIndexes);
    completedIndexes.forEach(idx => markedComplete.current.add(idx));
  }, [statusData, note, noteId]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;

    const scrollY = contentOffset.y;
    const viewportBottom = scrollY + layoutMeasurement.height;

    sectionPositions.current.forEach((position, index) => {
      if (!position || !note?.content?.[index]) return;

      const sectionMiddle = position.y + position.height * 0.3;

      const isInViewport =
        sectionMiddle >= scrollY &&
        sectionMiddle <= viewportBottom;

      if (isInViewport && !markedComplete.current.has(index)) {
        startCompletionTimer(index);
      } else if (!isInViewport && viewingTimeouts.current.has(index)) {
        const timeout = viewingTimeouts.current.get(index);
        if (timeout) {
          clearTimeout(timeout);
          viewingTimeouts.current.delete(index);
        }
      }
    });
  };

  const startCompletionTimer = (index: number) => {
    if (viewingTimeouts.current.has(index)) return;
    if (markedComplete.current.has(index)) return;

    const timeout = setTimeout(() => {
      markSectionComplete(index);
      viewingTimeouts.current.delete(index);
    }, 2000);

    viewingTimeouts.current.set(index, timeout);
  };

  const markSectionComplete = (index: number) => {
    if (!note?._id || !note.content?.[index]) return;

    const contentId = note.content[index]._id;
    const finalNoteName = note.title || note.name || 'Untitled';

    setCompletedSections(prev =>
      prev.includes(index) ? prev : [...prev, index]
    );

    markedComplete.current.add(index);

    const url = favURL || `notes/${note._id}`;

    updateStatus({
      noteId: note._id,
      noteName: finalNoteName,
      contentId,
      completed: true,
      url,
    });
  };

  const handleSectionLayout = (index: number, event: any) => {
    const { y, height } = event.nativeEvent.layout;
    sectionPositions.current[index] = { y, height };
  };

  const handleScrollToSection = (index: number) => {
    const position = sectionPositions.current[index];
    if (position) {
      scrollViewRef.current?.scrollTo({ y: position.y, animated: true });
      bottomSheetRef.current?.close();
    }
  };

  useEffect(() => {
    return () => {
      viewingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      viewingTimeouts.current.clear();
    };
  }, []);

  const handleToggleFavorite = () => {
  if (!noteId) return;

  if (isFavorited) {
    removeFromFavorites(noteId); // ✅ NOTE ID
  } else {
    addToFavorites({
      noteId,
      url: favURL || `notes/${noteId}`,
    });
  }
};

  return (
    <View style={styles.container}>
      <MainHeader screenName={note?.noteName || 'Notes'} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        {isLoading && <Loader visible />}
        {isError && (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
            Failed to load notes.
          </Text>
        )}

        <View style={styles.authorContainer}>
          <View style={styles.authorCard}>
            <View style={styles.authorHeader}>
              <Text style={styles.authorTitle}>Author</Text>
              <Image
                source={IMAGES.headerIcons}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.authorName}>{note?.author}</Text>
              <Text style={styles.authorDescription}>
                Expert-curated medical notes designed for clarity and retention.
              </Text>
            </View>
          </View>

          {sections.length > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {completedSections.length} of {totalSections} sections completed ({progress}%)
              </Text>
            </View>
          )}

          <View style={styles.notesHeader}>
            <Text style={styles.notesText}>NOTES</Text>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              disabled={adding || removing}
            >
              {adding || removing ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Feather
                  name="heart"
                  size={24}
                  color={isFavorited ? COLORS.primary : COLORS.black}
                />
              )}
            </TouchableOpacity>
          </View>

          {sections.map((section: any, index: number) => (
            <View
              key={index}
              onLayout={(e) => handleSectionLayout(index, e)}
              style={styles.sectionContainer}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <HTMLWebViewContent html={section.html} onImagePress={setViewingImage} />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
        <Text style={[FONTS.fontSemiBold, { fontSize: 16 }]}>
          Further Study:
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Videos', {
                courseId,
                moduleId,
                sectionId,
                subSectionId,
                subSectionBlockId,
                blockName: noteName,
              })
            }
            style={styles.studyButton}
          >
            <FeatherIcon size={20} color={COLORS.black} name="play-circle" />
            <Text style={styles.studyButtonText}>Watch Videos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('QuizWarning', {
                courseId,
                moduleId,
                sectionId,
                subSectionId,
                questionIds,
              })
            }
            style={styles.studyButton}
          >
            <FeatherIcon size={20} color={COLORS.black} name="check-square" />
            <Text style={styles.studyButtonText}>Practice Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.keypointsButton}
        onPress={() => bottomSheetRef.current?.snapToIndex(1)}
      >
        <Text style={styles.keypointsText}>Keypoints</Text>
      </TouchableOpacity>

      <BottomSheetTOC
        ref={bottomSheetRef}
        items={sections}
        onSelect={handleScrollToSection}
        label={note?.title || 'Jump to Section'}
        mode="notes"
        completedItems={completedSections}
      />

      <ImageViewing
        images={viewingImage ? [{ uri: viewingImage }] : []}
        imageIndex={0}
        visible={!!viewingImage}
        onRequestClose={() => setViewingImage(null)}
      />
    </View>
  );
};

export default Notes;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBackground,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  authorContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  authorCard: {
    backgroundColor: COLORS.small_card_background,
    borderWidth: 1,
    borderColor: COLORS.light_pink,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  authorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorTitle: {
    ...FONTS.fontRegular,
    fontSize: 18,
    color: COLORS.black,
  },
  headerIcon: {
    height: 25,
    width: 110,
  },
  authorInfo: {},
  authorName: {
    ...FONTS.fontSemiBold,
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 5,
  },
  authorDescription: {
    ...FONTS.fontLight,
    fontSize: 13,
    color: COLORS.black,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  notesText: {
    ...FONTS.fontSemiBold,
    fontSize: 20,
    color: COLORS.black,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    ...FONTS.fontRegular,
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  sectionTitle: {
    ...FONTS.fontSemiBold,
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginVertical: '5%',
  },
  sectionTitleCompleted: {
    color: COLORS.primary,
  },
  studyButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  studyButtonText: {
    ...FONTS.fontRegular,
    fontSize: 13,
    color: COLORS.black,
    marginLeft: 8,
  },
  keypointsButton: {
    position: 'absolute',
    right: 0,
    top: height / 2 - 40,
    width: 36,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  keypointsText: {
    ...FONTS.fontRegular,
    fontSize: 11,
    color: COLORS.white,
    transform: [{ rotate: '-90deg' }],
  },
});
