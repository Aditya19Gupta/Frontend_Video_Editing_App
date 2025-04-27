
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  startExport, 
  updateExportProgress, 
  finishExport 
} from '@/lib/redux/videoEditorSlice';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const ExportPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { videoSrc, isExporting, exportProgress } = useAppSelector(state => state.videoEditor);
  const [downloadReady, setDownloadReady] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!videoSrc) return;
    
    dispatch(startExport());
    
    // Simulate export process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        dispatch(finishExport());
        setDownloadReady(true);
        
        toast({
          title: "Export complete",
          description: "Your video is ready to download.",
        });
      }
      dispatch(updateExportProgress(progress));
    }, 200);
  };
  
  const handleDownload = () => {
    // In a real app, we would provide the actual exported video file
    // For now, we'll just simulate downloading the original video
    if (!videoSrc) return;
    
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = 'exported-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your video will begin downloading shortly.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium">Export Video</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Render your project with all edits applied
        </p>
      </div>
      
      {isExporting || exportProgress > 0 ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Export Progress</span>
            <span>{Math.round(exportProgress)}%</span>
          </div>
          <Progress value={exportProgress} className="h-2" />
        </div>
      ) : null}
      
      <div className="flex gap-2">
        <Button
          onClick={handleExport}
          disabled={!videoSrc || isExporting}
          className="flex-1"
        >
          {isExporting ? 'Rendering...' : 'Render Video'}
        </Button>
        
        <Button
          onClick={handleDownload}
          disabled={!downloadReady}
          variant="outline"
          className="flex-1"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;
