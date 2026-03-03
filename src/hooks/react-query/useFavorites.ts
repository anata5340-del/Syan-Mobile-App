// hooks/react-query/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllFavorites,
  getFavoriteQuizzes,
  getFavoriteVideos,
  getFavoriteNotes,
  getQuestionStatuses,
  getVideoStatuses,
  getNoteStatuses,
  addQuizToFavorites,
  removeQuizFromFavorites,
  addVideoToFavorites,
  removeVideoFromFavorites,
  addNoteToFavorites,
  removeNoteFromFavorites,
  FavoriteQuiz,
  getQuizStatuses
} from '../../api/favorites.services';

/**
 * Hook to get all favorites (quizzes, videos, notes)
 */
export const useAllFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => getAllFavorites(),
    retry: 1,
    staleTime: 0,
  });
};

// all favorite quizzes
export const useFavoriteQuizzes = () => {
  return useQuery({
    queryKey: ['favoriteQuizzes'],
    queryFn: () => getFavoriteQuizzes(),
    retry: 1,
    staleTime: 0,
  });
};

// all favorite videos
export const useFavoriteVideos = () => {
  return useQuery({
    queryKey: ['favoriteVideos'],
    queryFn: () => getFavoriteVideos(),
    retry: 1,
    staleTime: 0,
  });
};

// all favorite notes
export const useFavoriteNotes = () => {
  return useQuery({
    queryKey: ['favoriteNotes'],
    queryFn: () => getFavoriteNotes(),
    retry: 1,
    staleTime: 0,
  });
};

// question statuses
export const useQuestionStatuses = () => {
  return useQuery({
    queryKey: ['questionStatuses'],
    queryFn: () => getQuestionStatuses(),
    retry: 1,
  });
};

export const useQuizStatuses = () => {
  return useQuery({
    queryKey: ['quizStatuses'],
    queryFn: () => getQuizStatuses(),
    retry: 1,
  });
};

// video statuses
export const useVideoStatuses = () => {
  return useQuery({
    queryKey: ['videoStatuses'],
    queryFn: () => getVideoStatuses(),
    retry: 1,
  });
};

// note statuses
export const useNoteStatuses = () => {
  return useQuery({
    queryKey: ['noteStatuses'],
    queryFn: () => getNoteStatuses(),
    retry: 1,
  });
};

// check if a specific quiz is favorited
export const useIsQuizFavorited = (quizId: string) => {
  return useQuery({
    queryKey: ['favoriteQuizzes', quizId],
    queryFn: async () => {
      try {
        const favourites = await getFavoriteQuizzes();
        console.log('🔍 All favorite quizzes:', favourites);
        
        if (!Array.isArray(favourites)) {
          console.warn('⚠️ Favourites is not an array:', favourites);
          return false;
        }
        
        const isFavorited = favourites.some((fav) => {
          console.log('🔍 Comparing:', { favQuizId: fav.quizId, searchQuizId: quizId });
          return fav.quizId === quizId;
        });
        
        console.log(`✓ Quiz ${quizId} is favorited:`, isFavorited);
        return isFavorited;
      } catch (error) {
        console.error('❌ Error checking favorite status:', error);
        return false;
      }
    },
    enabled: !!quizId,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });
};

// check if a specific video is favorited
export const useIsVideoFavorited = (videoId: string) => {
  return useQuery({
    queryKey: ['favoriteVideos', videoId],
    queryFn: async () => {
      try {
        const favourites = await getFavoriteVideos();
        console.log('🔍 All favorite videos:', favourites);
        
        if (!Array.isArray(favourites)) {
          console.warn('⚠️ Favourites is not an array:', favourites);
          return false;
        }
        
        const isFavorited = favourites.some((fav) => {
          console.log('🔍 Comparing:', { favVideoId: fav.video?._id, searchVideoId: videoId });
          return fav.video?._id === videoId;
        });
        
        console.log(`✓ Video ${videoId} is favorited:`, isFavorited);
        return isFavorited;
      } catch (error) {
        console.error('❌ Error checking video favorite status:', error);
        return false;
      }
    },
    enabled: !!videoId,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });
};

// check if a specific note is favorited
export const useIsNoteFavorited = (noteId: string) => {
  return useQuery({
    queryKey: ['favoriteNotes', noteId],
    queryFn: async () => {
      try {
        const favourites = await getFavoriteNotes();
        console.log('🔍 All favorite notes:', favourites);
        
        if (!Array.isArray(favourites)) {
          console.warn('⚠️ Favourites is not an array:', favourites);
          return false;
        }
        
        const isFavorited = favourites.some((fav) => {
          console.log('🔍 Comparing:', { favNoteId: fav.note?._id, searchNoteId: noteId });
          return fav.note?._id === noteId;
        });
        
        console.log(`✓ Note ${noteId} is favorited:`, isFavorited);
        return isFavorited;
      } catch (error) {
        console.error('❌ Error checking note favorite status:', error);
        return false;
      }
    },
    enabled: !!noteId,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });
};

// add quiz to favorites
export const useAddQuizToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteData: FavoriteQuiz) => addQuizToFavorites(favoriteData),
    onSuccess: () => {
      console.log('✓ Quiz added to favorites successfully');
      queryClient.invalidateQueries({ queryKey: ['favoriteQuizzes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Error adding to favorites:', error);
    },
  });
};

// remove quiz from favorites
export const useRemoveQuizFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => removeQuizFromFavorites(quizId),
    onSuccess: () => {
      console.log('✓ Quiz removed from favorites successfully');
      queryClient.invalidateQueries({ queryKey: ['favoriteQuizzes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Error removing from favorites:', error);
    },
  });
};

// add video to favorites
export const useAddVideoToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoData: any) => addVideoToFavorites(videoData),
    onSuccess: () => {
      console.log('✓ Video added to favorites successfully');
      queryClient.invalidateQueries({ queryKey: ['favoriteVideos'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Error adding video to favorites:', error);
    },
  });
};

// remove video from favorites
export const useRemoveVideoFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => removeVideoFromFavorites(videoId),
    onSuccess: () => {
      console.log('✓ Video removed from favorites successfully');
      queryClient.invalidateQueries({ queryKey: ['favoriteVideos'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Error removing video from favorites:', error);
    },
  });
};

// add note to favorites
export const useAddNoteToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteData: any) => addNoteToFavorites(noteData),
    onSuccess: () => {
      console.log('✓ Note added to favorites successfully');
      queryClient.invalidateQueries({ queryKey: ['favoriteNotes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Error adding note to favorites:', error);
    },
  });
};

// remove note from favorites
export const useRemoveNoteFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => removeNoteFromFavorites(noteId),
    onSuccess: () => {
      console.log('✓ Note removed from favorites successfully');
      queryClient.invalidateQueries({ queryKey: ['favoriteNotes'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('❌ Error removing note from favorites:', error.message);
      console.error('❌ Error details:', error.response?.data);
    },
  });
};