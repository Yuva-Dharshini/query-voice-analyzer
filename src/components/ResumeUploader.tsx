
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ResumeUploaderProps {
  onResumeExtracted: (text: string, fileName: string) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // For now, we'll simulate extracting text from a file
      // In a real app, this would call an API to process the file
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      
      // This is a simplified implementation
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string || "File content extracted successfully.";
        onResumeExtracted(result, selectedFile.name);
        toast.success('Resume uploaded successfully!');
      };
      
      if (selectedFile.type === 'text/plain') {
        reader.readAsText(selectedFile);
      } else {
        // For PDF and DOCX files, this would normally require backend processing
        // Here we're just simulating success
        reader.onload = () => {
          const content = `Simulated content extraction from ${selectedFile.name}\n\nSkills: React, TypeScript, Node.js\nExperience: 5 years software development\nEducation: B.S. Computer Science`;
          onResumeExtracted(content, selectedFile.name);
          toast.success('Resume uploaded successfully!');
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full shadow-sm border border-border/40 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
            ${selectedFile ? 'bg-secondary/50' : 'hover:bg-secondary/30'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-between bg-white/80 p-3 rounded-md border shadow-sm">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="font-medium">Drag and drop your resume here</p>
                <p className="text-sm text-muted-foreground">
                  or <span 
                    className="text-primary cursor-pointer underline" 
                    onClick={handleUploadClick}
                  >
                    browse files
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOCX, or TXT
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {selectedFile && (
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="w-full"
          >
            {isUploading ? 'Processing...' : 'Upload Resume'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResumeUploader;
