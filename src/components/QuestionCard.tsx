
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RecordButton from "./RecordButton";
import AudioWaveform from "./AudioWaveform";
import { speechRecognition } from "@/lib/speechRecognition";
import { Question } from "@/lib/api";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  onPrevious: () => void;
  onNext: () => void;
  onAnswerUpdate: (questionId: number, answer: string) => void;
  isFirst: boolean;
  isLast: boolean;
  savedAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onPrevious,
  onNext,
  onAnswerUpdate,
  isFirst,
  isLast,
  savedAnswer,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState(savedAnswer || '');
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  useEffect(() => {
    // Reset recording state when question changes
    if (isRecording) {
      stopRecording();
    }
    
    // Initialize with saved answer if available
    setAnswer(savedAnswer || '');
    
    // Cleanup when component unmounts
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [question.id, savedAnswer]);
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = () => {
    const success = speechRecognition.startRecording({
      onStart: () => {
        setIsRecording(true);
        setIsTranscribing(true);
      },
      onResult: (transcript) => {
        setAnswer(transcript);
      },
      onEnd: () => {
        setIsRecording(false);
        setIsTranscribing(false);
        // Save the final transcript
        onAnswerUpdate(question.id, answer);
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
        setIsTranscribing(false);
      }
    });
    
    if (!success) {
      console.error('Failed to start recording');
    }
  };
  
  const stopRecording = () => {
    speechRecognition.stopRecording();
    setIsRecording(false);
    // Save the answer when recording stops
    onAnswerUpdate(question.id, answer);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };
  
  const handleBlur = () => {
    onAnswerUpdate(question.id, answer);
  };
  
  const handleNext = () => {
    // Save answer before proceeding
    onAnswerUpdate(question.id, answer);
    onNext();
  };
  
  const handlePrevious = () => {
    // Save answer before going back
    onAnswerUpdate(question.id, answer);
    onPrevious();
  };
  
  return (
    <Card className="w-full shadow-md animate-fade-in border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-8 h-8 text-primary font-semibold">
            {question.id}
          </span>
          <span>{question.text}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RecordButton 
                isRecording={isRecording}
                onToggleRecording={toggleRecording}
              />
              
              {isTranscribing ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="recording-indicator">
                    <span className="recording-indicator-dot"></span>
                    <span className="recording-indicator-inner"></span>
                  </span>
                  Listening...
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {isRecording ? 'Recording...' : 'Press to record your answer'}
                </span>
              )}
            </div>
            
            <AudioWaveform isRecording={isRecording} />
          </div>
          
          <Textarea
            placeholder="Type or record your answer..."
            className={cn(
              "min-h-[120px] resize-none transition-all duration-300",
              isTranscribing && "border-primary"
            )}
            value={answer}
            onChange={handleTextChange}
            onBlur={handleBlur}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirst}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isLast && !answer.trim()}
          className="gap-1"
        >
          {isLast ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
