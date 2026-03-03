import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabParamList } from "./BottomTabParamList";


export type RootStackParamList = {
    DrawerNavigation: NavigatorScreenParams<BottomTabParamList>;
    openDrawer:undefined;
    Home : undefined;
    Onboarding: undefined;
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    OTP: {email : string, type : string, id : string, otpToken : string};
    ResetPassword: { type : string , id: string , email : string};
    BottomNavigation:undefined;
    QuizHistory:undefined;
    VideoHistory:undefined;
    NotesHistory:undefined;
    Profile:undefined;
    Security:undefined;
    Subscriptions:undefined;
    Invoices:undefined;
    Courses:undefined;
    Modules: { courseId: string; courseName: string };
    Lecture: { moduleId: string; moduleName: string; courseId: string; sectionId?: string };
    Videos: { courseId: string; moduleId: string; sectionId: string; subSectionId: string; subSectionBlockId: string; blockName?: string , questionIds?: string | string[] };
    VideoPlayer: { videoId?: string; videoUrl?: string; title?: string };
    ReadNotes:undefined;
    Quiz:undefined;
    Anatomy:undefined;
    QuizCourses:{ _id: string; name: string } | undefined;
    SelectQuiz: { quizId: string; quizName: string };
    Library: { quizId: string; quizName?: string; };
    Notes: { courseId: string; moduleId: string; sectionId: string; subSectionId: string; subSectionBlockId: string, questionIds?: string | string[] };
    Favorite:undefined;
    FavoriteQuiz:undefined;
    FavoriteVideos:undefined;
    FavoriteNotes:undefined;
    ChatForum:undefined;
    QuizWarning:{ courseId?: string; moduleId?: string; sectionId?: string; subSectionId?: string; questionIds?: string | string[]; duration?: number; quizName?: string; quizId?: string; paperId?: string; type?: 'video' | 'library' | 'custom'; topicId?: string; estimatedQuestions?: number; limit?: number; durationSeconds?: number };
    CreateQuiz: { quizId?: string  };
    Question: {questionIds?: string | string[]; duration: number; courseId?: string; moduleId?: string; sectionId?: string; subSectionId?: string, quizName?: string; quizId?: string; paperId?: string; type?: string; topicId?: string; limit?: number };
    QuizResult:{ summary: any; questions: any[]; submissions: any[]; quizId?: string; meta: { courseId: string; moduleId: string; sectionId: string; subSectionId: string; questionIds: string[]; duration: number } };

    QuizExplanations:{ questions: any[]; submissions: any[], meta: { courseId: string; moduleId: string; sectionId: string; subSectionId: string; questionIds: string[]; duration: number } };
    
    QuizExplanationsDetails:{  question: any; allQuestions: any; submissions: any; questionIndex: number; total: number; meta: { courseId: string; moduleId: string; sectionId: string; subSectionId: string; questionIds: string[]; duration: number } };
    LearningTabs: {
        courseId?: string;
        moduleId?: string;
        subSectionId?: string;
        subSectionName?: string;
        subSectionBlocks?: Array<any>;
        sectionId?: string;
    };
}