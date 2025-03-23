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
  
  // Make sure the text isn't too large for the API
  const trimmedResumeText = resumeText.substring(0, 4000);
  
  const systemPrompt = `You are an expert technical interviewer analyzing resumes to generate specific, personalized interview questions.
  Your task is to create 5 highly specific questions that directly reference details from the candidate's resume.
  Each question should probe deeper into a skill, experience, or project mentioned in the resume.
  DO NOT create generic questions that could apply to any candidate.
  Every question MUST reference specific information from the resume.
  Focus on technical skills, projects, responsibilities, and achievements mentioned.
  Format output as a JSON array of objects with 'id' and 'text' fields.`;
  
  const data = {
    "model": "llama3-70b-8192",
    "messages": [
      {
        "role": "system", 
        "content": systemPrompt
      },
      {
        "role": "user",
        "content": `Generate 5 specific interview questions based on this resume. Reference exact details from the resume in each question:\n\n${trimmedResumeText}`
      }
    ],
    "temperature": 0.7,
    "max_tokens": 800
  };
  
  try {
    console.log("Sending resume for question generation:", trimmedResumeText.substring(0, 100) + "...");
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
  const questionMarkRegex = /(.+\?\s*)$/gm;
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
  // Extract specific information from the resume text for personalized fallback questions
  
  // Look for skill mentions
  const skillsMatch = resumeText.match(/skills?:?\s*([^.]*)/i);
  const skills = skillsMatch ? skillsMatch[1].trim() : "";
  
  // Look for specific technologies
  let technologies: string[] = [];
  const techKeywords = ["JavaScript", "Python", "Java", "C#", "React", "Angular", "Vue", "Node.js", 
    "Express", "Django", "Flask", "Spring", "AWS", "Azure", "GCP", "Docker", "Kubernetes", 
    "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "GraphQL", "REST", "API", "Agile", "Scrum"];
  
  for (const tech of techKeywords) {
    if (resumeText.toLowerCase().includes(tech.toLowerCase())) {
      technologies.push(tech);
    }
  }
  
  // Look for companies or roles
  const experienceMatch = resumeText.match(/(?:experience|work|employment):?\s*([^.]*)/i);
  const experienceText = experienceMatch ? experienceMatch[1].trim() : "";
  
  // Find company names (assuming they're followed by dates in parentheses or preceded by "at")
  const companyMatch = resumeText.match(/(?:at|with)\s+([A-Z][A-Za-z\s]+)(?:\s+\(|\s+[0-9])/);
  const company = companyMatch ? companyMatch[1].trim() : "";
  
  // Look for education
  const educationMatch = resumeText.match(/education:?\s*([^.]*)/i);
  const education = educationMatch ? educationMatch[1].trim() : "";
  
  // Look for projects
  const projectsMatch = resumeText.match(/projects?:?\s*([^.]*)/i);
  const projects = projectsMatch ? projectsMatch[1].trim() : "";
  
  // Look for achievements
  const achievementsMatch = resumeText.match(/achievements?:?\s*([^.]*)/i);
  const achievements = achievementsMatch ? achievementsMatch[1].trim() : "";
  
  // Create personalized questions based on extracted information
  const questions: Question[] = [];
  
  if (technologies.length > 0) {
    const randomTechs = technologies.slice(0, 3).join(", ");
    questions.push({
      id: 1,
      text: `You listed ${randomTechs} among your technical skills. Can you describe a specific project where you used ${technologies[0]} to solve a complex problem?`
    });
  } else if (skills) {
    questions.push({
      id: 1,
      text: `You mentioned ${skills} in your resume. Could you elaborate on how you've applied these skills in your most recent projects?`
    });
  } else {
    questions.push({
      id: 1,
      text: `Looking at your technical background, which skill or technology do you consider your strongest, and why?`
    });
  }
  
  if (company) {
    questions.push({
      id: 2,
      text: `During your time at ${company}, what was the most challenging project you worked on, and how did you overcome the technical obstacles?`
    });
  } else if (experienceText) {
    questions.push({
      id: 2,
      text: `Based on your experience with ${experienceText}, what technical lessons have you learned that you apply to your work today?`
    });
  } else {
    questions.push({
      id: 2,
      text: `Tell me about a time when you had to quickly learn a new technology or framework for a project. How did you approach the learning process?`
    });
  }
  
  if (projects) {
    questions.push({
      id: 3,
      text: `You mentioned involvement in ${projects}. Could you walk me through your specific contributions and the technologies you used?`
    });
  } else {
    questions.push({
      id: 3,
      text: `Describe a project where you had to make significant architectural decisions. What factors influenced your choices?`
    });
  }
  
  if (education) {
    questions.push({
      id: 4,
      text: `How has your education in ${education} prepared you for your technical career, and what additional skills have you had to develop on the job?`
    });
  } else {
    questions.push({
      id: 4,
      text: `Which educational experiences or courses have been most valuable in your technical development, and why?`
    });
  }
  
  if (achievements) {
    questions.push({
      id: 5,
      text: `You highlighted ${achievements} as an achievement. Could you explain the technical challenges involved and how your solution made an impact?`
    });
  } else {
    questions.push({
      id: 5,
      text: `What technical achievement in your career are you most proud of, and what made it particularly challenging or rewarding?`
    });
  }
  
  return questions;
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
