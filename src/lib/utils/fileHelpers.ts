
export const generateVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoUrl = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    
    // Seek to 1 second to avoid black frame
    video.currentTime = 1;
    
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Draw the video frame on the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data URL
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      
      // Clean up resources
      URL.revokeObjectURL(videoUrl);
      
      resolve(thumbnailUrl);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video'));
    };
  });
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
