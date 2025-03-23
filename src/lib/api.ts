
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
  
  const systemPrompt = `You are an expert interviewer and career coach analyzing resumes to generate highly relevant and personalized interview questions. Your goal is to extract key skills, experiences, projects, and achievements from the resume and craft questions that probe deeper into the candidate's expertise.

Instructions:
1. Extract Information: Identify specific technical skills, projects, work experience, achievements, and education from the resume.
2. Generate Specific Questions: Create 5 highly specific questions that directly reference details from the resume. Each question MUST mention specific information from the resume.
3. Use Context Awareness: If a candidate lists a project, ask how they implemented it, challenges faced, or tools used. If they mention a technology, ask about their experience with it.
4. IMPORTANT: Do NOT generate generic questions. Each question must explicitly reference something from the resume.

Output Format: A JSON array of objects with 'id' and 'text' fields.`;
  
  const data = {
    "model": "llama3-70b-8192",
    "messages": [
      {
        "role": "system", 
        "content": systemPrompt
      },
      {
        "role": "user",
        "content": `Generate 5 specific interview questions based on this resume. Each question MUST reference exact details that appear in the resume:\n\n${trimmedResumeText}`
      }
    ],
    "temperature": 0.5,
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
  console.log("Generating fallback questions based on resume content");
  
  // Extract skills with more comprehensive search
  const skills: string[] = [];
  const skillsSection = resumeText.match(/skills?:?\s*([^]*?)(?=experience|education|projects|$)/i);
  if (skillsSection) {
    const skillText = skillsSection[1];
    // Look for bullet points or comma-separated skills
    const skillItems = skillText.split(/[-•*,\n]+/).map(s => s.trim()).filter(s => s.length > 0);
    skills.push(...skillItems.slice(0, 5)); // Take up to 5 skills
  }
  
  // Extract technologies with expanded search
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Express", 
    "Django", "Flask", "Spring", "AWS", "Azure", "GCP", "Docker", "Kubernetes", 
    "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "GraphQL", "REST", "API", 
    "CI/CD", "Git", "GitHub", "Agile", "Scrum", "Python", "Java", "C#", "C++",
    "PHP", "Ruby", "Swift", "Kotlin", "Go", "Rust", "microservices"
  ];
  
  const technologies: string[] = [];
  for (const tech of techKeywords) {
    if (resumeText.toLowerCase().includes(tech.toLowerCase())) {
      technologies.push(tech);
    }
  }
  
  // Extract companies with improved pattern matching
  const companies: string[] = [];
  const experienceSection = resumeText.match(/experience:?\s*([^]*?)(?=education|skills|projects|$)/i);
  if (experienceSection) {
    const expText = experienceSection[1];
    // Look for patterns like "Title at Company (dates)"
    const companyMatches = expText.matchAll(/(?:at|with)\s+([A-Z][A-Za-z0-9\s&.]+)(?:\s+\(|\s+[0-9])/g);
    for (const match of companyMatches) {
      companies.push(match[1].trim());
    }
    
    // Alternative pattern: lines that look like job titles followed by companies
    const lines = expText.split('\n').filter(line => line.trim().length > 0);
    for (const line of lines) {
      const titleCompanyMatch = line.match(/^([A-Za-z\s]+)\s+at\s+([A-Z][A-Za-z0-9\s&.]+)/);
      if (titleCompanyMatch) {
        companies.push(titleCompanyMatch[2].trim());
      }
    }
  }
  
  // Extract projects
  const projects: string[] = [];
  const projectsSection = resumeText.match(/projects?:?\s*([^]*?)(?=education|skills|experience|$)/i);
  if (projectsSection) {
    const projText = projectsSection[1];
    // Look for bullet points or lines that could be projects
    const projectLines = projText.split(/[-•*\n]+/).map(p => p.trim()).filter(p => p.length > 10);
    projects.push(...projectLines.slice(0, 3)); // Take up to 3 projects
  }
  
  // Extract achievements with improved search
  const achievements: string[] = [];
  // Look for metrics, percentages, or impact statements
  const achievementMatches = resumeText.matchAll(/(?:improved|increased|reduced|decreased|implemented|led|created|developed|designed|launched)\s+(?:[a-z\s]+)(?:by\s+)?([0-9]+%|[0-9]+)/gi);
  for (const match of achievementMatches) {
    const context = resumeText.substring(Math.max(0, match.index! - 50), match.index! + match[0].length + 50);
    achievements.push(context.trim());
  }
  
  // Create personalized questions based on extracted information
  const questions: Question[] = [];
  
  // 1. Technology/skill question
  if (technologies.length > 0 || skills.length > 0) {
    const tech = technologies.length > 0 ? technologies[0] : skills[0];
    questions.push({
      id: 1,
      text: `I see you have experience with ${tech}. Can you describe a specific project where you used ${tech} to solve a challenging problem?`
    });
  } else {
    questions.push({
      id: 1,
      text: `Based on your technical skills listed in your resume, which one do you consider your strongest, and how have you applied it in your work?`
    });
  }
  
  // 2. Company/role specific question
  if (companies.length > 0) {
    questions.push({
      id: 2,
      text: `During your time at ${companies[0]}, what was the most challenging project you worked on, and how did you contribute to its success?`
    });
  } else if (resumeText.includes("Senior Developer") || resumeText.includes("Lead")) {
    questions.push({
      id: 2,
      text: `In your role as a Senior Developer, how did you approach mentoring junior team members while maintaining your own responsibilities?`
    });
  } else if (resumeText.includes("Software Engineer")) {
    questions.push({
      id: 2,
      text: `As a Software Engineer, how did you collaborate with other teams to ensure the success of your projects?`
    });
  } else {
    questions.push({
      id: 2,
      text: `Based on your professional experience outlined in your resume, what would you say is the most valuable skill you've developed?`
    });
  }
  
  // 3. Achievement-focused question
  if (achievements.length > 0) {
    questions.push({
      id: 3,
      text: `Your resume mentions "${achievements[0]}". Could you elaborate on your specific contribution to this achievement and the approach you took?`
    });
  } else if (resumeText.includes("microservices")) {
    questions.push({
      id: 3,
      text: `I notice you worked with microservices architecture. What specific challenges did you face during implementation, and how did you overcome them?`
    });
  } else if (resumeText.includes("testing") || resumeText.includes("QA")) {
    questions.push({
      id: 3,
      text: `Your resume mentions automated testing. Could you describe your testing strategy and how it improved code quality in your projects?`
    });
  } else {
    questions.push({
      id: 3,
      text: `What do you consider your most significant professional achievement from the experiences listed in your resume, and why?`
    });
  }
  
  // 4. Technical depth question based on multiple skills
  if (technologies.length > 1) {
    questions.push({
      id: 4,
      text: `I see you've worked with both ${technologies[0]} and ${technologies[1]}. How do you decide which technology to use for different types of projects?`
    });
  } else if (resumeText.includes("full-stack")) {
    questions.push({
      id: 4,
      text: `As a full-stack developer, how do you balance frontend and backend responsibilities in your projects, and which area do you find more challenging?`
    });
  } else if (resumeText.includes("architecture")) {
    questions.push({
      id: 4,
      text: `Your resume mentions architectural work. Could you walk me through your approach to designing system architecture for a complex application?`
    });
  } else {
    questions.push({
      id: 4,
      text: `Based on the technical skills in your resume, how do you keep your knowledge up-to-date in this rapidly changing industry?`
    });
  }
  
  // 5. Project or education specific question
  if (projects.length > 0) {
    questions.push({
      id: 5,
      text: `Regarding the ${projects[0].includes(':') ? projects[0].split(':')[0] : 'project'} mentioned in your resume, what were the key technical decisions you made, and what would you do differently now?`
    });
  } else if (resumeText.includes("Computer Science")) {
    questions.push({
      id: 5,
      text: `How has your Computer Science degree prepared you for the practical challenges you've faced in your professional work?`
    });
  } else if (resumeText.includes("code reviews")) {
    questions.push({
      id: 5,
      text: `Your resume mentions conducting code reviews. What specific aspects do you focus on when reviewing code, and how do you deliver constructive feedback?`
    });
  } else {
    questions.push({
      id: 5,
      text: `Looking at your career trajectory as shown in your resume, where do you see your technical focus evolving in the next few years?`
    });
  }
  
  console.log("Generated fallback questions based on resume content:", questions);
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
