
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator, Layers, Type, Brain, User, Search, MessageSquare } from "lucide-react";

export type AptitudeTopic = 
  | "numerical" 
  | "abstract" 
  | "verbal" 
  | "logical" 
  | "psycometric" 
  | "analytical" 
  | "communication";

interface AptitudeTopicCardProps {
  topic: AptitudeTopic;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  completedQuestions?: number;
  totalQuestions?: number;
  onClick: () => void;
}

const TOPIC_ICONS: Record<AptitudeTopic, React.ReactNode> = {
  numerical: <Calculator className="h-6 w-6" />,
  abstract: <Layers className="h-6 w-6" />,
  verbal: <Type className="h-6 w-6" />,
  logical: <Brain className="h-6 w-6" />,
  psycometric: <User className="h-6 w-6" />,
  analytical: <Search className="h-6 w-6" />,
  communication: <MessageSquare className="h-6 w-6" />
};

const AptitudeTopicCard: React.FC<AptitudeTopicCardProps> = ({ 
  topic, 
  title, 
  description, 
  isCompleted, 
  isCurrent, 
  isLocked, 
  completedQuestions = 0,
  totalQuestions = 0,
  onClick 
}) => {
  const icon = TOPIC_ICONS[topic];
  
  return (
    <Card 
      className={`relative p-6 transition-all duration-200 cursor-pointer ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
      } ${
        isCurrent 
          ? 'bg-primary/10 border-primary shadow-md' 
          : isCompleted 
            ? 'bg-secondary/20 border-secondary' 
            : ''
      }`}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex flex-col h-full">
        <div className={`mb-4 ${isCurrent ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'}`}>
          {icon}
        </div>
        <h3 className={`font-semibold text-lg mb-2 ${isCurrent ? 'text-primary' : ''}`}>
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        {/* Show progress for sections that have started or completed */}
        {(completedQuestions > 0 || isCompleted) && (
          <div className="mt-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{completedQuestions}/{totalQuestions} questions</span>
            </div>
            <Progress 
              value={(completedQuestions / totalQuestions) * 100} 
              className="h-1"
              indicatorClassName={isCompleted ? "bg-green-500" : ""}
            />
          </div>
        )}
        
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            ✓
          </div>
        )}
        
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
            <div className="bg-background p-2 rounded-full">
              🔒
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AptitudeTopicCard;
