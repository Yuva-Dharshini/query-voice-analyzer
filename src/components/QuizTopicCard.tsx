
import React from 'react';
import { Card } from "@/components/ui/card";
import { Book, Code, Database, FileCode, Layers, Monitor, Server, Cpu } from "lucide-react";

interface QuizTopicCardProps {
  topic: string;
  isSelected: boolean;
  onClick: () => void;
}

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  react: <Code className="h-6 w-6" />,
  javascript: <FileCode className="h-6 w-6" />,
  html: <Code className="h-6 w-6" />,
  css: <FileCode className="h-6 w-6" />,
  python: <FileCode className="h-6 w-6" />,
  java: <FileCode className="h-6 w-6" />,
  sql: <Database className="h-6 w-6" />,
  "data structures": <Layers className="h-6 w-6" />,
  "operating systems": <Monitor className="h-6 w-6" />,
  php: <FileCode className="h-6 w-6" />,
  "c++": <FileCode className="h-6 w-6" />,
  c: <Code className="h-6 w-6" />,
  "angular": <Code className="h-6 w-6" />,
  dbms: <Database className="h-6 w-6" />,
  dsa: <Layers className="h-6 w-6" />,
  "node.js": <Server className="h-6 w-6" />,
  "machine learning": <Cpu className="h-6 w-6" />,
  default: <Book className="h-6 w-6" />
};

const QuizTopicCard: React.FC<QuizTopicCardProps> = ({ topic, isSelected, onClick }) => {
  const displayName = topic.charAt(0).toUpperCase() + topic.slice(1);
  const icon = TOPIC_ICONS[topic] || TOPIC_ICONS.default;
  
  return (
    <Card 
      className={`relative h-24 cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected 
          ? 'bg-primary/10 border-primary shadow-md' 
          : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className={`mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
          {icon}
        </div>
        <h3 className={`font-medium text-sm ${isSelected ? 'text-primary font-semibold' : ''}`}>
          {displayName}
        </h3>
      </div>
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
      )}
    </Card>
  );
};

export default QuizTopicCard;
