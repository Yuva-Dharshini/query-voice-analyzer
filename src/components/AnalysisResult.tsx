
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CheckCircle, RefreshCcw } from "lucide-react";
import { Question } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        
        <Tabs defaultValue="analysis" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="responses">Your Responses</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="analysis" className="mt-0">
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="prose prose-sm max-w-none">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Interview Analysis</h3>
                    <div className="whitespace-pre-line text-muted-foreground">
                      {analysis}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="responses" className="mt-0">
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
          </TabsContent>
        </Tabs>
        
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
    </div>
  );
};

export default AnalysisResult;
