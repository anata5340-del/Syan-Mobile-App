import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { IMAGES } from '../Constants/Images';
import { COLORS, FONTS } from '../Constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import { Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { GlobalStyleSheet } from '../Constants/StyleSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetTOC from '../Components/BotomSheets/BottomSheetTOC';
import { useSubSectionBlockVideo } from '../hooks/react-query/useVideoCourses';
import { useVideoStatus, useUpdateVideoStatus } from '../hooks/react-query/useStatus';
import Loader from '../Components/Loader';
import Video, { VideoRef, OnProgressData, OnLoadData } from 'react-native-video';
import Pdf from 'react-native-pdf';
import { 
  useIsVideoFavorited, 
  useAddVideoToFavorites, 
  useRemoveVideoFromFavorites 
} from '../hooks/react-query/useFavorites';

const { height, width } = Dimensions.get('window');
const VIDEO_ASPECT_RATIO = 16 / 9;
const INLINE_VIDEO_HEIGHT = (width - 40) * (9 / 16);
const CONTROLS_HIDE_TIMEOUT = 3000;

type Props = StackScreenProps<RootStackParamList, 'Videos'>;

const Videos = ({ navigation, route }: Props) => {
  const {
    courseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId,
    blockName,
    questionIds,
  } = route.params;

  // ============== REFS ==============
  const videoRef = useRef<VideoRef>(null);
  const fullscreenVideoRef = useRef<VideoRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionCheckedRef = useRef<Set<string>>(new Set());
  const lastProgressTimeRef = useRef<number>(0);
  const progressUpdateTimeRef = useRef<number>(0);

  // ============== STATE ==============
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showInlineControls, setShowInlineControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);
  const [completedContentIds, setCompletedContentIds] = useState<string[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);

  // ============== DATA FETCHING ==============
  const { data, isLoading, isError } = useSubSectionBlockVideo(
    courseId,
    moduleId,
    sectionId,
    subSectionId,
    subSectionBlockId
  );

  const videoData = data?.video;

  // ============== FAVORITES ==============
  const { data: isFavorited, isLoading: isFavoriteLoading } = useIsVideoFavorited(videoData?._id || '');
  const addToFavoritesMutation = useAddVideoToFavorites();
  const removeFromFavoritesMutation = useRemoveVideoFromFavorites();

  // ============== VIDEO STATUS ==============
  const { data: videoStatuses } = useVideoStatus(videoData?._id || '');
  const updateVideoStatusMutation = useUpdateVideoStatus();

  // ============== MEMOIZED COMPUTATIONS ==============
  const contentSections = useMemo(() => {
    if (!videoData?.content) return [];
    
    return videoData.content.map((item: any) => ({
      title: `${item.name} (${item.startTime} - ${item.endTime})`,
      correct: completedContentIds.includes(item._id),
      _id: item._id,
      startTime: item.startTime,
    }));
  }, [videoData?.content, completedContentIds]);

  // ============== UTILITY FUNCTIONS ==============
  const timeStringToSeconds = useCallback((time: string): number => {
    try {
      const parts = time.split(':').map(Number);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      return 0;
    } catch {
      return 0;
    }
  }, []);

  const secondsToTimeString = useCallback((seconds: number): string => {
    try {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } catch {
      return '00:00';
    }
  }, []);

  const formatDuration = useCallback((startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  }, []);

  // ============== VIDEO CALLBACKS ==============
  const onProgress = useCallback((data: OnProgressData) => {
    const now = Date.now();
    
    // Throttle progress updates to 500ms
    if (now - progressUpdateTimeRef.current >= 500) {
      progressUpdateTimeRef.current = now;
      setCurrentTime(data.currentTime);
    }

    // Check for content completion (throttle to 1 second)
    if (now - lastProgressTimeRef.current >= 1000 && videoData?.content?.length) {
      lastProgressTimeRef.current = now;

      videoData.content.forEach((item: any) => {
        if (completionCheckedRef.current.has(item._id)) return;

        const endTimeInSeconds = timeStringToSeconds(item.endTime);

        if (data.currentTime >= endTimeInSeconds) {
          completionCheckedRef.current.add(item._id);
          
          setCompletedContentIds(prev => {
            if (prev.includes(item._id)) return prev;
            return [...prev, item._id];
          });

          updateVideoStatusMutation.mutate({
            videoId: videoData._id,
            videoName: videoData.name || videoData.title,
            contentId: item._id,
            url: 'mobile-app/video',
            completed: true,
          });
        }
      });
    }
  }, [videoData, timeStringToSeconds, updateVideoStatusMutation]);

  const onLoad = useCallback((data: OnLoadData) => {
    setDuration(data.duration);
    setIsBuffering(false);
    setVideoError(null);
  }, []);

  const onBuffer = useCallback(({ isBuffering: buffering }: { isBuffering: boolean }) => {
    setIsBuffering(buffering);
  }, []);

  const onVideoError = useCallback((error: any) => {
    console.error('Video Error:', error);
    setVideoError('Failed to load video. Please check your connection.');
    setIsBuffering(false);
  }, []);

  // ============== PLAYBACK CONTROLS ==============
  const handlePlayInline = useCallback(() => {
    setIsVideoLoaded(true);
    setIsPaused(false);
    setShowInlineControls(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const skipTime = useCallback((seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    const activeRef = isFullscreen ? fullscreenVideoRef : videoRef;
    activeRef.current?.seek(newTime);
    setShowInlineControls(true);
  }, [currentTime, duration, isFullscreen]);

  const seekToTimestamp = useCallback((timeString: string) => {
    const seconds = timeStringToSeconds(timeString);
    const activeRef = isFullscreen ? fullscreenVideoRef : videoRef;
    activeRef.current?.seek(seconds);
    setIsPaused(false);
    setIsVideoLoaded(true);
    setShowInlineControls(true);
  }, [isFullscreen, timeStringToSeconds]);

  // ============== FULLSCREEN CONTROLS ==============
  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setShowFullscreenControls(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setShowInlineControls(true);
  }, []);

  // ============== SIMPLIFIED CONTROLS VISIBILITY ==============
  const toggleControls = useCallback(() => {
    if (isFullscreen) {
      setShowFullscreenControls(prev => !prev);
    } else {
      setShowInlineControls(prev => !prev);
    }
  }, [isFullscreen]);

  // Schedule auto-hide after a delay
  useEffect(() => {
    if (!isPaused && (showInlineControls || showFullscreenControls)) {
      const timer = setTimeout(() => {
        if (isFullscreen) {
          setShowFullscreenControls(false);
        } else {
          setShowInlineControls(false);
        }
      }, CONTROLS_HIDE_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [isPaused, showInlineControls, showFullscreenControls, isFullscreen]);

  // ============== NAVIGATION & HELPERS ==============
  const handleScrollToSection = useCallback((index: number) => {
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenPdf = useCallback(() => {
    setShowPdfModal(true);
  }, []);

  const handleFavoriteToggle = useCallback(async () => {
    if (!videoData?._id) return;

    const url = `mobile-app/video/${courseId}/${moduleId}/${sectionId}/${subSectionId}/${subSectionBlockId}`;

    try {
      if (isFavorited) {
        await removeFromFavoritesMutation.mutateAsync(videoData._id);
      } else {
        await addToFavoritesMutation.mutateAsync({
          videoId: videoData._id,
          url,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [videoData?._id, isFavorited, courseId, moduleId, sectionId, subSectionId, subSectionBlockId, addToFavoritesMutation, removeFromFavoritesMutation]);

  const markContentCompleted = useCallback((item: any) => {
    if (completionCheckedRef.current.has(item._id)) {
      return;
    }

    completionCheckedRef.current.add(item._id);

    setCompletedContentIds(prev => {
      if (prev.includes(item._id)) return prev;
      return [...prev, item._id];
    });

    updateVideoStatusMutation.mutate({
      videoId: videoData._id,
      videoName: videoData.name || videoData.title,
      contentId: item._id,
      url: 'mobile-app/video',
      completed: true,
    });
  }, [videoData, updateVideoStatusMutation]);

  // ============== EFFECTS ==============
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Schedule auto-hide after a delay
  useEffect(() => {
    if (!isPaused && (showInlineControls || showFullscreenControls)) {
      const timer = setTimeout(() => {
        if (isFullscreen) {
          setShowFullscreenControls(false);
        } else {
          setShowInlineControls(false);
        }
      }, CONTROLS_HIDE_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [isPaused, showInlineControls, showFullscreenControls, isFullscreen]);

  useEffect(() => {
    if (!videoStatuses || !videoData?._id) return;

    const status = videoStatuses.find((s: any) => s.videoId === videoData._id);

    if (status?.content?.length) {
      const completedIds = status.content
        .filter((c: any) => c.completed)
        .map((c: any) => c.contentId);
      
      setCompletedContentIds(completedIds);
      completedIds.forEach((id: string) => completionCheckedRef.current.add(id));
    }
  }, [videoStatuses, videoData?._id]);

  // ============== RENDER ==============
  if (isLoading) {
    return <Loader visible />;
  }

  if (isError || !videoData) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
        <MainHeader 
          screenName={blockName || 'Video'} 
          heartIcon 
          isHeartFilled={false}
          onHeartPress={() => {}}
          heartLoading={false}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 16 }}>
            Failed to load video
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.mainBackground }}>
      <MainHeader 
        screenName={videoData.name || blockName} 
        heartIcon 
        isHeartFilled={isFavorited || false}
        onHeartPress={handleFavoriteToggle}
        heartLoading={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending || isFavoriteLoading}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <View style={{ marginHorizontal: -15, paddingHorizontal: 15, paddingTop: 8 }}>
          {/* Video Title */}
          <Text style={[FONTS.fontRegular, { fontSize: 16, color: COLORS.black }]}>
            {videoData.title || videoData.name}
          </Text>

          {/* Duration and ID */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.black }]}>
              {duration > 0 ? secondsToTimeString(duration) : 'VIDEO CONTENT'}
            </Text>
            <Text style={[FONTS.fontLight, { fontSize: 14, color: COLORS.black }]}>
              ID: {videoData.displayId || 'N/A'}
            </Text>
          </View>

          {/* Author Badge */}
          <View style={{ backgroundColor: COLORS.light_pink, marginRight: '35%', padding: 8, borderRadius: 7, marginVertical: 10 }}>
            <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.black }]}>
              By: {videoData.author || 'Unknown'}
            </Text>
          </View>

          {/* VIDEO PLAYER CONTAINER */}
          <View style={styles.videoContainer}>
            {!isVideoLoaded ? (
              <ImageBackground
                source={videoData.thumbnail ? { uri: videoData.thumbnail } : IMAGES.courses_pic1}
                resizeMode="cover"
                style={{ flex: 1 }}
              >
                <View style={styles.thumbnailOverlay}>
                  <TouchableOpacity onPress={handlePlayInline} style={styles.playButton}>
                    <FeatherIcon size={50} color={COLORS.white} name={'play'} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            ) : (
              <View style={{ flex: 1, backgroundColor: '#000' }}>
                {/* MAIN VIDEO PLAYER */}
                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={toggleControls} 
                  style={{ flex: 1 }}
                >
                  <Video
                    ref={videoRef}
                    source={{
                      uri: videoData.videoSource,
                      bufferConfig: {
                        minBufferMs: 15000,
                        maxBufferMs: 50000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000,
                      },
                    }}
                    style={styles.video}
                    resizeMode="contain"
                    paused={isPaused}
                    onProgress={onProgress}
                    onLoad={onLoad}
                    onBuffer={onBuffer}
                    onError={onVideoError}
                    controls={false}
                    repeat={false}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="ignore"
                    onLoadStart={() => setIsBuffering(true)}
                  />

                  {/* BUFFERING INDICATOR */}
                  {isBuffering && (
                    <View style={styles.bufferingContainer}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                  )}

                  {/* INLINE CONTROLS OVERLAY */}
                  {showInlineControls && (
                    <View style={styles.inlineControlsOverlay}>
                      <View style={styles.topControls}>
                        <TouchableOpacity onPress={openFullscreen} style={styles.fullscreenBtn}>
                          <MaterialIcon size={24} color={COLORS.white} name={'fullscreen'} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.centerControls}>
                        <TouchableOpacity onPress={() => skipTime(-5)} style={styles.skipButton}>
                          <MaterialIcon size={40} color={COLORS.white} name={'replay-5'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
                          <FeatherIcon size={40} color={COLORS.white} name={isPaused ? 'play' : 'pause'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => skipTime(5)} style={styles.skipButton}>
                          <MaterialIcon size={40} color={COLORS.white} name={'forward-5'} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.bottomControls}>
                        <Text style={styles.timeTextSmall}>{secondsToTimeString(currentTime)}</Text>
                        <View style={styles.progressBarSmall}>
                          <View 
                            style={[
                              styles.progressFillSmall, 
                              { 
                                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.timeTextSmall}>{secondsToTimeString(duration)}</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* ERROR STATE */}
            {videoError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{videoError}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    setVideoError(null);
                    videoRef.current?.seek(currentTime);
                  }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 16 }}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={{ marginTop: 15 }}>
            <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.black, marginBottom: 5 }]}>
              Description
            </Text>
            <View style={{ backgroundColor: COLORS.gray, padding: 10, paddingHorizontal: 15, borderRadius: 15 }}>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.black, lineHeight: 20 }]}>
                {videoData.description || 'No description available'}
              </Text>
            </View>
          </View>

          {/* TIMELINE SECTION */}
          {videoData.content && videoData.content.length > 0 && (
            <TimelineSection
              content={videoData.content}
              completedContentIds={completedContentIds}
              onSeek={seekToTimestamp}
              onMarkComplete={markContentCompleted}
              formatDuration={formatDuration}
            />
          )}

          {/* Categories */}
          {videoData.categories && videoData.categories.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.black, marginBottom: 10 }]}>
                Categories
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {videoData.categories.map((category: any) => (
                  <View
                    key={category._id}
                    style={{ 
                      backgroundColor: COLORS.primary, 
                      paddingHorizontal: 12, 
                      paddingVertical: 6, 
                      borderRadius: 15, 
                      marginRight: 8, 
                      marginBottom: 8 
                    }}
                  >
                    <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.white }]}>
                      {category.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* PDF Button */}
          {videoData.pdfSource && (
            <TouchableOpacity style={styles.pdfButton} onPress={handleOpenPdf}>
              <FeatherIcon size={20} color={COLORS.white} name={'file-text'} style={{ marginRight: 8 }} />
              <Text style={[FONTS.fontSemiBold, { fontSize: 16, color: COLORS.white }]}>
                View PDF Notes
              </Text>
            </TouchableOpacity>
          )}

          {/* Feedback Section */}
          <View style={{ paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.black }]}>
              Have comments about this video?
            </Text>
            <TouchableOpacity>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.primary }]}>
                Leave us feedback
              </Text>
            </TouchableOpacity>
          </View>

          {/* Author Card */}
          <View style={styles.authorCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[FONTS.fontRegular, { fontSize: 18, color: COLORS.black }]}>
                Author
              </Text>
              <Image source={IMAGES.headerIcons} style={{ height: 25, width: 110 }} resizeMode="contain" />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.black }]}>
                {videoData.author || 'The SYAN Team'}
              </Text>
              <Text style={[FONTS.fontLight, { fontSize: 13, color: COLORS.black }]}>
                A dedicated team of UK doctors who want to make learning medicine beautifully simple.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Further Study Section */}
      <View style={[GlobalStyleSheet.container, { paddingTop: 0 }]}>
        <View style={{ marginTop: 8 }}>
          <Text style={[FONTS.fontSemiBold, { fontSize: 16, color: COLORS.black, marginBottom: 8 }]}>
            Further Study:
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notes', { courseId, moduleId, sectionId, subSectionId, subSectionBlockId })}
              style={styles.studyButton}
            >
              <FeatherIcon size={20} color={COLORS.black} name={'align-right'} />
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.black, paddingLeft: 9 }]}>
                Read Notes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('QuizWarning', { courseId, moduleId, sectionId, subSectionId, questionIds })}
              style={styles.studyButton}
            >
              <FeatherIcon size={20} color={COLORS.black} name={'check-square'} />
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.black, paddingLeft: 9 }]}>
                Practice Quiz
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Timeline Button */}
      {contentSections.length > 0 && (
        <>
          <TouchableOpacity style={styles.keypointsButton} onPress={() => bottomSheetRef.current?.snapToIndex(1)}>
            <Text style={styles.keypointsText}>Timeline</Text>
          </TouchableOpacity>

          <BottomSheetTOC
            ref={bottomSheetRef}
            items={contentSections}
            onSelect={handleScrollToSection}
            label="Jump to Timestamp"
            mode='quizExplanation'
          />
        </>
      )}

      {/* FULLSCREEN MODAL */}
      <Modal 
        visible={isFullscreen} 
        animationType="fade"
        onRequestClose={closeFullscreen} 
        supportedOrientations={['landscape', 'portrait']}
      >
        <StatusBar hidden={true} />
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={toggleControls} 
            style={{ flex: 1 }}
          >
            <Video
              ref={fullscreenVideoRef}
              source={{
                uri: videoData.videoSource,
                bufferConfig: {
                  minBufferMs: 15000,
                  maxBufferMs: 50000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 5000,
                },
              }}
              style={styles.fullscreenVideo}
              resizeMode="contain"
              paused={isPaused}
              onProgress={onProgress}
              onLoad={onLoad}
              onBuffer={onBuffer}
              onError={onVideoError}
              controls={false}
              repeat={false}
              playInBackground={false}
              playWhenInactive={false}
            />

            {isBuffering && (
              <View style={styles.bufferingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}

            {showFullscreenControls && (
              <View style={styles.fullscreenControlsOverlay}>
                <View style={styles.fullscreenTopBar}>
                  <TouchableOpacity onPress={closeFullscreen} style={styles.closeButton}>
                    <MaterialIcon size={28} color={COLORS.white} name={'close'} />
                  </TouchableOpacity>
                  <Text style={styles.fullscreenTitle} numberOfLines={1}>
                    {videoData.title || videoData.name}
                  </Text>
                  <View style={{ width: 40 }} />
                </View>

                <View style={styles.fullscreenCenterControls}>
                  <TouchableOpacity onPress={() => skipTime(-10)} style={styles.fullscreenSkipButton}>
                    <MaterialIcon size={50} color={COLORS.white} name={'replay-10'} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={togglePlayPause} style={styles.fullscreenPlayButton}>
                    <FeatherIcon size={60} color={COLORS.white} name={isPaused ? 'play' : 'pause'} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => skipTime(10)} style={styles.fullscreenSkipButton}>
                    <MaterialIcon size={50} color={COLORS.white} name={'forward-10'} />
                  </TouchableOpacity>
                </View>

                <View style={styles.fullscreenBottomBar}>
                  <Text style={styles.fullscreenTimeText}>{secondsToTimeString(currentTime)}</Text>
                  <View style={styles.fullscreenProgressBar}>
                    <View 
                      style={[
                        styles.fullscreenProgressFill, 
                        { 
                          width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.fullscreenTimeText}>{secondsToTimeString(duration)}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      {/* PDF Modal */}
      <Modal visible={showPdfModal} animationType="slide" onRequestClose={() => setShowPdfModal(false)}>
        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfHeaderText}>PDF Notes</Text>
            <TouchableOpacity onPress={() => setShowPdfModal(false)}>
              <FeatherIcon size={28} color={COLORS.black} name={'x'} />
            </TouchableOpacity>
          </View>
          <Pdf
            source={{ uri: videoData.pdfSource, cache: true }}
            style={styles.pdf}
            onLoadComplete={(numberOfPages) => console.log(`Pages: ${numberOfPages}`)}
            onError={(error) => console.log('PDF Error:', error)}
          />
        </View>
      </Modal>
    </View>
  );
};

// ============== TIMELINE SECTION COMPONENT ==============
const TimelineSection = React.memo(({ 
  content, 
  completedContentIds, 
  onSeek, 
  onMarkComplete, 
  formatDuration 
}: any) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={[FONTS.fontSemiBold, { fontSize: 18, color: COLORS.black, marginBottom: 10 }]}>
        Content Timeline
      </Text>
      {content.map((item: any) => (
        <TimelineCard
          key={item._id}
          item={item}
          isCompleted={completedContentIds.includes(item._id)}
          onSeek={onSeek}
          onMarkComplete={onMarkComplete}
          formatDuration={formatDuration}
        />
      ))}
    </View>
  );
});

