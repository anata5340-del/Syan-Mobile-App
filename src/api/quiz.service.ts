import api from './client';
import { QUIZZES } from './endpoints';

export const getAllQuizzes = async () => {
  const res = await api.get(QUIZZES.BASE);
  console.log('QUIZZES RESPONSE', res.data);
  return res;
};


export const getQuizById = (id: string) => {
  return api.get(QUIZZES.BY_ID(id));  // GET /quizes/:id
};


export const getLibraryPaperQuestions = (quizId: string, paperId: string) => {
  return api.get(QUIZZES.LIBRARY_PAPER_QUESTIONS(quizId, paperId));  // GET /quizes/:id/library/:paperId
}

export const getCustomQuizQuestions = (quizId: string, topicIds: string, limit?: number) => {
  return api.get(QUIZZES.CUSTOM_QUIZ_QUESTIONS(quizId, topicIds, limit));  // GET /quizes/:id/customLibrary?topicIds=&limit=
};

/** Fetch full question objects by comma-separated IDs. Used when customLibrary returns only question IDs. */
export const getQuestionsByIds = (questionIds: string) => {
  return api.get(QUIZZES.QUESTIONS_BY_IDS(questionIds)).then((res) => res.data);
};



