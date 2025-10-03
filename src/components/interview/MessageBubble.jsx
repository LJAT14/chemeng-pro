import React from 'react';
import { Bot, User } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
      <div className={'flex items-start space-x-3 max-w-[80%] ' + (isUser ? 'flex-row-reverse space-x-reverse' : '')}>
        <div className={'p-2 rounded-full ' + (isUser ? 'bg-purple-500' : 'bg-blue-500')}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
        <div className={'p-4 rounded-2xl ' + (isUser ? 'bg-purple-500/20' : 'bg-slate-800')}>
          <p className="text-slate-100">{message.content}</p>
          <p className="text-xs text-slate-500 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;