import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNoteStatus,
  updateNoteStatus,
  UpdateNoteStatusPayload,
  getVideoStatus,
  updateVideoStatus,
  UpdateVideoStatusPayload,
} from '../../api/useStatus';

export const useNoteStatus = () => {
  return useQuery({
    queryKey: ['noteStatus'],
    queryFn: () => getNoteStatus(),
    retry: 1,
  });
};



export const useUpdateNoteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNoteStatusPayload) =>
      updateNoteStatus(payload),

    onSuccess: (data, variables) => {
      // Refresh note status after update
      console.log(' Mutation success:', data);
      queryClient.invalidateQueries({
        queryKey: ['noteStatus', variables.noteId],
      });
    },
    onError: (error) => {
      console.log(' Mutation error details:', error.response?.data);
      console.log(' Status code:', error.response?.status);
    },
  });
};


export const useVideoStatus = (videoId: string) => {
  return useQuery({
    queryKey: ['videoStatuses', videoId],
    queryFn: () => getVideoStatus(videoId),
    enabled: !!videoId,
    retry: 1,
  });
};


export const useUpdateVideoStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateVideoStatusPayload) =>
      updateVideoStatus(payload),
    onSuccess: (data, variables) => {
      console.log(' Video Mutation success:', data);
      queryClient.invalidateQueries({
        queryKey: ['videoStatuses', variables.videoId],
      });
    },
    onError: (error) => {
      console.log(' Video Mutation error details:', error.response?.data);
      console.log(' Status code:', error.response?.status);
    },
  });
}
