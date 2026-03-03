/**
 * Parses a video status URL from the backend and returns params for the Videos screen.
 * Example: /user/videoCourses/68eed037c899f2abc89e6f3c/modules/dashboard/videos/6934ac91462304187777d513?m=68eed070c899f2abc89e6f97&s=68eed08ec899f2abc89e6f9c&ss=690f291cdde9beb71d5df61a&ssb=6934a75c5d01a14f14ade52c&ssbt=undefined&n=6934a71d5d01a14f14ade4a8
 */
export type ParsedVideoParams = {
  courseId: string;
  moduleId: string;
  sectionId: string;
  subSectionId: string;
  subSectionBlockId: string;
  blockName?: string;
};

export function parseVideoStatusUrl(url: string): ParsedVideoParams | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const [pathPart, queryPart] = url.split('?');
    const segments = pathPart.replace(/^\/+/, '').split('/');
    const params = new URLSearchParams(queryPart || '');

    const courseIdIndex = segments.indexOf('videoCourses');
    const courseId = courseIdIndex >= 0 ? segments[courseIdIndex + 1] : undefined;

    const videosIndex = segments.indexOf('videos');
    const blockIdFromPath = videosIndex >= 0 ? segments[videosIndex + 1] : undefined;

    const m = params.get('m');
    const s = params.get('s');
    const ss = params.get('ss');
    const ssb = params.get('ssb');

    const moduleId = m && m !== 'undefined' ? m : undefined;
    const sectionId = s && s !== 'undefined' ? s : undefined;
    const subSectionId = ss && ss !== 'undefined' ? ss : undefined;
    const subSectionBlockId = (ssb && ssb !== 'undefined' ? ssb : blockIdFromPath) ?? undefined;

    if (!courseId || !moduleId || !sectionId || !subSectionId || !subSectionBlockId) {
      return null;
    }

    return {
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      subSectionBlockId,
    };
  } catch {
    return null;
  }
}
