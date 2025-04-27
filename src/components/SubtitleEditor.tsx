
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { generateUniqueId } from '@/lib/utils/fileHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { addSubtitle } from '@/lib/redux/videoEditorSlice';

const SubtitleEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentTime, duration } = useAppSelector(state => state.videoEditor);
  
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState(currentTime);
  const [endTime, setEndTime] = useState(Math.min(currentTime + 3, duration));
  const [position, setPosition] = useState({ x: 50, y: 90 }); // Bottom center by default
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#000000');

  const handleAddSubtitle = () => {
    if (!text.trim()) return;

    const newSubtitle = {
      id: generateUniqueId('subtitle'),
      text,
      startTime,
      endTime,
      position,
      style: {
        fontFamily,
        fontSize,
        color,
        backgroundColor: backgroundColor + '80', // 50% opacity
      }
    };

    dispatch(addSubtitle(newSubtitle));
    setText('');
    setStartTime(currentTime);
    setEndTime(Math.min(currentTime + 3, duration));
  };

  // Helper function to format time as MM:SS.ms
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subtitle-text">Subtitle Text</Label>
        <Input
          id="subtitle-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter subtitle text"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time: {formatTime(startTime)}</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStartTime(currentTime)}
              className="text-xs h-7"
            >
              Current
            </Button>
            <Slider
              min={0}
              max={duration}
              step={0.1}
              value={[startTime]}
              onValueChange={(value) => {
                const newStart = value[0];
                setStartTime(newStart);
                if (newStart >= endTime) {
                  setEndTime(Math.min(newStart + 1, duration));
                }
              }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>End Time: {formatTime(endTime)}</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEndTime(Math.min(currentTime + 3, duration))}
              className="text-xs h-7 whitespace-nowrap"
            >
              +3s
            </Button>
            <Slider
              min={0}
              max={duration}
              step={0.1}
              value={[endTime]}
              onValueChange={(value) => {
                const newEnd = value[0];
                setEndTime(newEnd);
                if (newEnd <= startTime) {
                  setStartTime(Math.max(newEnd - 1, 0));
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={position.y === 10 && position.x === 50 ? "default" : "outline"}
            size="sm"
            onClick={() => setPosition({ x: 50, y: 10 })}
            className="h-8"
          >
            Top
          </Button>
          <Button
            variant={position.y === 50 && position.x === 50 ? "default" : "outline"}
            size="sm"
            onClick={() => setPosition({ x: 50, y: 50 })}
            className="h-8"
          >
            Middle
          </Button>
          <Button
            variant={position.y === 90 && position.x === 50 ? "default" : "outline"}
            size="sm"
            onClick={() => setPosition({ x: 50, y: 90 })}
            className="h-8"
          >
            Bottom
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={handleAddSubtitle} 
        disabled={!text.trim()}
        className="w-full"
      >
        Add Subtitle
      </Button>
    </div>
  );
};

export default SubtitleEditor;
