
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Mic, CheckCircle2 } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">CareerPrep AI</h1>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary">Home</Link>
            <Link to="/interview" className="text-sm font-medium text-foreground hover:text-primary">Interview Prep</Link>
            <Link to="/quiz" className="text-sm font-medium text-foreground hover:text-primary">Tech Quiz</Link>
          </nav>
        </header>

        <main>
          <section className="py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight">Ace Your Next Tech Interview</h1>
                <p className="text-xl text-muted-foreground">
                  Practice interviews with AI feedback and test your technical knowledge with our quizzes.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/interview">
                      Try Interview Practice
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/quiz">
                      Take Tech Quiz
                      <ArrowRight />
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
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