TimelineSection.displayName = 'TimelineSection';

// ============== TIMELINE CARD COMPONENT ==============
const TimelineCard = React.memo(({ item, isCompleted, onSeek, onMarkComplete, formatDuration }: any) => {
  return (
    <TouchableOpacity
      onPress={() => onSeek(item.startTime)}
      style={{
        backgroundColor: COLORS.gray,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[FONTS.fontSemiBold, { fontSize: 16, color: COLORS.black }]}>
          {item.name}
        </Text>
        <Text style={[FONTS.fontLight, { fontSize: 13, color: COLORS.black }]}>
          {formatDuration(item.startTime, item.endTime)}
        </Text>
      </View>

      {isCompleted ? (
        <FeatherIcon name="check-circle" size={22} color={COLORS.secondary} />
      ) : (
        <TouchableOpacity
          onPress={() => onMarkComplete(item)}
          style={{
            padding: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.primary,
          }}
        >
          <FeatherIcon name="check" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

TimelineCard.displayName = 'TimelineCard';

// ============== STYLES ==============
const styles = StyleSheet.create({
  videoContainer: {
    borderRadius: 22,
    overflow: 'hidden',
    marginVertical: 22,
    backgroundColor: '#000',
    aspectRatio: VIDEO_ASPECT_RATIO,
    height: INLINE_VIDEO_HEIGHT,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
    padding: 20,
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  errorText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  inlineControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  topControls: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  fullscreenBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  centerControls: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -30 }],
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 15,
  },
  playPauseBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
    padding: 15,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarSmall: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  timeTextSmall: {
    ...FONTS.fontRegular,
    fontSize: 11,
    color: COLORS.white,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    width: width,
    height: height,
  },
  fullscreenControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  fullscreenTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenTitle: {
    ...FONTS.fontSemiBold,
    fontSize: 16,
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  fullscreenCenterControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenSkipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
    padding: 15,
    marginHorizontal: 20,
  },
  fullscreenPlayButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 20,
  },
  fullscreenBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  fullscreenProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  fullscreenProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  fullscreenTimeText: {
    ...FONTS.fontRegular,
    fontSize: 13,
    color: COLORS.white,
  },
  pdfButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  authorCard: {
    backgroundColor: COLORS.small_card_background,
    borderWidth: 1,
    borderColor: COLORS.light_pink,
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
  },
  studyButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  keypointsButton: {
    position: 'absolute',
    right: 0,
    top: height / 2 - 40,
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
  pdfContainer: {
    flex: 1,
    backgroundColor: COLORS.mainBackground,
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 15,
      },
    }),
  },
  pdfHeaderText: {
    ...FONTS.fontSemiBold,
    fontSize: 18,
    color: COLORS.black,
  },
  pdf: {
    flex: 1,
  },
});

export default Videos;