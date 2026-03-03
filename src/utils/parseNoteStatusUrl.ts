/**
 * Parses a note status URL from the backend and returns params for the Notes screen.
 * Example: /user/videoCourses/68eed037c899f2abc89e6f3c/modules/dashboard/notes/68ec630c3e8783632a0e3b92?m=68eed070c899f2abc89e6f97&s=68eed08ec899f2abc89e6f9c&ss=68eed268c899f2abc89e6fa3&ssb=68eed29dc899f2abc89e6fae&ssbt=New%20Block&vid=...
 */
export type ParsedNoteParams = {
  courseId: string;
  moduleId: string;
  sectionId: string;
  subSectionId: string;
  subSectionBlockId: string;
  blockName?: string;
};

export function parseNoteStatusUrl(url: string): ParsedNoteParams | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const [pathPart, queryPart] = url.split('?');
    const segments = pathPart.replace(/^\/+/, '').split('/');
    const params = new URLSearchParams(queryPart || '');

    const courseIdIndex = segments.indexOf('videoCourses');
    const courseId = courseIdIndex >= 0 ? segments[courseIdIndex + 1] : undefined;

    const notesIndex = segments.indexOf('notes');
    const blockIdFromPath = notesIndex >= 0 ? segments[notesIndex + 1] : undefined;

    const m = params.get('m');
    const s = params.get('s');
    const ss = params.get('ss');
    const ssb = params.get('ssb');
    const ssbt = params.get('ssbt');

    const moduleId = m && m !== 'undefined' ? m : undefined;
    const sectionId = s && s !== 'undefined' ? s : undefined;
    const subSectionId = ss && ss !== 'undefined' ? ss : undefined;
    const subSectionBlockId = (ssb && ssb !== 'undefined' ? ssb : blockIdFromPath) ?? undefined;
    const blockName = ssbt && ssbt !== 'undefined' ? decodeURIComponent(ssbt) : undefined;

    if (!courseId || !moduleId || !sectionId || !subSectionId || !subSectionBlockId) {
      return null;
    }

    return {
      courseId,
      moduleId,
      sectionId,
      subSectionId,
      subSectionBlockId,
      blockName,
    };
  } catch {
    return null;
  }
}
