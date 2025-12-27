
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start animate-fade-in'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base ${
          isUser
            ? 'bg-orange-500 text-white rounded-br-none'
            : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <div
          className={`text-[10px] mt-1 opacity-70 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
