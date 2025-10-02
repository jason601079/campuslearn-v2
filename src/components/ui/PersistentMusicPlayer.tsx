import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PersistentMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        <Music className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card 
      className={cn(
        "fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-300",
        isMinimized ? "w-80" : "w-[95vw] md:w-[90vw] lg:w-[1200px]"
      )}
    >
      <div className="p-3 border-b flex items-center justify-between bg-muted/50">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Study Vibes</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="p-4 flex flex-col md:flex-row gap-4 max-h-[70vh] overflow-auto">
          {/* Apple Music */}
          <iframe
            allow="autoplay *; encrypted-media *;"
            frameBorder="0"
            height="352"
            style={{
              width: "100%",
              maxWidth: "660px",
              overflow: "hidden",
              background: "transparent",
            }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/za/playlist/j/pl.u-2aoqXxaFkGdD9Wv"
          />

          {/* Spotify */}
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/7uH2lGr6eNzQvKvUeJJWaJ?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </Card>
  );
}
