
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { generateUniqueId } from '@/lib/utils/fileHelpers';
import { addAudioClip, updateAudioClip } from '@/lib/redux/videoEditorSlice';
import { useToast } from '@/hooks/use-toast';

const AudioEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { audioClips, duration } = useAppSelector(state => state.videoEditor);
  const { toast } = useToast();
  
  const handleAddBackgroundMusic = () => {
    // In a real app, we would let the user upload audio
    // For now, we'll just add a mock audio clip
    const newAudioClip = {
      id: generateUniqueId('audio'),
      name: 'Background Music',
      duration: duration || 30,
      startTime: 0,
      volume: 0.7,
      muted: false,
    };
    
    dispatch(addAudioClip(newAudioClip));
    
    toast({
      title: "Background music added",
      description: "You can adjust volume in the audio controls.",
    });
  };
  
  const handleVolumeChange = (id: string, volume: number) => {
    dispatch(updateAudioClip({ id, updates: { volume } }));
  };
  
  const handleToggleMute = (id: string, muted: boolean) => {
    dispatch(updateAudioClip({ id, updates: { muted } }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Audio Tracks</h3>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleAddBackgroundMusic}
          className="text-xs h-7"
        >
          Add Background Music
        </Button>
      </div>
      
      {audioClips.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No audio tracks added yet
        </div>
      ) : (
        <div className="space-y-3">
          {audioClips.map(clip => (
            <div key={clip.id} className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleMute(clip.id, !clip.muted)}
                className="h-7 w-7"
              >
                {clip.muted ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-volume-x"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" x2="17" y1="9" y2="15" />
                    <line x1="17" x2="23" y1="9" y2="15" />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-volume-2"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs truncate">{clip.name}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(clip.volume * 100)}%</span>
                </div>
                
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  value={[clip.volume]}
                  onValueChange={(value) => handleVolumeChange(clip.id, value[0])}
                  className="mt-1"
                  disabled={clip.muted}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioEditor;
