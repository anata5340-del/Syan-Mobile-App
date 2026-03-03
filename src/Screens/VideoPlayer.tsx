import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/RootStackParamList';
import MainHeader from '../layout/MainHeader';
import { COLORS, FONTS } from '../Constants/theme';
import { IMAGES } from '../Constants/Images';
import Video, { VideoRef, OnProgressData, OnLoadData } from 'react-native-video';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useVideoById } from '../hooks/react-query/useVideoCourses';

const { width } = Dimensions.get('window');
const VIDEO_ASPECT_RATIO = 16 / 9;
const VIDEO_HEIGHT = width * (9 / 16);

export type VideoPlayerParams = {
  /** Fetch video from backend by ID (GET /videoCourses/video/:videoId) */
  videoId: string;
  /** Optional: pass direct URL to play without fetching (skips backend) */
  videoUrl?: string;
  /** Optional title when using videoUrl */
  title?: string;
};

type Props = StackScreenProps<RootStackParamList, 'VideoPlayer'>;

const VideoPlayer = ({ navigation, route }: Props) => {
  const { videoId, videoUrl: directVideoUrl, title: directTitle } = route.params;

  const videoRef = useRef<VideoRef>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const { data, isLoading, isError } = useVideoById(videoId ?? '', {
    enabled: !!videoId && !directVideoUrl,
  });

  const videoFromBackend = data?.video ?? data;
  const videoSource = directVideoUrl ?? videoFromBackend?.videoSource;
  const videoTitle = directTitle ?? videoFromBackend?.name ?? videoFromBackend?.title ?? 'Video';
  const thumbnail = videoFromBackend?.thumbnail;

  const secondsToTimeString = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const onProgress = useCallback((data: OnProgressData) => {
    setCurrentTime(data.currentTime);
  }, []);

  const onLoad = useCallback((data: OnLoadData) => {
    setDuration(data.duration);
    setIsVideoLoaded(true);
    setVideoError(null);
  }, []);

  const onVideoError = useCallback(() => {
    setVideoError('Failed to play video');
  }, []);

  const togglePlayPause = useCallback(() => {
    setShowControls(true);
    setIsPaused((p) => !p);
  }, []);

  const toggleControls = useCallback(() => {
    setShowControls((c) => !c);
  }, []);

  const skipTime = useCallback((delta: number) => {
    videoRef.current?.seek(Math.max(0, currentTime + delta));
  }, [currentTime]);

  const handlePlay = useCallback(() => {
    setIsVideoLoaded(true);
    setIsPaused(false);
  }, []);

  if (!videoId && !directVideoUrl) {
    return (
      <View style={styles.screen}>
        <MainHeader screenName="Video Player" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Missing videoId or videoUrl</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!directVideoUrl && (isLoading || !videoSource)) {
    return (
      <View style={styles.screen}>
        <MainHeader screenName="Video Player" />
        <View style={[styles.videoContainer, styles.centered]}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : isError ? (
            <>
              <Text style={styles.errorText}>Failed to load video</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                <Text style={styles.retryButtonText}>Go Back</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MainHeader screenName={videoTitle} />

      <View style={styles.videoContainer}>
        {!isVideoLoaded ? (
          <ImageBackground
            source={thumbnail ? { uri: thumbnail } : IMAGES.courses_pic1}
            resizeMode="cover"
            style={styles.thumbnailBg}
          >
            <View style={styles.thumbnailOverlay}>
              <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
                <FeatherIcon size={50} color={COLORS.white} name="play" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <TouchableOpacity activeOpacity={1} onPress={toggleControls} style={styles.videoWrapper}>
            <Video
              ref={videoRef}
              source={{
                uri: videoSource,
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
              onError={onVideoError}
              controls={false}
              repeat={false}
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
              onLoadStart={() => setIsBuffering(true)}
            />

            {isBuffering && (
              <View style={styles.bufferingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}

            {showControls && (
              <View style={styles.controlsOverlay}>
                <View style={styles.centerControls}>
                  <TouchableOpacity onPress={() => skipTime(-10)} style={styles.skipBtn}>
                    <MaterialIcon size={36} color="#fff" name="replay-10" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseBtn}>
                    <FeatherIcon size={44} color="#fff" name={isPaused ? 'play' : 'pause'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => skipTime(10)} style={styles.skipBtn}>
                    <MaterialIcon size={36} color="#fff" name="forward-10" />
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomControls}>
                  <Text style={styles.timeText}>{secondsToTimeString(currentTime)}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' },
                      ]}
                    />
                  </View>
                  <Text style={styles.timeText}>{secondsToTimeString(duration)}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}

        {videoError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{videoError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setVideoError(null);
                setIsPaused(false);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.mainBackground,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    height: VIDEO_HEIGHT,
    aspectRatio: VIDEO_ASPECT_RATIO,
  },
  thumbnailBg: {
    flex: 1,
  },
  thumbnailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    padding: 20,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  centerControls: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -28 }],
  },
  skipBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 28,
    padding: 12,
    marginHorizontal: 16,
  },
  playPauseBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 40,
    padding: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  timeText: {
    ...FONTS.fontRegular,
    fontSize: 12,
    color: '#fff',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    ...FONTS.fontSemiBold,
    color: '#fff',
    fontSize: 14,
  },
});
