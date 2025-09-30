import React, { useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function AITutor() {
  useEffect(() => {
    // Load Botpress chatbot scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/09/30/10/20250930105052-R0WWRT0P.js';
    script2.defer = true;
    document.body.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      if (document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
    };
  }, []);


  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Tutor</h1>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          Get instant help with your studies. Ask questions about any topic!
        </p>
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Click the chat widget in the bottom right to start chatting with the AI tutor.</p>
      </div>
    </div>
  );
}