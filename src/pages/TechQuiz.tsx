
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

const TechQuiz: React.FC = () => {
  // Quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What does React use to track changes in the DOM?",
      options: [
        "Shadow DOM",
        "Virtual DOM",
        "Real DOM",
        "DOM Diffing"
      ],
      correctAnswer: 1, // Index of correct option (0-based)
    },
    {
      id: 2,
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useMemo",
        "useEffect",
        "useReducer"
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "TypeScript is a superset of which language?",
      options: [
        "JavaScript",
        "Java",
        "C++",
        "Python"
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: "Which CSS property is used to create space between elements?",
      options: [
        "space",
        "margin",
        "padding",
        "gap"
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "What does REST stand for in RESTful API?",
      options: [
        "Reliable and Efficient State Transfer",
        "Representational State Transfer",
        "Reactive and Stateful Technology",
        "Request and Event State Timing"
      ],
      correctAnswer: 1,
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(quizQuestions.length).fill(-1));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleAnswerSelect = (value: string) => {
    const answerIndex = parseInt(value);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResult = () => {
    let correctCount = 0;
    const detailedAnswers = quizQuestions.map((q, index) => {
      const isCorrect = userAnswers[index] === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        question: q.question,
        userAnswer: userAnswers[index] === -1 ? "Not answered" : q.options[userAnswers[index]],
        correctAnswer: q.options[q.correctAnswer],
        isCorrect,
      };
    });

    const result: QuizResult = {
      totalQuestions: quizQuestions.length,
      correctAnswers: correctCount,
      score: Math.round((correctCount / quizQuestions.length) * 100),
      answers: detailedAnswers,
    };

    setQuizResult(result);
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(quizQuestions.length).fill(-1));
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const hasAnswered = userAnswers[currentQuestionIndex] !== -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <Link to="/" className="text-2xl font-bold">CareerPrep AI</Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary">Home</Link>
            <Link to="/interview" className="text-sm font-medium text-foreground hover:text-primary">Interview Prep</Link>
            <Link to="/quiz" className="text-sm font-medium text-foreground hover:text-primary">Tech Quiz</Link>
          </nav>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-center mb-6">Technical Skills Quiz</h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Test your knowledge of web development with these multiple-choice questions.
        </p>

        <Separator className="mb-8" />

        {!quizCompleted ? (
          <div className="max-w-2xl mx-auto">
            <div className="w-full mb-6">
              <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-2" />
            </div>

            <Card className="shadow-md border border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-8 h-8 text-primary font-semibold">
                    {currentQuestionIndex + 1}
                  </span>
                  <span>{currentQuestion.question}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup
                  value={userAnswers[currentQuestionIndex].toString()}
                  onValueChange={handleAnswerSelect}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-secondary/50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!hasAnswered}
                  className="gap-1"
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-md border border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Quiz Results
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Your Score</h3>
                      <p className="text-muted-foreground">
                        {quizResult?.correctAnswers} out of {quizResult?.totalQuestions} correct
                      </p>
                    </div>
                    <div className="text-3xl font-bold text-primary">{quizResult?.score}%</div>
                  </div>
                  <Progress value={quizResult?.score || 0} className="h-3" />
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-lg font-semibold mb-4">Question Review</h3>
                <div className="space-y-6">
                  {quizResult?.answers.map((answer, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-6 h-6 text-primary text-xs font-semibold">
                          {index + 1}
                        </span>
                        {quizQuestions[index].question}
                      </h4>
                      
                      <div className={`p-3 rounded-md text-sm ${answer.isCorrect ? 'bg-green-100/50 dark:bg-green-900/20' : 'bg-red-100/50 dark:bg-red-900/20'}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Your answer:</p>
                            <p>{answer.userAnswer}</p>
                          </div>
                          {!answer.isCorrect && (
                            <div className="text-right">
                              <p className="font-medium">Correct answer:</p>
                              <p>{answer.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button 
                  onClick={restartQuiz}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Restart Quiz
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechQuiz;
