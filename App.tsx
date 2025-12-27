
import React, { useState, useRef, useEffect } from 'react';
import { Message, BotState } from './types';
import { getGeminiChat } from './services/gemini';
import { ChatBubble } from './components/ChatBubble';
import { 
  PaperAirplaneIcon, 
  SparklesIcon, 
  UserCircleIcon,
  FaceSmileIcon,
  BoltIcon
} from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Aur mere bhai! Kya bakchodi chal rahi hai? MyBhaiAi on duty hai. Bata kya scene hai? Koi pareshan kar raha hai ya bas faltu gappe marne aaya hai? 😎",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [state, setState] = useState<BotState>(BotState.IDLE);
  
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = getGeminiChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, state]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || state === BotState.THINKING) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setState(BotState.THINKING);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: input });
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "Bhai, net hag raha hai lagta hai. Phir se bol zara?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Abey saale! Server ki phat gayi lagta hai. Ek baar refresh maar, scene sorted ho jayega.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setState(BotState.IDLE);
    }
  };

  const suggestedPrompts = [
    "Kya chal raha hai bhai?",
    "Bhai thodi bakchodi karein?",
    "Life ke laude lage hue hain...",
    "Koi mast jugaad bata na!"
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-2xl mx-auto border-x border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md">
            <FaceSmileIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg tracking-tight">MyBhaiAi <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-1 uppercase">Pro Bakchod</span></h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-slate-500 font-medium">Bhai form mein hai</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          title="Clear Chat"
        >
          <UserCircleIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Chat Messages */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {state === BotState.THINKING && (
          <div className="flex justify-start mb-4 animate-pulse">
            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-xs font-medium text-slate-400">Bhai reply soch raha hai...</span>
            </div>
          </div>
        )}
      </main>

      {/* Suggested Chips */}
      {messages.length < 6 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-slate-50/50">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(prompt);
              }}
              className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-all font-medium shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <footer className="bg-white p-4 border-t border-slate-100">
        <form 
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Bhai se bakchodi kar..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm outline-none text-slate-900 font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
              <BoltIcon className="w-5 h-5 opacity-50" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || state === BotState.THINKING}
            className={`p-3 rounded-2xl transition-all shadow-lg flex items-center justify-center ${
              !input.trim() || state === BotState.THINKING
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
            } text-white`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-slate-400 uppercase tracking-widest font-bold">
          Bhai is always here to roast you ❤️
        </p>
      </footer>
    </div>
  );
};

export default App;
