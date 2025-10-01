import React, { useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    botpressWebChat: any;
  }
}

export default function AITutor() {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Botpress chatbot scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://files.bpcontent.cloud/2025/09/30/10/20250930105052-R0WWRT0P.js';
      script2.onload = () => {
        // Initialize the chatbot in the container
        if (window.botpressWebChat && chatContainerRef.current) {
          window.botpressWebChat.init({
            hideWidget: false,
            showConversationsButton: false,
            composerPlaceholder: 'Ask me anything...',
          });
        }
      };
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);

    return () => {
      // Cleanup scripts on unmount
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      const script2 = document.querySelector('script[src="https://files.bpcontent.cloud/2025/09/30/10/20250930105052-R0WWRT0P.js"]');
      if (script2 && document.body.contains(script2)) {
        document.body.removeChild(script2);
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
          Get instant help with your studies. Ask questions about any topic!
        </p>
      </div>
      
      <div 
        ref={chatContainerRef}
        id="botpress-webchat-container" 
        className="flex-1 w-full max-w-4xl mx-auto"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}