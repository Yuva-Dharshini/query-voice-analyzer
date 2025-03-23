const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "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";

export type Question = {
  id: number;
  text: string;
};

export async function generateQuestionsFromResume(resumeText: string): Promise<Question[]> {
  const headers = {
    "Authorization": `Bearer ${GROQ_API_KEY}`,
    "Content-Type": "application/json"
  };
  
  const data = {
    "model": "llama3-70b-8192",
    "messages": [
      {
        "role": "system", 
        "content": "You are a technical interviewer analyzing resumes to generate specific, personalized questions. Focus on the candidate's skills, experience, and potential gaps. Extract details from their resume and create questions that will help assess their capabilities for the roles they're pursuing."
      },
      {
        "role": "user",
        "content": `Based on the following resume, generate 5 specific and personalized interview questions. Don't use generic questions - they must be directly related to the candidate's experience, skills, or projects mentioned in the resume. Format your response as a JSON array with each question having an 'id' and 'text' field.\n\nRESUME:\n${resumeText}`
      }
    ],
    "temperature": 0.7,
    "max_tokens": 800
  };
  
  try {
    console.log("Sending resume for question generation:", resumeText.substring(0, 100) + "...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Raw API response:", result);
    const content = result.choices[0].message.content;
    
    // Try to parse if response is already in JSON format
    try {
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        return parsedContent.map((q, i) => ({
          id: i + 1,
          text: typeof q === 'string' ? q : q.text || `Question ${i + 1}`
        }));
      } else if (parsedContent.questions && Array.isArray(parsedContent.questions)) {
        return parsedContent.questions.map((q, i) => ({
          id: i + 1,
          text: typeof q === 'string' ? q : q.text || `Question ${i + 1}`
        }));
      }
    } catch (e) {
      console.log("Response not in JSON format, extracting questions...");
    }
    
    // Extract questions using regex pattern matching
    const extractedQuestions = extractQuestionsFromText(content);
    
    if (extractedQuestions.length > 0) {
      return extractedQuestions;
    }
    
    console.warn("Couldn't parse questions from the response, using fallback");
    return generateFallbackQuestions(resumeText);
  } catch (error) {
    console.error("Error generating questions:", error);
    return generateFallbackQuestions(resumeText);
  }
}

function extractQuestionsFromText(text: string): Question[] {
  // Try multiple patterns to extract questions
  
  // Pattern 1: Numbered questions (e.g., "1. How did you...")
  const numberedRegex = /\d+\.\s+(.*?)(?=\d+\.|$)/gs;
  const numberedMatches = Array.from(text.matchAll(numberedRegex));
  
  if (numberedMatches.length > 0) {
    return numberedMatches.map((match, index) => ({
      id: index + 1,
      text: match[1].trim()
    })).filter(q => q.text);
  }
  
  // Pattern 2: Questions with "Question X:" format
  const questionXRegex = /Question\s+\d+:?\s+(.*?)(?=Question\s+\d+|$)/gis;
  const questionXMatches = Array.from(text.matchAll(questionXRegex));
  
  if (questionXMatches.length > 0) {
    return questionXMatches.map((match, index) => ({
      id: index + 1,
      text: match[1].trim()
    })).filter(q => q.text);
  }
  
  // Pattern 3: Lines that end with question marks
  const questionMarkRegex = /^(.+\?\s*)$/gm;
  const questionMarkMatches = Array.from(text.matchAll(questionMarkRegex));
  
  if (questionMarkMatches.length > 0) {
    return questionMarkMatches.map((match, index) => ({
      id: index + 1,
      text: match[1].trim()
    })).filter(q => q.text);
  }
  
  // Pattern 4: Split by newlines and look for question-like lines
  const lines = text.split('\n').filter(line => line.trim().length > 10);
  return lines.slice(0, 5).map((line, index) => ({
    id: index + 1,
    text: line.trim().replace(/^\d+[\.\)]\s*/, '')
  }));
}

