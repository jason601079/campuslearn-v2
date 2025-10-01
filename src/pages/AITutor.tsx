import React, { useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    botpressWebChat: any;
  }
}

export default function AITutor() {
  useEffect(() => {
    // Load Botpress chatbot scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script1.async = true;
    
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://files.bpcontent.cloud/2025/09/30/10/20250930105052-R0WWRT0P.js';
      script2.async = true;
      document.body.appendChild(script2);
    };
    
    document.body.appendChild(script1);

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll('script[src*="botpress"]');
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
      
      // Remove the webchat widget if it exists
      const webchat = document.querySelector('#bp-web-widget-container');
      if (webchat) {
        webchat.remove();
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