import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VideoClip = {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  src?: string;
  thumbnail?: string;
};

export type AudioClip = {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  volume: number;
  muted: boolean;
  src?: string;
};

export type SubtitleItem = {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
  };
};

export type TextOverlay = {
  id: string;
  text: string;
  position: { x: number; y: number };
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    padding: number;
    opacity: number;
  };
};

export type ImageOverlay = {
  id: string;
  src?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    opacity: number;
  };
};

interface VideoEditorState {
  videoFile: File | null;
  videoSrc: string | null;
  videoThumbnail: string | null;
  duration: number;
  currentTime: number;
  videoClips: VideoClip[];
  audioClips: AudioClip[];
  subtitles: SubtitleItem[];
  textOverlays: TextOverlay[];
  imageOverlays: ImageOverlay[];
  isPlaying: boolean;
  isExporting: boolean;
  exportProgress: number;
  selectedElementId: string | null;
  selectedElementType: 'video' | 'audio' | 'subtitle' | 'text' | 'image' | null;
}

const initialState: VideoEditorState = {
  videoFile: null,
  videoSrc: null,
  videoThumbnail: null,
  duration: 0,
  currentTime: 0,
  videoClips: [],
  audioClips: [],
  subtitles: [],
  textOverlays: [],
  imageOverlays: [],
  isPlaying: false,
  isExporting: false,
  exportProgress: 0,
  selectedElementId: null,
  selectedElementType: null,
};

export const videoEditorSlice = createSlice({
  name: 'videoEditor',
  initialState,
  reducers: {
    setVideoFile: (state, action: PayloadAction<{ file: File; src: string; thumbnail: string }>) => {
      state.videoFile = action.payload.file;
      state.videoSrc = action.payload.src;
      state.videoThumbnail = action.payload.thumbnail;
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
      if (state.videoClips.length === 0 && action.payload > 0) {
        state.videoClips = [
          {
            id: 'clip-1',
            name: 'Main Video',
            duration: action.payload,
            startTime: 0,
            src: state.videoSrc || undefined,
            thumbnail: state.videoThumbnail || undefined,
          },
        ];
      }
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    togglePlayback: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    addVideoClip: (state, action: PayloadAction<VideoClip>) => {
      state.videoClips.push(action.payload);
    },
    updateVideoClip: (state, action: PayloadAction<{ id: string; updates: Partial<VideoClip> }>) => {
      const index = state.videoClips.findIndex((clip) => clip.id === action.payload.id);
      if (index !== -1) {
        state.videoClips[index] = { ...state.videoClips[index], ...action.payload.updates };
      }
    },
    removeVideoClip: (state, action: PayloadAction<string>) => {
      state.videoClips = state.videoClips.filter((clip) => clip.id !== action.payload);
    },
    reorderVideoClips: (state, action: PayloadAction<VideoClip[]>) => {
      state.videoClips = action.payload;
    },
    addAudioClip: (state, action: PayloadAction<AudioClip>) => {
      state.audioClips.push(action.payload);
    },
    updateAudioClip: (state, action: PayloadAction<{ id: string; updates: Partial<AudioClip> }>) => {
      const index = state.audioClips.findIndex((clip) => clip.id === action.payload.id);
      if (index !== -1) {
        state.audioClips[index] = { ...state.audioClips[index], ...action.payload.updates };
      }
    },
    removeAudioClip: (state, action: PayloadAction<string>) => {
      state.audioClips = state.audioClips.filter((clip) => clip.id !== action.payload);
    },
    addSubtitle: (state, action: PayloadAction<SubtitleItem>) => {
      state.subtitles.push(action.payload);
    },
    updateSubtitle: (state, action: PayloadAction<{ id: string; updates: Partial<SubtitleItem> }>) => {
      const index = state.subtitles.findIndex((subtitle) => subtitle.id === action.payload.id);
      if (index !== -1) {
        state.subtitles[index] = { ...state.subtitles[index], ...action.payload.updates };
      }
    },
    removeSubtitle: (state, action: PayloadAction<string>) => {
      state.subtitles = state.subtitles.filter((subtitle) => subtitle.id !== action.payload);
    },
    addTextOverlay: (state, action: PayloadAction<TextOverlay>) => {
      state.textOverlays.push(action.payload);
    },
    updateTextOverlay: (state, action: PayloadAction<{ id: string; updates: Partial<TextOverlay> }>) => {
      const index = state.textOverlays.findIndex((overlay) => overlay.id === action.payload.id);
      if (index !== -1) {
        state.textOverlays[index] = { ...state.textOverlays[index], ...action.payload.updates };
      }
    },
    removeTextOverlay: (state, action: PayloadAction<string>) => {
      state.textOverlays = state.textOverlays.filter((overlay) => overlay.id !== action.payload);
    },
    addImageOverlay: (state, action: PayloadAction<ImageOverlay>) => {
      state.imageOverlays.push(action.payload);
    },
    updateImageOverlay: (state, action: PayloadAction<{ id: string; updates: Partial<ImageOverlay> }>) => {
      const index = state.imageOverlays.findIndex((overlay) => overlay.id === action.payload.id);
      if (index !== -1) {
        state.imageOverlays[index] = { ...state.imageOverlays[index], ...action.payload.updates };
      }
    },
    removeImageOverlay: (state, action: PayloadAction<string>) => {
      state.imageOverlays = state.imageOverlays.filter((overlay) => overlay.id !== action.payload);
    },
    setSelectedElement: (state, action: PayloadAction<{ id: string; type: 'video' | 'audio' | 'subtitle' | 'text' | 'image' } | null>) => {
      if (action.payload === null) {
        state.selectedElementId = null;
        state.selectedElementType = null;
      } else {
        state.selectedElementId = action.payload.id;
        state.selectedElementType = action.payload.type;
      }
    },
    startExport: (state) => {
      state.isExporting = true;
      state.exportProgress = 0;
    },
    updateExportProgress: (state, action: PayloadAction<number>) => {
      state.exportProgress = action.payload;
    },
    finishExport: (state) => {
      state.isExporting = false;
      state.exportProgress = 100;
    },
    resetEditor: () => initialState,
  },
});

export const {
  setVideoFile,
  setVideoDuration,
  setCurrentTime,
  togglePlayback,
  addVideoClip,
  updateVideoClip,
  removeVideoClip,
  reorderVideoClips,
  addAudioClip,
  updateAudioClip,
  removeAudioClip,
  addSubtitle,
  updateSubtitle,
  removeSubtitle,
  addTextOverlay,
  updateTextOverlay,
  removeTextOverlay,
  addImageOverlay,
  updateImageOverlay,
  removeImageOverlay,
  setSelectedElement,
  startExport,
  updateExportProgress,
  finishExport,
  resetEditor,
} = videoEditorSlice.actions;

export default videoEditorSlice.reducer;

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};
