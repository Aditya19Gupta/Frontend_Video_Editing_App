
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCurrentTime, togglePlayback } from '@/lib/redux/videoEditorSlice';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils/fileHelpers';

const PlaybackControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { duration, currentTime, isPlaying } = useAppSelector(state => state.videoEditor);

  const handleSliderChange = (value: number[]) => {
    dispatch(setCurrentTime(value[0]));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-4 w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(togglePlayback())}
          className="h-8 w-8"
        >
          {isPlaying ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-pause"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-play"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
          <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
        
        <div className="text-sm text-muted-foreground w-16">
          {formatTime(currentTime)}
        </div>
        
        <Slider 
          value={[currentTime]} 
          min={0} 
          max={duration || 100} 
          step={0.1}
          onValueChange={handleSliderChange} 
          className="flex-1"
        />
        
        <div className="text-sm text-muted-foreground w-16 text-right">
          {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
