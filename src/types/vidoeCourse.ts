export interface ISubSectionBlock {
  _id: string;
  name: string;
  color: string;
  image: string;
  video: string | null;
  note: string | null;
  questions: string[];
}

export interface ISubSection {
  _id: string;
  name: string;
  color: string;
  image: string;
  topic: string;
  subSectionBlocks: ISubSectionBlock[];
}

export interface ISection {
  _id: string;
  name: string;
  color: string;
  image: string;
  topic: string;
  subSections: ISubSection[];
}

export interface IModule {
  _id: string;
  name: string;
  color: string;
  sections: ISection[];
}

export interface IVideoCourse {
  _id: string;
  name: string;
  color: string;
  image: string;
  modules: IModule[];
  isAccessible: boolean;
}

export interface IVideoCourseResponse {
  videoCourses: IVideoCourse[];
}




