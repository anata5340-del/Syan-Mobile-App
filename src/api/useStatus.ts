import api from './client';
import {NOTE_STATUS} from './endpoints'
import { VIDEO_STATUS } from './endpoints';


export interface UpdateNoteStatusPayload {
  noteId: string;
  noteName: string;
  contentId: string; 
  completed: boolean;
  url: string;
}

export interface UpdateVideoStatusPayload {
  videoId: string;
  videoName: string;
  contentId: string;
  url: string;
  completed: boolean;
}


export const getNoteStatus = async () => {
  const res = await api.get(NOTE_STATUS.BY_NOTE());
  return res.data.noteStatus || [];
};



export const updateNoteStatus = async (
  payload: UpdateNoteStatusPayload
) => {
  const res = await api.post(NOTE_STATUS.UPDATE, payload);
  console.log('Update note status response:', res.data);
  return res.data;
};




// Video Status Interfaces and Functions
export const getVideoStatus = async (videoId: string) => {
  const res = await api.get(VIDEO_STATUS.BY_VIDEO(videoId));
  return res.data.videoStatuses || [];
};


export const updateVideoStatus = async (
  payload: UpdateVideoStatusPayload
) => {
  const res = await api.post(VIDEO_STATUS.UPDATE, payload);
  console.log('Update video status response:', res.data);
  return res.data;
}




