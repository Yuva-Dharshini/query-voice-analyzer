
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";

interface SectionScore {
  topic: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
}

interface AptitudeScoreProps {
  overallScore: {
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  };
  sectionScores: SectionScore[];
  onRestart: () => void;
}

const AptitudeScore: React.FC<AptitudeScoreProps> = ({ 
  overallScore, 
  sectionScores,
  onRestart
}) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-amber-500";
    return "text-red-500";
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Your Aptitude Test Results</h2>
        
        <div className="mb-8 text-center">
          <div className="text-5xl font-bold mb-2">
            <span className={getScoreColor(overallScore.percentage)}>
              {overallScore.percentage}%
            </span>
          </div>
          <p className="text-muted-foreground">
            You scored {overallScore.correctAnswers} out of {overallScore.totalQuestions} questions correctly
          </p>
          <Progress 
            value={overallScore.percentage} 
            className="h-2 mt-4"
            indicatorClassName={getProgressColor(overallScore.percentage)}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Section Breakdown</h3>
          
          {sectionScores.map((section, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">{section.topic}</span>
                <span className={`font-medium ${getScoreColor(section.percentage)}`}>
                  {section.correctAnswers}/{section.totalQuestions} ({section.percentage}%)
                </span>
              </div>
              <Progress 
                value={section.percentage} 
                className="h-1.5"
                indicatorClassName={getProgressColor(section.percentage)}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onRestart} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AptitudeScore;
