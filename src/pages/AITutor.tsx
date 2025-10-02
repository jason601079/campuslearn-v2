import React, { useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    botpressWebChat: any;
  }
}

export default function AITutor() {
  useEffect(() => {
    // Check if scripts are already loaded
    const existingScript1 = document.querySelector('script[src*="cdn.botpress.cloud"]');
    const existingScript2 = document.querySelector('script[src*="files.bpcontent.cloud"]');
    
    if (existingScript1 && existingScript2) {
      // Scripts already loaded, just show the widget
      if (window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: 'show' });
      }
      return;
    }

    // Load Botpress chatbot scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script1.async = true;
    
    const loadScript2 = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://files.bpcontent.cloud/2025/09/30/10/20250930105052-R0WWRT0P.js';
      script2.async = true;
      
      script2.onload = () => {
        console.log('Botpress scripts loaded successfully');
        // Try to show the widget after a short delay
        setTimeout(() => {
          if (window.botpressWebChat) {
            window.botpressWebChat.sendEvent({ type: 'show' });
          }
        }, 1000);
      };
      
      script2.onerror = () => {
        console.error('Failed to load Botpress configuration script');
      };
      
      document.body.appendChild(script2);
    };
    
    script1.onload = loadScript2;
    script1.onerror = () => {
      console.error('Failed to load Botpress webchat script');
    };
    
    document.body.appendChild(script1);

    return () => {
      // Don't remove scripts on unmount to allow persistence
      // Just hide the widget
      if (window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: 'hide' });
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Tutor</h1>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          Get instant help with your studies. Click the chat icon in the bottom right to start!
        </p>
      </div>
    </div>
  );
}