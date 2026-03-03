const base = ''; // axios instance already configured with /api

export const AUTH = {
  LOGIN: `${base}/users/login`,
  LOGOUT: `${base}/users/logout`,
  VALIDATE: `${base}/users/validate`,
  RESET_PASSWORD: `${base}/users/reset-password`,
  VALIDATE_VERIFY: `${base}/users/validate/verify`,
};

export const USERS = {
  PROFILE: (id: string) => `${base}/users/${id}`,
  PACKAGES: (id: string) => `${base}/users/${id}/packages`,
  NOTE_STATUS: `${base}/users/note-status`,
  VIDEO_STATUS: `${base}/users/video-status`,
  QUESTION_STATUS: `${base}/users/question-status`,
  QUIZ_STATUS: `${base}/users/quiz-status`,
};

export const PACKAGES = {
  BY_ID: (id: string) => `${base}/packages/${id}`,
};

export const QUIZZES = {
  BASE: `${base}/quizes`,
  BY_ID: (id: string) => `${base}/quizes/${id}`,
  LIBRARY: (id: string) => `${base}/quizes/${id}/library`,
  CUSTOM_LIBRARY: (id: string) => `${base}/quizes/${id}/customLibrary`,
  LIBRARY_PAPER: (id: string, paperId: string) => `${base}/quizes/${id}/library/${paperId}`,

  LIBRARY_PAPER_QUESTIONS: (quizId: string, paperId: string) => 
    `${base}/quizes/${quizId}/library/${paperId}`,

  // Custom quiz questions (returns customLibrary with topic structure; subTopics[].questions are IDs)
  CUSTOM_QUIZ_QUESTIONS: (quizId: string, topicIds: string, limit?: number) => 
    `${base}/quizes/${quizId}/customLibrary?topicIds=${topicIds}${limit ? `&limit=${limit}` : ''}`,

  // Fetch full question objects by IDs (used after customLibrary returns question IDs)
  QUESTIONS_BY_IDS: (questionIds: string) =>
    `${base}/quizes/questions?questionIds=${encodeURIComponent(questionIds)}`,
};

export const VIDEO = {
  ALL_COURSES: `${base}/videoCourses`,
  COURSE: (id: string) => `${base}/videoCourses/${id}`,
  MODULES: (id: string) => `${base}/videoCourses/${id}/modules`,
  MODULE: (courseId: string, moduleId: string) => `${base}/videoCourses/${courseId}/modules/${moduleId}/section`,
  /** Fetch a single video by ID (for standalone VideoPlayer screen) */
  BY_ID: (videoId: string) => `${base}/videoCourses/video/${videoId}`,
  

  SUBSECTION_BLOCK_NOTE: (
    courseId: string,
    moduleId: string,
    sectionId: string,
    subSectionId: string,
    blockId: string
  ) =>
    `${base}/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${blockId}/note`,
  
    SUBSECTION_BLOCK_QUESTIONS: (
    courseId: string,
    moduleId: string,
    sectionId: string,
    subSectionId: string,
    blockId: string
  ) =>
    `${base}/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${blockId}/questions`,



    SUBSECTION_BLOCK_VIDEO: (
    courseId: string,
    moduleId: string,
    sectionId: string,
    subSectionId: string,
    blockId: string
  ) =>
    `${base}/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/subSectionBlock/${blockId}/video`,
};

export const NOTES = {
  BY_ID: (id: string) => `${base}/notes/${id}`,
};

export const FAVOURITES = {
  BASE: `${base}/favourites`,
};


export const STATUS = {
  // Note Status
  NOTE_STATUS: '/users/note-status',
  NOTE_STATUS_BY_ID: (noteId: string) => `/users/note-status?noteId=${noteId}`,
  
  // Video Status
  VIDEO_STATUS: '/users/video-status',
  VIDEO_STATUS_BY_ID: (videoId: string) => `/users/video-status?videoId=${videoId}`,
  
  // Question Status 
  QUESTION_STATUS: '/users/question-status',
};



export const NOTE_STATUS = {
  BY_NOTE: () =>
    `${base}/users/note-status`,

  UPDATE: `${base}/users/note-status`,
};


export const VIDEO_STATUS = {
  BY_VIDEO: (videoId: string) =>
    `${base}/users/video-status?videoId=${videoId}`,

  UPDATE: `${base}/users/video-status`,
};
