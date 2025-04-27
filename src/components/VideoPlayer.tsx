import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCurrentTime, setVideoDuration, togglePlayback } from '@/lib/redux/videoEditorSlice';

const VideoPlayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { videoSrc, currentTime, isPlaying, subtitles, textOverlays, imageOverlays } = useAppSelector(state => state.videoEditor);
  const playerRef = useRef<ReactPlayer>(null);

  // Keep player in sync with currentTime from store
  useEffect(() => {
    if (playerRef.current && !isPlaying) {
      playerRef.current.seekTo(currentTime, 'seconds');
    }
  }, [currentTime, isPlaying]);

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    dispatch(setCurrentTime(playedSeconds));
  };

  const handleDuration = (duration: number) => {
    dispatch(setVideoDuration(duration));
  };

  if (!videoSrc) {
    return (
      <div className="aspect-video bg-[#A187FD]/15 rounded-lg flex items-center justify-center">
        <p className="text-white z-50">Upload a video to preview</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video  rounded-lg overflow-hidden bg-[#A187FD]">
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        width="100%"
        height="100%"
        playing={isPlaying}
        controls={false}
        onProgress={handleProgress}
        onDuration={handleDuration}
        progressInterval={100}
        onPlay={() => !isPlaying && dispatch(togglePlayback())}
        onPause={() => isPlaying && dispatch(togglePlayback())}
        className="video-player"
      />

      {/* Subtitles */}
      {subtitles
        .filter(subtitle => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime)
        .map(subtitle => (
          <div
            key={subtitle.id}
            className="absolute"
            style={{
              left: `${subtitle.position.x}%`,
              top: `${subtitle.position.y}%`,
              transform: 'translate(-50%, 0)',
              fontFamily: subtitle.style.fontFamily,
              fontSize: subtitle.style.fontSize,
              color: subtitle.style.color,
              backgroundColor: subtitle.style.backgroundColor,
              padding: '4px 8px',
              borderRadius: '2px',
            }}
          >
            {subtitle.text}
          </div>
        ))}

      {/* Text Overlays */}
      {textOverlays.map(overlay => (
        <div
          key={overlay.id}
          className="absolute"
          style={{
            left: `${overlay.position.x}%`,
            top: `${overlay.position.y}%`,
            transform: 'translate(-50%, -50%)',
            fontFamily: overlay.style.fontFamily,
            fontSize: overlay.style.fontSize,
            color: overlay.style.color,
            backgroundColor: overlay.style.backgroundColor,
            padding: `${overlay.style.padding}px`,
            borderRadius: '2px',
            opacity: overlay.style.opacity,
          }}
        >
          {overlay.text}
        </div>
      ))}

      {/* Image Overlays */}
      {imageOverlays.map(overlay => (
        overlay.src && (
          <div
            key={overlay.id}
            className="absolute"
            style={{
              left: `${overlay.position.x}%`,
              top: `${overlay.position.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${overlay.size.width}px`,
              height: `${overlay.size.height}px`,
              borderWidth: `${overlay.style.borderWidth}px`,
              borderColor: overlay.style.borderColor,
              borderStyle: 'solid',
              borderRadius: `${overlay.style.borderRadius}px`,
              opacity: overlay.style.opacity,
            }}
          >
            <img
              src={overlay.src}
              alt="Overlay"
              className="w-full h-full object-contain"
            />
          </div>
        )
      ))}
    </div>
  );
};

export default VideoPlayer;
