
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  isRecording: boolean;
  className?: string;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording, className }) => {
  const [bars, setBars] = useState<number[]>(Array(20).fill(2));
  
  useEffect(() => {
    if (!isRecording) {
      setBars(Array(20).fill(2));
      return;
    }
    
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => isRecording ? Math.floor(Math.random() * 20) + 2 : 2));
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  return (
    <div className={cn("audio-wave", className)}>
      {bars.map((height, index) => (
        <div 
          key={index}
          className="audio-wave-bar"
          style={{ 
            height: `${height}px`,
            opacity: isRecording ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
