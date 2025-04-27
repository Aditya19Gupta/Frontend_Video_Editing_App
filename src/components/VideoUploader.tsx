
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateVideoThumbnail } from '@/lib/utils/fileHelpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setVideoFile, setVideoDuration } from '@/lib/redux/videoEditorSlice';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const VideoUploader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { videoSrc, videoThumbnail } = useAppSelector(state => state.videoEditor);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file",
        description: "Please upload a video file.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a thumbnail from the video
      const thumbnail = await generateVideoThumbnail(file);
      const src = URL.createObjectURL(file);
      
      dispatch(setVideoFile({ file, src, thumbnail }));
      
      toast({
        title: "Video uploaded",
        description: `${file.name} has been added to your project.`,
      });
      
    } catch (error) {
      console.error("Error processing video:", error);
      toast({
        title: "Error uploading video",
        description: "Failed to process the video. Please try again.",
        variant: "destructive"
      });
    }
  }, [dispatch, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      {!videoSrc ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                     ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-accent/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <path d="m21 12-9 -9 -9 9" />
                <path d="M12 3v18" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop the video here' : 'Drag & Drop a video or click to browse'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: MP4, WebM, MOV, AVI (max 500MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {videoThumbnail && (
              <img 
                src={videoThumbnail} 
                alt="Video thumbnail" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (videoSrc) URL.revokeObjectURL(videoSrc);
                dispatch(setVideoFile({ file: null, src: null, thumbnail: null }));
                dispatch(setVideoDuration(0));
              }}
            >
              Replace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
