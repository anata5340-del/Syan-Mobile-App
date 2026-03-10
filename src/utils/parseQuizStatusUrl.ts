/**
 * Parses a quiz status URL from the backend and returns params for QuizWarning / Question screens.
 * Example: /user/quiz/68fb9af77ccbc7c670b31d1b/library/customQuestions?t=1800&topics=68fb9bc17ccbc7c670b32000,68fb9bc17ccbc7c670b32002&limit=6
 */
export type ParsedQuizWarningParams = {
  type: 'video' | 'library' | 'custom';
  quizId?: string;
  quizName?: string;
  // Video
  courseId?: string;
  moduleId?: string;
  sectionId?: string;
  subSectionId?: string;
  questionIds?: string[];
  // Library
  paperId?: string;
  // Custom
  topicId?: string;
  limit?: number;
  estimatedQuestions?: number;
  // Duration in seconds (from query `t`)
  durationSeconds?: number;
};

export function parseQuizStatusUrl(
  url: string,
  quizName?: string
): ParsedQuizWarningParams | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const [pathPart, queryPart] = url.split('?');
    const segments = pathPart.replace(/^\/+/, '').split('/');
    const params = new URLSearchParams(queryPart || '');

    // Video pattern: path contains 'videoCourses' (e.g. /user/videoCourses/:courseId/modules/.../quiz?questions=...)
    const videoCoursesIndex = segments.indexOf('videoCourses');
    if (videoCoursesIndex >= 0) {
      const courseId = segments[videoCoursesIndex + 1];
      const questionsParam = params.get('questions');
      const questionIds = questionsParam ? questionsParam.split(',').filter(Boolean) : undefined;
      const tParam = params.get('t');
      const durationSeconds = tParam ? parseInt(tParam, 10) : undefined;

      return {
        type: 'video',
        quizName: quizName || 'Quiz',
        courseId: params.get('courseId') || courseId,
        moduleId: params.get('moduleId') || undefined,
        sectionId: params.get('sectionId') || undefined,
        subSectionId: params.get('subSectionId') || undefined,
        questionIds: questionIds?.length ? questionIds : undefined,
        durationSeconds: durationSeconds && !isNaN(durationSeconds) ? durationSeconds : undefined,
      };
    }

    // Quiz patterns: user/quiz/:quizId/library/customQuestions | user/quiz/:quizId/library/:paperId
    const quizIdIndex = segments.indexOf('quiz');
    const quizId = quizIdIndex >= 0 ? segments[quizIdIndex + 1] : undefined;
    if (!quizId) return null;

    const libraryIndex = segments.indexOf('library');
    const afterLibrary = libraryIndex >= 0 ? segments[libraryIndex + 1] : undefined;

    if (afterLibrary === 'customQuestions') {
      const topics = params.get('topics') || params.get('topicIds') || '';
      const limitParam = params.get('limit');
      const limit = limitParam ? parseInt(limitParam, 10) : undefined;
      const tParam = params.get('t');
      const durationSeconds = tParam ? parseInt(tParam, 10) : undefined;

      return {
        type: 'custom',
        quizId,
        quizName: quizName || 'Custom',
        topicId: topics || undefined,
        limit: limit && !isNaN(limit) ? limit : undefined,
        estimatedQuestions: limit && !isNaN(limit) ? limit : undefined,
        durationSeconds: durationSeconds && !isNaN(durationSeconds) ? durationSeconds : undefined,
      };
    }

    if (libraryIndex >= 0 && afterLibrary && afterLibrary !== 'customQuestions') {
      return {
        type: 'library',
        quizId,
        paperId: afterLibrary,
        quizName: quizName || 'Library Quiz',
      };
    }

    // Fallback: quiz path without library (treat as video-style with quizId)
    const questionsParam = params.get('questions');
    const questionIds = questionsParam ? questionsParam.split(',').filter(Boolean) : undefined;
    const tParam = params.get('t');
    const durationSeconds = tParam ? parseInt(tParam, 10) : undefined;

    return {
      type: 'video',
      quizId,
      quizName: quizName || 'Quiz',
      courseId: params.get('courseId') || undefined,
      moduleId: params.get('moduleId') || undefined,
      sectionId: params.get('sectionId') || undefined,
      subSectionId: params.get('subSectionId') || undefined,
      questionIds: questionIds?.length ? questionIds : undefined,
      durationSeconds: durationSeconds && !isNaN(durationSeconds) ? durationSeconds : undefined,
    };
  } catch {
    return null;
  }
}
