import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={'p-6 rounded-full transition-all ' + (isRecording ? 'bg-red-500' : 'bg-purple-500')}
        >
          {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;