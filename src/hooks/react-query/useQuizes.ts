import { useQuery } from '@tanstack/react-query';
import { getAllQuizzes, getCustomQuizQuestions, getQuestionsByIds } from '../../api/quiz.service';
import { getQuizById , getLibraryPaperQuestions } from "../../api/quiz.service";

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: () => getAllQuizzes(),
  });
};




export const useQuizById = (id: string) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuizById(id),
    enabled: !!id,
  });
};




/**
 * Hook to get library paper questions
 */
export const useLibraryPaperQuestions = (
  quizId: string,
  paperId: string,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: ['libraryPaperQuestions', quizId, paperId],
    queryFn: () => getLibraryPaperQuestions(quizId, paperId),
    enabled: enabled && !!quizId && !!paperId,
  });
};



export const useCustomQuizQuestions = (quizId: string, topicIds: string, limit?: number) => {
  return useQuery({
    queryKey: ['customQuizQuestions', quizId, topicIds, limit],
    queryFn: () => getCustomQuizQuestions(quizId, topicIds, limit),
    enabled: !!quizId && !!topicIds,
  });
};

/**
 * Fetch full question objects by comma-separated IDs.
 * Used after customLibrary returns only question IDs in subTopics[].questions.
 */
export const useQuestionsByIds = (questionIds: string, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: ['questionsByIds', questionIds],
    queryFn: () => getQuestionsByIds(questionIds),
    enabled: enabled && !!questionIds,
  });
};