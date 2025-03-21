
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
  className?: string;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  onToggleRecording,
  disabled = false,
  className,
}) => {
  return (
    <Button
      onClick={onToggleRecording}
      disabled={disabled}
      variant={isRecording ? "destructive" : "default"}
      size="icon"
      className={cn(
        "h-12 w-12 rounded-full transition-all duration-300",
        isRecording && "animate-pulse-recording",
        className
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? (
        <Square className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default RecordButton;
