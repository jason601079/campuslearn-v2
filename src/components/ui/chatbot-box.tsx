import React, { useState } from 'react';
import { Bot, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatbotBoxProps {
  className?: string;
  resourceContent?: string;
  resourceTitle?: string;
}

export function ChatbotBox({ className, resourceContent, resourceTitle }: ChatbotBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you understand this resource. Ask me any questions about it.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('resource-chat', {
        body: {
          messages: newMessages.slice(1).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          resourceContent: resourceContent || '',
          resourceTitle: resourceTitle || 'Untitled Resource',
        },
      });

      if (error) {
        throw error;
      }

      // Handle the response
      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMessageId,
        type: 'ai',
        content: data?.response || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-14 px-6 rounded-full bg-gradient-primary shadow-elegant hover:shadow-glow transition-all duration-300 group"
        >
          <Bot className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="font-medium">AI Tutor</span>
          <span className="ml-2 text-sm opacity-80 group-hover:opacity-100">
            Have a question? Type here
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 w-96", className)}>
      <Card className="h-[500px] flex flex-col shadow-2xl border-2">
        <CardHeader className="border-b bg-gradient-primary text-white relative">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-yellow-400" />
              <span>AI Tutor</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="bg-yellow-50 border-b p-3">
            <p className="text-sm text-yellow-800 font-medium">
              Hello, how can I help you today?
            </p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.slice(1).map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={message.type === 'ai' ? 'bg-primary text-primary-foreground text-xs' : 'bg-secondary text-secondary-foreground text-xs'}>
                      {message.type === 'ai' ? <Bot className="h-3 w-3" /> : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 rounded-lg p-2 text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-muted mr-8'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about this roadmap..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-sm"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}