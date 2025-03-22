
import React from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface AptitudeQuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AptitudeQuestionProps {
  question: AptitudeQuestionData;
  selectedAnswer: number | null;
  onSelectAnswer: (answerId: number) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  isLast: boolean;
}

const AptitudeQuestion: React.FC<AptitudeQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  isSubmitted,
  isLast
}) => {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        
        <RadioGroup value={selectedAnswer?.toString()} disabled={isSubmitted}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-2 py-2">
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${question.id}-${index}`} 
                onClick={() => onSelectAnswer(index)}
                className={
                  isSubmitted 
                    ? index === question.correctAnswer 
                      ? "border-green-500 text-green-500" 
                      : index === selectedAnswer 
                        ? "border-red-500 text-red-500" 
                        : "" 
                    : ""
                }
              />
              <Label 
                htmlFor={`option-${question.id}-${index}`}
                className={
                  isSubmitted 
                    ? index === question.correctAnswer 
                      ? "text-green-500" 
                      : index === selectedAnswer && index !== question.correctAnswer
                        ? "text-red-500" 
                        : "" 
                    : ""
                }
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {!isSubmitted ? (
        <Button 
          onClick={onSubmit} 
          disabled={selectedAnswer === null}
          className="w-full mt-4"
        >
          Submit Answer
        </Button>
      ) : (
        <div className="mt-4 p-4 rounded-md bg-secondary/50">
          <p className="font-medium">
            {selectedAnswer === question.correctAnswer 
              ? "✓ Correct answer!" 
              : `✗ Incorrect. The correct answer is: ${question.options[question.correctAnswer]}`}
          </p>
        </div>
      )}
    </Card>
  );
};

export default AptitudeQuestion;
