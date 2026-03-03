import api from './client';
import { FAVOURITES } from './endpoints';

export interface FavoriteQuiz {
  quizName: string;
  quizId?: string;
  courseId?: string;
  moduleId?: string;
  sectionId?: string;
  subSectionId?: string;
  questionIds?: string;
  duration?: number;
  url?: string;
  _id?: string;
  type?: 'video' | 'library' | 'custom';
}

export interface FavoriteVideo {
  video: {
    _id: string;
    name: string;
  };
  url?: string;
  _id?: string;
  courseId?: string;
  moduleId?: string;
  sectionId?: string;
  subSectionId?: string;
  blockId?: string;
}

export interface FavoriteNote {
  note: {
    _id: string;
    name: string;
  };
  url?: string;
  _id?: string;
  courseId?: string;
  moduleId?: string;
  sectionId?: string;
  subSectionId?: string;
  blockId?: string;
}

export interface QuestionStatus {
  questionId: string;
  questionName: string;
  correct: boolean;
  createdAt: string;
}

export interface QuizStatus {
  _id: string;
  content?: Array<{ questionId: string; correct: boolean }>;
  userId: string;
  createdAt: string;
  quizName: string;
  progress?: number;
  updatedAt: string;
  /** Backend URL containing quiz type and params, e.g. /user/quiz/:id/library/customQuestions?t=1800&topics=...&limit=6 */
  url?: string;
}

export interface VideoStatus {
  _id: string;
  videoId: string;
  content: Array<{ completed: boolean }>;
  createdAt: string;
  updatedAt: string;
  videoName: string;
  /** Backend URL with course/module/section/subSection/block ids, e.g. /user/videoCourses/:courseId/modules/.../videos/:id?m=&s=&ss=&ssb= */
  url?: string;
}

export interface NoteStatus {
  noteId: string;
  content: Array<{ completed: boolean }>;
  createdAt: string;
  _id: string;
  noteName: string;
  updatedAt: string;
  /** Backend URL with course/module/section/subSection/block ids */
  url?: string;
}

export interface FavoritesData {
  _id: string;
  user: string;
  favouriteNotes: FavoriteNote[];
  favouriteVideos: FavoriteVideo[];
  favouriteQuizes: FavoriteQuiz[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FavoritesApiResponse {
  favourites: FavoritesData;
}


//get all favorites quiz video notes
export const getAllFavorites = async (): Promise<FavoritesData> => {
  console.log('Fetching all favorites...');
  const response = await api.get<FavoritesApiResponse>(FAVOURITES.BASE);
  console.log('Favorites fetched:', response.data.favourites);
  return response.data.favourites;
};

//get all favorite quizzes
export const getFavoriteQuizzes = async (): Promise<FavoriteQuiz[]> => {
  const response = await api.get<FavoritesApiResponse>(FAVOURITES.BASE);
  console.log('Favorite Quizzes:', response.data?.favourites?.favouriteQuizes);
  return response.data?.favourites?.favouriteQuizes || [];
};

//get all favorite videos
export const getFavoriteVideos = async (): Promise<FavoriteVideo[]> => {
  const response = await api.get<FavoritesApiResponse>(FAVOURITES.BASE);
  console.log('Favorite Videos:', response.data?.favourites?.favouriteVideos);
  return response.data?.favourites?.favouriteVideos || [];
};

//get all favorite notes
export const getFavoriteNotes = async (): Promise<FavoriteNote[]> => {
  const response = await api.get<FavoritesApiResponse>(FAVOURITES.BASE);
  console.log('Favorite Notes:', response.data?.favourites?.favouriteNotes);
  return response.data?.favourites?.favouriteNotes || [];
};

//get question statuses (for progress tracking)
export const getQuestionStatuses = async (): Promise<QuestionStatus[]> => {
  const response = await api.get('/users/question-status');
  return response.data.questionStatuses || [];
};


export const getQuizStatuses = async (): Promise<QuizStatus[]> => {
  const response = await api.get('/users/quiz-status');
  return response.data.quizStatuses || [];
};

//get video statuses (for progress tracking)
export const getVideoStatuses = async (): Promise<VideoStatus[]> => {
  const response = await api.get('/users/video-status');
  return response.data.videoStatuses || [];
};

//get note statuses (for progress tracking)
export const getNoteStatuses = async (): Promise<NoteStatus[]> => {
  const response = await api.get('/users/note-status');
  return response.data.noteStatus || [];
};

//add quiz to favorites
export const addQuizToFavorites = async (favoriteData: FavoriteQuiz): Promise<FavoritesApiResponse> => {
  console.log('Adding quiz to favorites:', favoriteData);
  const response = await api.post<FavoritesApiResponse>(FAVOURITES.BASE, {
    favouriteQuizes: [
      {
        quizName: favoriteData.quizName,
        url: favoriteData.url,
      },
    ],
  });
  console.log('Quiz added to favorites');
  return response.data;
};

//remove quiz from favorites
export const removeQuizFromFavorites = async (quizId: string): Promise<FavoritesApiResponse> => {
  console.log('Removing quiz from favorites:', quizId);
  const response = await api.delete<FavoritesApiResponse>(FAVOURITES.BASE, {
    data: {
      favouriteQuizes: [{ quizId }],
    },
  });
  console.log('Quiz removed from favorites');
  return response.data;
};

//add video to favorites
export const addVideoToFavorites = async ({
  videoId,
  url,
}: {
  videoId: string;
  url: string;
}): Promise<FavoritesApiResponse> => {
  return api.post(FAVOURITES.BASE, {
    favouriteVideos: [
      {
        _id: videoId,
        url,
      },
    ],
  });
};

//remove video from favorites
export const removeVideoFromFavorites = async (videoId: string) => {

  const payload = {
        favouriteVideos: [
          { _id: videoId }
        ],
      };

  return api.delete(FAVOURITES.BASE, {
    data: payload,
  });
};

//add note to favorites
export const addNoteToFavorites = async ({
  noteId,
  url,
}: {
  noteId: string;
  url: string;
}): Promise<FavoritesApiResponse> => {
  console.log(' Adding note to favorites:', noteId);

  const response = await api.post<FavoritesApiResponse>(FAVOURITES.BASE, {
    favouriteNotes: [
      {
        _id : noteId,
        url,
      },
    ],
  });

  return response.data;
};

//remove note from favorites
export const removeNoteFromFavorites = async (
  favoriteId: string
): Promise<FavoritesApiResponse> => {
  console.log('Removing favorite:', favoriteId);

  const response = await api.delete<FavoritesApiResponse>(FAVOURITES.BASE, {
    data: {
      favouriteNotes: [
        {
          _id: favoriteId,
        },
      ],
    },
  });

  return response.data;
};