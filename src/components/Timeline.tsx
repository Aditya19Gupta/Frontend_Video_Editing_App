
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { formatTime, generateUniqueId } from '@/lib/utils/fileHelpers';
import { 
  reorderVideoClips, 
  setCurrentTime, 
  setSelectedElement,
  VideoClip
} from '@/lib/redux/videoEditorSlice';
import { Button } from '@/components/ui/button';

const Timeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const { videoClips, currentTime, duration, selectedElementId } = useAppSelector(state => state.videoEditor);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newClips = [...videoClips];
    const [movedClip] = newClips.splice(result.source.index, 1);
    newClips.splice(result.destination.index, 0, movedClip);

    // Calculate new start times based on order
    let currentStartTime = 0;
    const updatedClips = newClips.map(clip => {
      const updatedClip = {
        ...clip,
        startTime: currentStartTime,
      };
      currentStartTime += clip.duration;
      return updatedClip;
    });

    dispatch(reorderVideoClips(updatedClips));
  };

  const handleAddClip = () => {
    // In a real app, we would add a real video clip here
    // For now, we'll just add a mock clip for demonstration
    if (videoClips.length > 0) {
      const newClipDuration = 5; // 5 seconds for demo
      const lastClip = videoClips[videoClips.length - 1];
      const newStartTime = lastClip.startTime + lastClip.duration;
      
      const newClip: VideoClip = {
        id: generateUniqueId('clip'),
        name: `Clip ${videoClips.length + 1}`,
        duration: newClipDuration,
        startTime: newStartTime,
        thumbnail: lastClip.thumbnail, // Reuse thumbnail for demo
      };
      
      // In a real implementation, we'd use addVideoClip and handle reordering
      const newClips = [...videoClips, newClip];
      dispatch(reorderVideoClips(newClips));
    }
  };

  const handleRemoveClip = (id: string) => {
    // Don't allow removing the last clip
    if (videoClips.length <= 1) return;
    
    const newClips = videoClips.filter(clip => clip.id !== id);
    
    // Recalculate start times
    let currentStartTime = 0;
    const updatedClips = newClips.map(clip => {
      const updatedClip = {
        ...clip,
        startTime: currentStartTime,
      };
      currentStartTime += clip.duration;
      return updatedClip;
    });
    
    dispatch(reorderVideoClips(updatedClips));
  };

  // Calculate the position of the playhead in percentage
  const playheadPosition = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Timeline</h3>
        <Button onClick={handleAddClip} size="sm" variant="outline" className="h-7">
          Add Clip
        </Button>
      </div>

      <div className="w-full relative">
        {/* Timestamps */}
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{formatTime(0)}</span>
          {duration > 0 && <span>{formatTime(duration)}</span>}
        </div>
        
        {/* Timeline track */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="timeline" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="timeline-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPositionPercent = (e.clientX - rect.left) / rect.width;
                  dispatch(setCurrentTime(clickPositionPercent * duration));
                }}
              >
                {videoClips.map((clip, index) => {
                  // Calculate clip width as percentage of total duration
                  const clipWidthPercent = (clip.duration / duration) * 100;
                  
                  return (
                    <Draggable key={clip.id} draggableId={clip.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`timeline-clip absolute ${selectedElementId === clip.id ? 'active' : ''}`}
                          style={{
                            ...provided.draggableProps.style,
                            left: `${(clip.startTime / duration) * 100}%`,
                            width: `${clipWidthPercent}%`,
                            minWidth: '50px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedElement({ id: clip.id, type: 'video' }));
                          }}
                        >
                          <div className="h-full p-2 flex flex-col justify-between">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium truncate">{clip.name}</span>
                              <Button
                                variant="ghost" 
                                size="icon"
                                className="h-4 w-4 opacity-50 hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveClip(clip.id);
                                }}
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="12" 
                                  height="12" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(clip.duration)}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                
                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                  style={{ left: `${playheadPosition}%` }}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      {/* Audio track */}
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium w-16">Audio</div>
        <div className="audio-waveform w-full rounded-md">
          <div className="audio-wave"></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
