
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import VideoUploader from '@/components/VideoUploader';
import VideoPlayer from '@/components/VideoPlayer';
import PlaybackControls from '@/components/PlaybackControls';
import Timeline from '@/components/Timeline';
import TextOverlayEditor from '@/components/TextOverlayEditor';
import SubtitleEditor from '@/components/SubtitleEditor';
import ImageOverlayEditor from '@/components/ImageOverlayEditor';
import AudioEditor from '@/components/AudioEditor';
import ExportPanel from '@/components/ExportPanel';

const VideoEditor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b border-border px-6 py-3 
        bg-gradient-to-r from-[#A187FD]/50 via-[#99ccff]/50 to-[#A187FD]/50 
        bg-[length:200%_200%] animate-gradient">
        <div className="flex items-center justify-between">
          <h1 id="text" className="text-2xl font-bold bg-clip-text text-white z-50">
            AdityaVideoLab
          </h1>
        </div>
      </header>


      <main className="flex-1 p-6 space-y-6 overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview Section */}
            <Card>
              <CardContent className="p-4">
                <VideoPlayer />
                <div className="mt-4">
                  <PlaybackControls />
                </div>
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <Card>
              <CardContent className="p-4">
                <Timeline />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h2 className="text-lg font-medium">Upload Video</h2>
                <VideoUploader />
              </CardContent>
            </Card>

            {/* Editing Tools */}
            <Card>
              <CardContent className="p-4">
                <Tabs defaultValue="subtitles" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                  </TabsList>

                  <TabsContent value="subtitles" className="mt-4">
                    <SubtitleEditor />
                  </TabsContent>

                  <TabsContent value="text" className="mt-4">
                    <TextOverlayEditor />
                  </TabsContent>

                  <TabsContent value="images" className="mt-4">
                    <ImageOverlayEditor />
                  </TabsContent>

                  <TabsContent value="audio" className="mt-4">
                    <AudioEditor />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Export Panel */}
            <Card>
              <CardContent className="p-4">
                <ExportPanel />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap the editor with Redux Provider
const Index = () => {
  return (
    <Provider store={store}>
      <VideoEditor />
    </Provider>
  );
};

export default Index;
