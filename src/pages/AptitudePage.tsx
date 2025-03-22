
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AptitudeTopicCard, { AptitudeTopic } from '@/components/AptitudeTopicCard';
import AptitudeQuestion, { AptitudeQuestionData } from '@/components/AptitudeQuestion';
import AptitudeScore from '@/components/AptitudeScore';
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface SectionData {
  id: AptitudeTopic;
  title: string;
  description: string;
  questions: AptitudeQuestionData[];
}

const aptitudeSections: SectionData[] = [
  {
    id: "numerical",
    title: "Numerical Reasoning",
    description: "Test your ability to interpret numerical data and make logical decisions.",
    questions: [
      {
        id: "num1",
        question: "If 8 workers can build 4 houses in 10 days, how many days would it take 20 workers to build 5 houses?",
        options: ["5 days", "6 days", "8 days", "10 days"],
        correctAnswer: 0
      },
      {
        id: "num2",
        question: "A shirt costs $25. During a sale, the price is discounted by 20%. What is the sale price?",
        options: ["$15", "$18", "$20", "$22"],
        correctAnswer: 2
      },
      {
        id: "num3",
        question: "If a car travels 240 miles on 10 gallons of gas, how many miles can it travel on 15 gallons?",
        options: ["300 miles", "320 miles", "350 miles", "360 miles"],
        correctAnswer: 3
      },
      {
        id: "num4",
        question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ...?",
        options: ["36", "40", "42", "48"],
        correctAnswer: 2
      },
      {
        id: "num5",
        question: "If 4 pens cost $6, how much would 10 pens cost?",
        options: ["$12", "$15", "$16", "$18"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "abstract",
    title: "Abstract Reasoning",
    description: "Assess your ability to identify patterns and relationships between shapes.",
    questions: [
      {
        id: "abs1",
        question: "If the pattern continues, which shape comes next? □ △ ○ □ △ ...",
        options: ["△", "○", "□", "♢"],
        correctAnswer: 1
      },
      {
        id: "abs2",
        question: "If all Blips are Plips, and some Plips are Clips, which statement must be true?",
        options: [
          "All Clips are Blips", 
          "Some Clips are Blips", 
          "No Clips are Blips", 
          "All Blips are Clips"
        ],
        correctAnswer: 1
      },
      {
        id: "abs3",
        question: "What is the missing number? 3, 6, 12, 24, ?",
        options: ["36", "42", "48", "60"],
        correctAnswer: 2
      },
      {
        id: "abs4",
        question: "In a certain code, CHAIR is written as DIBJS. How would TABLE be written in that code?",
        options: ["UBCMF", "UBMCF", "ELBAT", "UFCBM"],
        correctAnswer: 0
      },
      {
        id: "abs5",
        question: "Which figure completes the pattern? (Imagine a 3x3 grid with different symbols, with one missing)",
        options: ["○", "△", "□", "⋆"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "verbal",
    title: "Verbal Reasoning",
    description: "Evaluate your ability to understand and analyze written information.",
    questions: [
      {
        id: "verb1",
        question: "Choose the word that is most nearly OPPOSITE to 'Benevolent':",
        options: ["Malevolent", "Generous", "Beneficial", "Charitable"],
        correctAnswer: 0
      },
      {
        id: "verb2",
        question: "Complete the analogy: Book is to Reading as Fork is to:",
        options: ["Kitchen", "Eating", "Cooking", "Food"],
        correctAnswer: 1
      },
      {
        id: "verb3",
        question: "If 'tac' means 'dog', 'pel' means 'cat', and 'bur' means 'fish', what would 'tac pel bur' mean?",
        options: ["cat dog fish", "dog cat fish", "fish dog cat", "dog fish cat"],
        correctAnswer: 1
      },
      {
        id: "verb4",
        question: "Choose the word that doesn't belong in the group:",
        options: ["Lion", "Tiger", "Elephant", "Wolf"],
        correctAnswer: 2
      },
      {
        id: "verb5",
        question: "'All lawyers are dishonest' means the same as:",
        options: [
          "No lawyers are honest", 
          "Some lawyers are honest", 
          "Some lawyers are dishonest", 
          "No dishonest people are lawyers"
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    description: "Test your ability to apply logical thinking to solve complex problems.",
    questions: [
      {
        id: "log1",
        question: "If all cats have tails, and Fluffy has a tail, then:",
        options: [
          "Fluffy is a cat", 
          "Fluffy might be a cat", 
          "Fluffy is not a cat", 
          "Not enough information"
        ],
        correctAnswer: 1
      },
      {
        id: "log2",
        question: "Five people are sitting in a row. Alice is next to Bob, who is next to Catherine. Daniel is next to Elaine, who is next to Catherine. Who is in the middle?",
        options: ["Alice", "Bob", "Catherine", "Daniel"],
        correctAnswer: 2
      },
      {
        id: "log3",
        question: "If some A are B, and some B are C, then:",
        options: [
          "Some A are C", 
          "No A are C", 
          "All A are C", 
          "Cannot be determined"
        ],
        correctAnswer: 3
      },
      {
        id: "log4",
        question: "If a red house is made of red bricks, and a blue house is made of blue bricks, what is a greenhouse made of?",
        options: ["Green bricks", "Glass", "Plants", "Wood painted green"],
        correctAnswer: 1
      },
      {
        id: "log5",
        question: "John is taller than Mary, who is taller than Paul. Who is the shortest?",
        options: ["John", "Mary", "Paul", "Cannot be determined"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "psycometric",
    title: "Psychometric Assessment",
    description: "Measure your personality traits and behavioral tendencies.",
    questions: [
      {
        id: "psy1",
        question: "When making decisions, you typically rely more on:",
        options: ["Logic and rational analysis", "Your feelings and values", "A balance of both", "It depends on the situation"],
        correctAnswer: 3
      },
      {
        id: "psy2",
        question: "In a team setting, you prefer to:",
        options: ["Take the lead", "Support others", "Contribute ideas", "Observe first, then act"],
        correctAnswer: 3
      },
      {
        id: "psy3",
        question: "When faced with a complex problem, you tend to:",
        options: [
          "Break it down into smaller parts", 
          "Look for patterns and connections", 
          "Seek input from others", 
          "Try different approaches until something works"
        ],
        correctAnswer: 3
      },
      {
        id: "psy4",
        question: "You feel most energized when:",
        options: ["Working alone", "Collaborating with others", "Learning something new", "Completing a challenging task"],
        correctAnswer: 3
      },
      {
        id: "psy5",
        question: "When you make a mistake, you usually:",
        options: [
          "Analyze what went wrong", 
          "Focus on fixing it quickly", 
          "Consider how it affects others", 
          "Learn from it and move on"
        ],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "analytical",
    title: "Analytical Reasoning",
    description: "Assess your ability to analyze situations and draw logical conclusions.",
    questions: [
      {
        id: "ana1",
        question: "Four friends live in different houses on the same street. The houses are red, blue, green, and yellow. John doesn't live in the red or blue house. Sarah lives in the house next to the blue house. Michael lives in the house next to John. Who lives in the green house?",
        options: ["John", "Sarah", "Michael", "The fourth friend"],
        correctAnswer: 0
      },
      {
        id: "ana2",
        question: "A clerk at a butcher shop is 5'10\" tall and wears size 13 sneakers. What does he weigh?",
        options: ["180 lbs", "220 lbs", "Meat", "Cannot be determined"],
        correctAnswer: 2
      },
      {
        id: "ana3",
        question: "If the first two statements are true, is the conclusion true? All roses have thorns. Some flowers are roses. Therefore, some flowers have thorns.",
        options: ["Yes", "No", "Cannot be determined", "None of the above"],
        correctAnswer: 0
      },
      {
        id: "ana4",
        question: "Three people - Adams, Brown, and Clark - each play one instrument: flute, violin, or piano (not necessarily in that order). The piano player is the tallest. Brown is not the shortest. Clark does not play the flute. Adams is shorter than Brown. Who plays the violin?",
        options: ["Adams", "Brown", "Clark", "Cannot be determined"],
        correctAnswer: 2
      },
      {
        id: "ana5",
        question: "In a certain code language, 'lop tra bix' means 'study very hard' and 'kli bix tra' means 'work hard always'. What is the code for 'hard'?",
        options: ["lop", "tra", "bix", "kli"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "communication",
    title: "Communication Skills",
    description: "Evaluate your ability to understand and convey information effectively.",
    questions: [
      {
        id: "com1",
        question: "Which of the following is most important for effective communication?",
        options: ["Speaking clearly", "Active listening", "Using complex vocabulary", "Being concise"],
        correctAnswer: 1
      },
      {
        id: "com2",
        question: "In a professional email, which tone is generally most appropriate?",
        options: ["Casual and friendly", "Formal and distant", "Clear and professional", "Brief and directive"],
        correctAnswer: 2
      },
      {
        id: "com3",
        question: "The phrase 'reading between the lines' refers to:",
        options: [
          "Speed reading", 
          "Understanding implied meaning", 
          "Taking notes while reading", 
          "Analyzing the structure of a text"
        ],
        correctAnswer: 1
      },
      {
        id: "com4",
        question: "When giving a presentation, what should you do if you don't know the answer to a question?",
        options: [
          "Make up an answer", 
          "Apologize profusely", 
          "Acknowledge you don't know and offer to find out", 
          "Redirect the question to someone else"
        ],
        correctAnswer: 2
      },
      {
        id: "com5",
        question: "Which of these is an example of non-verbal communication?",
        options: ["An email", "A phone call", "A handshake", "A written report"],
        correctAnswer: 2
      }
    ]
  }
];

enum TestState {
  INTRO,
  SECTION,
  RESULTS
}

const AptitudePage: React.FC = () => {
  const [testState, setTestState] = useState<TestState>(TestState.INTRO);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [sectionScores, setSectionScores] = useState<{[key: string]: number}>({});
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const currentSection = aptitudeSections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalSections = aptitudeSections.length;
  const totalQuestions = currentSection?.questions.length || 0;
  
  // Calculate scores for the results page
  const calculateScores = () => {
    const sectionScoresArray = aptitudeSections.map(section => {
      const score = sectionScores[section.id] || 0;
      const totalQuestions = section.questions.length;
      return {
        topic: section.title,
        correctAnswers: score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      };
    });
    
    const totalCorrect = Object.values(sectionScores).reduce((a, b) => a + b, 0);
    const totalQuestions = aptitudeSections.reduce((a, b) => a + b.questions.length, 0);
    
    const overallScore = {
      correctAnswers: totalCorrect,
      totalQuestions,
      percentage: Math.round((totalCorrect / totalQuestions) * 100)
    };
    
    return { overallScore, sectionScores: sectionScoresArray };
  };
  
  const startTest = () => {
    setTestState(TestState.SECTION);
  };
  
  const selectAnswer = (answerId: number) => {
    setSelectedAnswer(answerId);
  };
  
  const submitAnswer = () => {
    setIsQuestionSubmitted(true);
    
    // Update score if correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setSectionScores(prev => ({
        ...prev,
        [currentSection.id]: (prev[currentSection.id] || 0) + 1
      }));
    }
    
    // Auto-advance to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Complete this section
        setCompletedSections(prev => [...prev, currentSection.id]);
        
        // Move to next section or results
        if (currentSectionIndex < totalSections - 1) {
          setCurrentSectionIndex(prev => prev + 1);
        } else {
          setTestState(TestState.RESULTS);
        }
      }
      
      setSelectedAnswer(null);
      setIsQuestionSubmitted(false);
    }, 2000);
  };
  
  const restartTest = () => {
    setTestState(TestState.INTRO);
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsQuestionSubmitted(false);
    setSectionScores({});
    setCompletedSections([]);
  };
  
  const startSpecificSection = (index: number) => {
    setCurrentSectionIndex(index);
    setCurrentQuestionIndex(0);
    setTestState(TestState.SECTION);
  };
  
  // Content based on test state
  const renderContent = () => {
    switch (testState) {
      case TestState.INTRO:
        return (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Aptitude Assessment</h1>
            <p className="text-muted-foreground mb-8 text-center">
              Complete all sections to evaluate your skills across different aptitude areas. 
              Each section has 5 questions to test your abilities.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {aptitudeSections.map((section, index) => (
                <AptitudeTopicCard
                  key={section.id}
                  topic={section.id}
                  title={section.title}
                  description={section.description}
                  isCompleted={completedSections.includes(section.id)}
                  isCurrent={currentSectionIndex === index}
                  isLocked={
                    index !== 0 && 
                    index !== currentSectionIndex && 
                    !completedSections.includes(aptitudeSections[index - 1].id)
                  }
                  onClick={() => startSpecificSection(index)}
                />
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button size="lg" onClick={startTest} className="gap-2">
                Start Assessment
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case TestState.SECTION:
        return (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{currentSection.title}</h2>
              <p className="text-muted-foreground mb-4">{currentSection.description}</p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Section {currentSectionIndex + 1} of {totalSections}
                </span>
                <span className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              
              <Progress value={(currentQuestionIndex / (totalQuestions - 1)) * 100} className="h-2 mb-6" />
            </div>
            
            <AptitudeQuestion
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={selectAnswer}
              onSubmit={submitAnswer}
              isSubmitted={isQuestionSubmitted}
              isLast={currentQuestionIndex === totalQuestions - 1}
            />
          </div>
        );
        
      case TestState.RESULTS:
        const { overallScore, sectionScores: sectionScoresData } = calculateScores();
        return (
          <div className="py-8">
            <AptitudeScore
              overallScore={overallScore}
              sectionScores={sectionScoresData}
              onRestart={restartTest}
            />
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {renderContent()}
    </div>
  );
};

export default AptitudePage;
