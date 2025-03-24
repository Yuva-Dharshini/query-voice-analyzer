
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromResume } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeUploaderProps {
  onResumeExtracted: (text: string, fileName: string) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionAlert, setExtractionAlert] = useState<string | null>(null);
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
    setExtractionAlert(null);
    
    // Add note about text extraction for non-plaintext files
    if (file.type !== 'text/plain') {
      setExtractionAlert('For best results, plain text (TXT) files are recommended. PDF and DOCX content extraction may be limited in this demo.');
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExtractionAlert(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const resumeText = await extractTextFromResume(selectedFile);
      
      // Verify we have enough content to work with
      if (resumeText.length < 50) {
        toast.error('Unable to extract sufficient text from the resume. Please try a different file format.');
        setIsUploading(false);
        return;
      }
      
      onResumeExtracted(resumeText, selectedFile.name);
      toast.success('Resume uploaded and analyzed successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to analyze resume. Please try again.');
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
        {extractionAlert && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {extractionAlert}
            </AlertDescription>
          </Alert>
        )}
        
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
                  Supports PDF, DOCX, or TXT (TXT recommended for best results)
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
            {isUploading ? 'Analyzing resume...' : 'Upload Resume'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResumeUploader;
