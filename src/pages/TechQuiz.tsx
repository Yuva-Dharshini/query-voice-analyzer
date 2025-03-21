
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface TopicQuestions {
  [key: string]: QuizQuestion[];
}

const TechQuiz: React.FC = () => {
  // All quiz questions organized by topic
  const allQuizQuestions: TopicQuestions = {
    react: [
      {
        id: 1,
        question: "What does React use to track changes in the DOM?",
        options: [
          "Shadow DOM",
          "Virtual DOM",
          "Real DOM",
          "DOM Diffing"
        ],
        correctAnswer: 1,
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
        question: "What is the correct way to pass props to a component?",
        options: [
          "<Component props={...props} />",
          "<Component {...props} />",
          "<Component props={{...props}} />",
          "<Component {props} />"
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Which is NOT a React Hook?",
        options: [
          "useHistory",
          "useState",
          "useNavigate", 
          "useCallback"
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "What React feature allows rendering different components depending on certain conditions?",
        options: [
          "Dynamic Rendering",
          "Component Rendering",
          "Conditional Rendering",
          "Virtual Rendering"
        ],
        correctAnswer: 2,
      },
    ],
    javascript: [
      {
        id: 1,
        question: "Which of the following is not a primitive type in JavaScript?",
        options: [
          "string",
          "number",
          "array",
          "boolean"
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: "What does the '===' operator check for?",
        options: [
          "Value equality",
          "Reference equality",
          "Value and type equality",
          "None of the above"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Which method adds an element to the end of an array?",
        options: [
          "push()",
          "append()",
          "add()",
          "concat()"
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "What is closure in JavaScript?",
        options: [
          "A way to close a window",
          "A function having access to the parent scope, even after the parent function has closed",
          "A method to end JavaScript execution",
          "A data structure for storing multiple values"
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is the output of: console.log(typeof [])?",
        options: [
          "array",
          "object",
          "list",
          "undefined"
        ],
        correctAnswer: 1,
      },
    ],
    html: [
      {
        id: 1,
        question: "Which HTML tag is used to create a hyperlink?",
        options: [
          "<link>",
          "<a>",
          "<href>",
          "<url>"
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language"
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Which element is used to define an unordered list?",
        options: [
          "<ol>",
          "<li>",
          "<ul>",
          "<dl>"
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "Which HTML element defines the title of a document?",
        options: [
          "<meta>",
          "<head>",
          "<title>",
          "<header>"
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What is the correct HTML for creating a form input field for an email address?",
        options: [
          "<input type=\"text\" name=\"email\">",
          "<input type=\"email\" name=\"email\">",
          "<email type=\"input\" name=\"email\">",
          "<form input=\"email\">"
        ],
        correctAnswer: 1,
      },
    ],
    css: [
      {
        id: 1,
        question: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Creative Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets"
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which property is used to change the background color?",
        options: [
          "color",
          "bgcolor",
          "background-color",
          "background"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Which CSS property controls the text size?",
        options: [
          "text-size",
          "font-style",
          "font-size",
          "text-style"
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "Which CSS selector selects elements with a specific class?",
        options: [
          "#",
          "*",
          ".",
          ">"
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What does the 'box-sizing: border-box' do?",
        options: [
          "It includes padding and border in the element's total width and height",
          "It excludes padding and border from the element's total width and height",
          "It adds a box around the element",
          "It removes borders from elements"
        ],
        correctAnswer: 0,
      },
    ],
    python: [
      {
        id: 1,
        question: "What is the output of print(2**3)?",
        options: [
          "6",
          "8",
          "5",
          "Error"
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which of the following is NOT a core data type in Python?",
        options: [
          "Lists",
          "Dictionary",
          "Tuples",
          "Class"
        ],
        correctAnswer: 3,
      },
      {
        id: 3,
        question: "What is the correct way to create a function in Python?",
        options: [
          "create myFunction():",
          "function myFunction():",
          "def myFunction():",
          "new myFunction():"
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "Which of these collections defines a LIST in Python?",
        options: [
          "{1, 2, 3}",
          "(1, 2, 3)",
          "['a', 'b', 'c']",
          "{'a': 1, 'b': 2}"
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What will be the output of: len('hello world')?",
        options: [
          "10",
          "11",
          "12",
          "Error"
        ],
        correctAnswer: 1,
      },
    ],
    java: [
      {
        id: 1,
        question: "Which of the following is not a valid Java variable name?",
        options: [
          "myVariable",
          "_value",
          "1stPlace",
          "$price"
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: "What is the parent class of all classes in Java?",
        options: [
          "Abstract",
          "Root",
          "Object",
          "Parent"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is the access modifier with the widest scope in Java?",
        options: [
          "private",
          "protected",
          "public",
          "default"
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "Which keyword is used to define a constant in Java?",
        options: [
          "var",
          "const",
          "final",
          "static"
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "What is the interface that enables collection iteration with the for-each loop in Java?",
        options: [
          "Iterator",
          "Collection",
          "List",
          "Iterable"
        ],
        correctAnswer: 3,
      },
    ],
    sql: [
      {
        id: 1,
        question: "Which SQL statement is used to extract data from a database?",
        options: [
          "EXTRACT",
          "SELECT",
          "GET",
          "OPEN"
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which SQL keyword is used to filter results?",
        options: [
          "FILTER",
          "ORDER",
          "WHERE",
          "LIMIT"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Which statement correctly adds a new record to a table?",
        options: [
          "ADD INTO table_name VALUES (value1, value2)",
          "INSERT VALUES INTO table_name (value1, value2)",
          "INSERT INTO table_name VALUES (value1, value2)",
          "UPDATE table_name ADD (value1, value2)"
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What does 'JOIN' do in SQL?",
        options: [
          "Joins two separate databases",
          "Combines rows from two or more tables based on a related column",
          "Merges two tables permanently",
          "Adds fields to a table"
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which SQL function returns the number of rows in a result set?",
        options: [
          "SUM()",
          "NUM()",
          "COUNT()",
          "TOTAL()"
        ],
        correctAnswer: 2,
      },
    ],
    "data structures": [
      {
        id: 1,
        question: "Which data structure follows LIFO (Last In First Out) principle?",
        options: [
          "Queue",
          "Stack",
          "Linked List",
          "Tree"
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What is the time complexity of binary search on a sorted array?",
        options: [
          "O(1)",
          "O(n)",
          "O(log n)",
          "O(n log n)"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Which of the following is NOT a linear data structure?",
        options: [
          "Array",
          "Tree",
          "Stack",
          "Queue"
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What is the worst-case time complexity of insertion sort?",
        options: [
          "O(1)",
          "O(n)",
          "O(n log n)",
          "O(n²)"
        ],
        correctAnswer: 3,
      },
      {
        id: 5,
        question: "Which data structure allows efficient insertion and deletion at both ends?",
        options: [
          "Deque (Double-ended queue)",
          "Stack",
          "Array",
          "Linked List"
        ],
        correctAnswer: 0,
      },
    ],
    "operating systems": [
      {
        id: 1,
        question: "What is the main function of an operating system?",
        options: [
          "To provide a user interface",
          "To manage hardware resources",
          "To run applications",
          "To connect to the internet"
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which of the following is not an operating system?",
        options: [
          "Windows",
          "Linux",
          "Oracle",
          "macOS"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What is a deadlock in an operating system?",
        options: [
          "When a system crashes",
          "When two or more processes are unable to proceed because each is waiting for resources held by the other",
          "When CPU usage reaches 100%",
          "When a process is terminated abruptly"
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What does CPU scheduling determine?",
        options: [
          "Which programs get installed",
          "Which process gets the CPU next and for how long",
          "How much memory to allocate to a process",
          "How to organize files on disk"
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is virtual memory in an operating system?",
        options: [
          "A memory that physically doesn't exist",
          "A temporary storage that helps in running programs when RAM is insufficient",
          "A memory that only exists in the cloud",
          "The total amount of RAM installed"
        ],
        correctAnswer: 1,
      },
    ],
  };

  const [selectedTopic, setSelectedTopic] = useState<string>("react");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Reset the quiz when the topic changes
  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(allQuizQuestions[value].length).fill(-1));
    setQuizCompleted(false);
    setQuizResult(null);
  };

  // Current quiz questions based on selected topic
  const quizQuestions = allQuizQuestions[selectedTopic] || allQuizQuestions.react;

  // Initialize user answers array when component mounts or topic changes
  React.useEffect(() => {
    setUserAnswers(Array(quizQuestions.length).fill(-1));
  }, [selectedTopic, quizQuestions.length]);

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

  // Get topic options for the select component
  const topicOptions = Object.keys(allQuizQuestions).map(topic => ({
    value: topic,
    label: topic.charAt(0).toUpperCase() + topic.slice(1)
  }));

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
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6">
          Test your knowledge of web development with these multiple-choice questions.
        </p>

        <div className="max-w-md mx-auto mb-8">
          <Select value={selectedTopic} onValueChange={handleTopicChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {topicOptions.map(topic => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                  value={userAnswers[currentQuestionIndex] !== undefined ? userAnswers[currentQuestionIndex].toString() : undefined}
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
                  {selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)} Quiz Results
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
