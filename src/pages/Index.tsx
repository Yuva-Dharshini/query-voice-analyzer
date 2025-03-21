import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUploader from "@/components/ResumeUploader";
import QuestionCard from "@/components/QuestionCard";
import AnalysisResult from "@/components/AnalysisResult";
import { generateQuestionsFromResume, analyzeResponses, Question } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { FileText, Mic, BarChart3 } from "lucide-react";

enum InterviewStep {
  UPLOAD_RESUME,
  ANSWER_QUESTIONS,
  VIEW_ANALYSIS
}

const Index: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<InterviewStep>(InterviewStep.UPLOAD_RESUME);
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleResumeExtracted = async (text: string, fileName: string) => {
    setResumeText(text);
    setResumeFileName(fileName);
    setIsLoading(true);
    
    try {
      const generatedQuestions = await generateQuestionsFromResume(text);
      setQuestions(generatedQuestions);
      setCurrentStep(InterviewStep.ANSWER_QUESTIONS);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      handleSubmitInterview();
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleAnswerUpdate = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleSubmitInterview = async () => {
    setIsLoading(true);
    
    try {
      const result = await analyzeResponses(resumeText, questions, answers);
      setAnalysis(result);
      setCurrentStep(InterviewStep.VIEW_ANALYSIS);
    } catch (error) {
      console.error('Error analyzing responses:', error);
      toast.error('Failed to analyze responses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestart = () => {
    setCurrentStep(InterviewStep.UPLOAD_RESUME);
    setResumeText('');
    setResumeFileName('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnalysis('');
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case InterviewStep.UPLOAD_RESUME:
        return (
          <div className="flex flex-col items-center max-w-xl mx-auto w-full pt-8">
            <ResumeUploader onResumeExtracted={handleResumeExtracted} />
          </div>
        );
        
      case InterviewStep.ANSWER_QUESTIONS:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto w-full pt-8 space-y-6">
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
            </div>
            
            {questions.length > 0 && (
              <QuestionCard
                key={questions[currentQuestionIndex].id}
                question={questions[currentQuestionIndex]}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                onAnswerUpdate={handleAnswerUpdate}
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === questions.length - 1}
                savedAnswer={answers[questions[currentQuestionIndex].id]}
              />
            )}
          </div>
        );
        
      case InterviewStep.VIEW_ANALYSIS:
        return (
          <AnalysisResult
            analysis={analysis}
            questions={questions}
            answers={answers}
            onRestart={handleRestart}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Interview Preparation Assistant</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Practice your interview skills by answering custom questions based on your resume, with AI-powered feedback.
          </p>
        </header>
        
        <Tabs defaultValue="process" className="w-full max-w-3xl mx-auto mb-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="resume" disabled={currentStep < InterviewStep.UPLOAD_RESUME}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Resume</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="questions" disabled={currentStep < InterviewStep.ANSWER_QUESTIONS}>
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Interview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={currentStep < InterviewStep.VIEW_ANALYSIS}>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analysis</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Separator className="mb-8" />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin-slow" />
            </div>
            <p className="mt-4 text-muted-foreground">
              {currentStep === InterviewStep.UPLOAD_RESUME 
                ? 'Analyzing your resume and generating questions...'
                : 'Analyzing your responses...'}
            </p>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </div>
    </div>
  );
};

export default Index;
