import api from './client';
import { VIDEO } from './endpoints';

export const getAllVideoCourses = async () => {
  const res = await api.get(VIDEO.ALL_COURSES);
  console.log('Fetched video courses:', res.data);
  return res.data;
};

export const getVideoCoursesModules = async (id: string) => {
  console.log("Video Courses Modules ID:", id);
  const res = await api.get(VIDEO.MODULES(id));
  console.log("Video Courses Modules Data Not here:", res.data  );
  return res.data;
};


export const getModuleSections = async (courseId: string, moduleId: string) => {
  console.log("Module Sections Course ID:", courseId);
  const res = await api.get(VIDEO.MODULE(courseId, moduleId));
  return res.data;
};




// Load the exact notes of video courses

export const getSubSectionBlockNote = async (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  blockId: string
) => {
  const res = await api.get(
    VIDEO.SUBSECTION_BLOCK_NOTE(
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      blockId
    )
  );

  return res.data;
};





// Other video-related API calls can be added here
export const getSubSectionQuizQuestions = async (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  questionIds: string
) => {
  const res = await api.get(
    `/videoCourses/${courseId}/modules/${moduleId}/section/${sectionId}/subSection/${subSectionId}/questions`,
    {
      params: { questionIds },
    }
  );

  return res.data; // { questions, sectionName }
};



/**
 * Submit user's answer for a question (for tracking)
 */
export const submitQuestionAnswer = async (
  questionId: string,
  questionName: string,
  isCorrect: boolean
) => {
  const res = await api.post('/users/question-status', {
    questionId,
    questionName,
    correct: isCorrect,
  });
  return res.data;
};



export const getSubSectionBlockVideo = async (
  courseId: string,
  moduleId: string,
  sectionId: string,
  subSectionId: string,
  blockId: string
) => {
  const res = await api.get(
    VIDEO.SUBSECTION_BLOCK_VIDEO(
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      blockId
    )
  );

  return res.data;
};

/** Fetch a single video by ID. For standalone VideoPlayer. Expects backend: GET /videoCourses/video/:videoId → { video: { _id, name, videoSource, thumbnail, ... } }. */
export const getVideoById = async (videoId: string) => {
  const res = await api.get(VIDEO.BY_ID(videoId));
  return res.data;
};
