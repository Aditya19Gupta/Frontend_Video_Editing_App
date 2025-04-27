
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '@/lib/redux/hooks';
import { generateUniqueId } from '@/lib/utils/fileHelpers';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { addImageOverlay } from '@/lib/redux/videoEditorSlice';
import { useToast } from '@/hooks/use-toast';

const ImageOverlayEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState(0);
  const [opacity, setOpacity] = useState(1);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    const src = URL.createObjectURL(file);
    setImageSrc(src);
    
    toast({
      title: "Image loaded",
      description: "You can now add it to your video.",
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    multiple: false
  });

  const handleAddImage = () => {
    if (!imageSrc) return;
    
    const newImage = {
      id: generateUniqueId('image'),
      src: imageSrc,
      position: { x: 50, y: 50 }, // Center
      size: { width: 150, height: 150 }, // Default size
      style: {
        borderWidth,
        borderColor,
        borderRadius,
        opacity,
      }
    };
    
    dispatch(addImageOverlay(newImage));
    
    // Clear the form
    setImageSrc(undefined);
    setBorderWidth(0);
    setBorderColor('#FFFFFF');
    setBorderRadius(0);
    setOpacity(1);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
                 ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-accent/50'}`}
      >
        <input {...getInputProps()} />
        {!imageSrc ? (
          <div className="py-4">
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop the image here' : 'Drag & Drop an image or click to browse'}
            </p>
          </div>
        ) : (
          <div className="relative w-full h-24 flex items-center justify-center">
            <img 
              src={imageSrc} 
              alt="Selected overlay" 
              className="h-full object-contain"
              style={{
                borderWidth: `${borderWidth}px`,
                borderColor: borderColor,
                borderStyle: 'solid',
                borderRadius: `${borderRadius}px`,
                opacity: opacity,
              }}
            />
            <button 
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
              onClick={(e) => {
                e.stopPropagation();
                if (imageSrc) URL.revokeObjectURL(imageSrc);
                setImageSrc(undefined);
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="border-width">Border Width: {borderWidth}px</Label>
        </div>
        <Slider
          id="border-width"
          min={0}
          max={10}
          step={1}
          value={[borderWidth]}
          onValueChange={(value) => setBorderWidth(value[0])}
          disabled={!imageSrc}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="border-radius">Border Radius: {borderRadius}px</Label>
        </div>
        <Slider
          id="border-radius"
          min={0}
          max={50}
          step={1}
          value={[borderRadius]}
          onValueChange={(value) => setBorderRadius(value[0])}
          disabled={!imageSrc}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="border-color">Border Color</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-md border border-border" 
            style={{ backgroundColor: borderColor }}
          />
          <Input
            id="border-color"
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="w-full h-8"
            disabled={!imageSrc}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</Label>
        </div>
        <Slider
          id="opacity"
          min={0.1}
          max={1}
          step={0.05}
          value={[opacity]}
          onValueChange={(value) => setOpacity(value[0])}
          disabled={!imageSrc}
        />
      </div>
      
      <Button 
        onClick={handleAddImage} 
        disabled={!imageSrc}
        className="w-full"
      >
        Add Image Overlay
      </Button>
    </div>
  );
};

export default ImageOverlayEditor;
