import { useQuery } from '@tanstack/react-query';
import { getAllVideoCourses, getVideoCoursesModules , getModuleSections , getSubSectionBlockNote, getSubSectionQuizQuestions, getSubSectionBlockVideo, getVideoById } from '../../api/video.service';

export const useVideoCourses = () => {
  return useQuery({
    queryKey: ['videoCourses'],
    queryFn: () => getAllVideoCourses(),
  });
};


export const useVideoCourseById = (id: string) => {
  return useQuery({
    queryKey: ['videoCourse', id],
    queryFn: () => getVideoCoursesModules(id),
    enabled: !!id
  });
};



export const useModuleSections = (
  courseId: string,
  moduleId: string
) => {
  return useQuery({
    queryKey: ['moduleSections', courseId, moduleId],
    queryFn: () => getModuleSections(courseId, moduleId),
    enabled: !!courseId && !!moduleId,
  });
};




//load the Notes in the video courses
export const useSubSectionBlockNote = (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  blockId: string
) => {
  return useQuery({
    queryKey: [
      'subSectionBlockNote',
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      blockId,
    ],
    queryFn: () =>
      getSubSectionBlockNote(
        courseId,
        moduleId,
        sectionId,
        subSectionId,
        blockId
      ),
    enabled:
      !!courseId &&
      !!moduleId &&
      !!sectionId &&
      !!subSectionId &&
      !!blockId,
  });
};






export const useVideoCourseQuiz = (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  blockId: string,
  questionIds: string[]
) => {
  return useQuery({
    queryKey: [
      'videoCourseQuiz',
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      blockId,
      questionIds,
    ],
    queryFn: () =>
      getSubSectionBlockQuizQuestions(
        courseId,
        moduleId,
        sectionId,
        subSectionId,
        blockId,
        questionIds
      ),
    enabled:
      !!courseId &&
      !!moduleId &&
      !!sectionId &&
      !!subSectionId &&
      !!blockId &&
      questionIds.length > 0,
  });
};




// Load the quiz questions of a subsection (by comma-separated question IDs)
export const useSubSectionQuizQuestions = (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  questionIds: string,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: [
      'subSectionQuizQuestions',
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      questionIds,
    ],
    queryFn: () =>
      getSubSectionQuizQuestions(
        courseId,
        moduleId,
        sectionId,
        subSectionId,
        questionIds
      ),
    enabled:
      enabled &&
      !!courseId &&
      !!moduleId &&
      !!sectionId &&
      !!subSectionId &&
      !!questionIds,
  });
};




const useSubSectionBlockVideo = (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  blockId: string
) => {
  return useQuery({
    queryKey: [
      'subSectionBlockVideo',
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      blockId,
    ],
    queryFn: () =>
      getSubSectionBlockVideo(
        courseId,
        moduleId,
        sectionId,
        subSectionId,
        blockId
      ),
    enabled:
      !!courseId &&
      !!moduleId &&
      !!sectionId &&
      !!subSectionId &&
      !!blockId,
  });
}

export { getSubSectionQuizQuestions , useSubSectionBlockVideo };

/**
 * Fetch a single video by ID for the standalone VideoPlayer screen.
 */
export const useVideoById = (videoId: string, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: ['videoById', videoId],
    queryFn: () => getVideoById(videoId),
    enabled: enabled && !!videoId,
  });
};
