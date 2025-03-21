
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CheckCircle, RefreshCcw } from "lucide-react";
import { Question } from "@/lib/api";

interface AnalysisResultProps {
  analysis: string;
  questions: Question[];
  answers: { [key: number]: string };
  onRestart: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  questions,
  answers,
  onRestart,
}) => {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 animate-fade-in">
      <Card className="shadow-md border border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Analysis</h3>
                <div className="whitespace-pre-line text-muted-foreground">
                  {analysis}
                </div>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onRestart} 
            variant="outline" 
            className="w-full gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Start New Interview
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md border border-border/40">
        <CardHeader>
          <CardTitle>Your Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-6 h-6 text-primary text-xs font-semibold">
                      {q.id}
                    </span>
                    {q.text}
                  </h3>
                  <div className="bg-secondary/50 p-3 rounded-md text-sm">
                    {answers[q.id] || <span className="text-muted-foreground italic">No answer provided</span>}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;
