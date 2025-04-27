
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { generateUniqueId } from '@/lib/utils/fileHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { addTextOverlay } from '@/lib/redux/videoEditorSlice';

const TextOverlayEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [padding, setPadding] = useState(8);
  const [opacity, setOpacity] = useState(0.8);

  const handleAddText = () => {
    if (!text.trim()) return;

    const newTextOverlay = {
      id: generateUniqueId('text'),
      text,
      position: { x: 50, y: 50 }, // Center of the screen
      style: {
        fontFamily,
        fontSize,
        color,
        backgroundColor: backgroundColor + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        padding,
        opacity,
      }
    };

    dispatch(addTextOverlay(newTextOverlay));
    setText('');
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text</Label>
            <Input
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text overlay"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-family">Font</Label>
            <select
              id="font-family"
              className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
            </div>
            <Slider
              id="font-size"
              min={12}
              max={72}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border border-border" 
                  style={{ backgroundColor: color }}
                />
                <Input
                  id="text-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border border-border" 
                  style={{ backgroundColor: backgroundColor }}
                />
                <Input
                  id="bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</Label>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.05}
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={handleAddText} 
        disabled={!text.trim()}
        className="w-full mt-4"
      >
        Add Text Overlay
      </Button>
    </div>
  );
};

export default TextOverlayEditor;