function generateFallbackQuestions(resumeText: string): Question[] {
  // Create personalized fallback questions based on resume text
  const skills = resumeText.match(/skills?:?\s*([^.]*)/i)?.[1] || "your technical skills";
  const experience = resumeText.match(/experience:?\s*([^.]*)/i)?.[1] || "your most recent experience";
  const education = resumeText.match(/education:?\s*([^.]*)/i)?.[1] || "your educational background";
  
  // Extract more specific details from resume if possible
  const techSkills = resumeText.match(/javascript|python|react|node|aws|docker|kubernetes|sql|nosql|agile|ci\/cd/gi);
  const projectDetails = resumeText.match(/led|implemented|developed|created|designed|maintained|collaborated/gi);
  
  const skillsList = techSkills ? Array.from(new Set(techSkills)).join(', ') : skills;
  
  return [
    { id: 1, text: `Could you elaborate on your experience with ${skillsList}?` },
    { id: 2, text: `Tell me more about your role in ${experience.trim()}.` },
    { id: 3, text: `Based on your resume, you've worked with various technologies. Which one do you find most interesting and why?` },
    { id: 4, text: `Can you describe a specific project where you applied the skills mentioned in your resume?` },
    { id: 5, text: `How has your education in ${education.trim()} prepared you for your career in technology?` }
  ];
}

export async function analyzeResponses(
  resumeText: string, 
  questions: Question[], 
  answers: { [key: number]: string }
): Promise<string> {
  const headers = {
    "Authorization": `Bearer ${GROQ_API_KEY}`,
    "Content-Type": "application/json"
  };
  
  // Format the Q&A for the prompt
  let qa_pairs = "";
  questions.forEach(question => {
    const answer = answers[question.id] || "No answer provided";
    qa_pairs += `Question ${question.id}: ${question.text}\nAnswer: ${answer}\n\n`;
  });
  
  const data = {
    "model": "llama3-70b-8192",
    "messages": [
      {
        "role": "system", 
        "content": "You are a helpful assistant that analyzes interview responses based on a candidate's resume."
      },
      {
        "role": "user",
        "content": `Here is a candidate's resume:\n\n${resumeText}\n\nHere are the questions asked and the candidate's responses:\n\n${qa_pairs}\n\nPlease provide a thoughtful analysis of the responses in relation to the resume. Highlight strengths, areas for improvement, and whether the answers effectively complemented the resume information.`
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1000
  };
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing responses:", error);
    return "Unable to analyze responses at this time. Please try again later.";
  }
}

export async function extractTextFromResume(file: File): Promise<string> {
  try {
    // Handle text files directly
    if (file.type === 'text/plain') {
      return await file.text();
    } 
    
    // For PDF and DOCX files in a real application
    // In this demo version, we'll extract text content as best we can
    try {
      // Attempt to read file content directly
      const fileContent = await file.text();
      
      // If we got this far and the content seems reasonable, return it
      if (fileContent && fileContent.length > 100) {
        return fileContent;
      }
      
      // Otherwise, fall back to a simpler approach
      return createSimulatedResumeContent(file);
    } catch (error) {
      console.log("Error reading file directly, using simulated content", error);
      return createSimulatedResumeContent(file);
    }
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    return "Error extracting text from the file. Please try again with a different file.";
  }
}

function createSimulatedResumeContent(file: File): string {
  // Get file name without extension for simulated name
  const fileName = file.name.split('.')[0] || "Candidate";
  
  return `
Name: ${fileName.replace(/[_-]/g, ' ')}
Contact: example@email.com | (555) 123-4567

Summary:
Experienced software developer with a passion for creating efficient, scalable solutions. Strong background in full-stack development with expertise in modern frameworks and cloud technologies.

Skills:
- JavaScript/TypeScript, React, Node.js
- Python, Django, Flask
- AWS, Docker, Kubernetes
- SQL and NoSQL databases
- Agile methodologies, CI/CD

Experience:
Senior Developer at Tech Solutions Inc. (2019-Present)
- Led the development of a microservices architecture that improved system performance by 40%
- Implemented automated testing that reduced bugs in production by 60%
- Mentored junior developers and conducted code reviews

Software Engineer at WebApps Co. (2016-2019)
- Developed and maintained client-facing applications using React
- Collaborated with design team to implement responsive UI components
- Participated in Agile sprints and contributed to product roadmap

Education:
B.S. Computer Science, Tech University (2016)
  `;
}
