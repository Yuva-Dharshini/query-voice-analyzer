
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Mic, CheckCircle2, Brain, PenTool, ChevronRight } from "lucide-react";
import Header from '@/components/Header';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4">
        <main>
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Prepare For Your <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dream Career</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Practice interviews, take tech quizzes, and assess your aptitude with personalized AI feedback.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/interview">
                      Try Interview Practice
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/aptitude">
                      Take Aptitude Test
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-lg border border-border/30">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Resume Analysis</h3>
                      <p className="text-muted-foreground">Upload your resume to get personalized interview questions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mic className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Mock Interviews</h3>
                      <p className="text-muted-foreground">Practice answering questions with voice or text</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Knowledge Testing</h3>
                      <p className="text-muted-foreground">Test your technical skills with our curated quizzes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Aptitude Assessment</h3>
                      <p className="text-muted-foreground">Evaluate your numerical, logical, and verbal reasoning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-16 bg-secondary/30 -mx-4 px-4 rounded-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Complete Career Preparation</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform offers comprehensive tools to help you prepare for every aspect of the job search process.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm border border-border/30 transition-all hover:shadow-md hover:scale-105">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
                <p className="text-muted-foreground mb-4">Practice interviews with AI and get instant feedback on your responses.</p>
                <Button asChild variant="ghost" className="group">
                  <Link to="/interview">
                    Try it now
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border border-border/30 transition-all hover:shadow-md hover:scale-105">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Technical Quizzes</h3>
                <p className="text-muted-foreground mb-4">Test your knowledge on various programming languages and frameworks.</p>
                <Button asChild variant="ghost" className="group">
                  <Link to="/quiz">
                    Take a quiz
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border border-border/30 transition-all hover:shadow-md hover:scale-105">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aptitude Assessment</h3>
                <p className="text-muted-foreground mb-4">Evaluate your reasoning capabilities with our comprehensive aptitude tests.</p>
                <Button asChild variant="ghost" className="group">
                  <Link to="/aptitude">
                    Start assessment
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
