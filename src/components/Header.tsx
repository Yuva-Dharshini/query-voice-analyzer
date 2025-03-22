
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-background border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            CareerPrep AI
          </Link>
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
                isActive('/') ? "text-primary" : "text-foreground")}
            >
              Home
            </Link>
            <Link 
              to="/interview" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
                isActive('/interview') ? "text-primary" : "text-foreground")}
            >
              Interview Prep
            </Link>
            <Link 
              to="/quiz" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
                isActive('/quiz') ? "text-primary" : "text-foreground")}
            >
              Tech Quiz
            </Link>
            <Link 
              to="/aptitude" 
              className={cn("text-sm font-medium transition-colors hover:text-primary", 
                isActive('/aptitude') ? "text-primary" : "text-foreground")}
            >
              Aptitude Test
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
