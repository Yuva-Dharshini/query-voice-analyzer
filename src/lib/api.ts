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
        "content": "You are an expert interviewer analyzing resumes to generate highly relevant and personalized interview questions. Your task is to carefully extract specific skills, projects, experiences, and achievements from the candidate's resume. Then create questions that directly reference these details. Each question must mention specific elements from their resume - avoid generic questions completely. Focus on technical depth, problem-solving abilities, and how they've applied their skills in real projects. Generate different questions each time, even for similar resumes. Vary your questioning approach to cover different aspects of their experience."
      },
      {
        "role": "user",
        "content": `Based on the following resume, generate 5 specific and personalized interview questions. Each question MUST directly reference specific details, technologies, projects, or experiences mentioned in the resume. Format your response as a JSON array with each question having an 'id' and 'text' field.\n\nRESUME:\n${resumeText}`
      }
    ],
    "temperature": 0.8,
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
  // Extract key information from the resume
  const skills = extractSkills(resumeText);
  const technologies = extractTechnologies(resumeText);
  const companies = extractCompanies(resumeText);
  const projects = extractProjects(resumeText);
  const experiences = extractExperiences(resumeText);
  
  // Generate questions based on extracted information
  const questions: Question[] = [];
  
  if (technologies.length > 0) {
    questions.push({
      id: 1,
      text: `You mentioned experience with ${technologies.slice(0, 3).join(", ")}. Can you describe a challenging problem you solved using ${technologies[0]}?`
    });
  } else {
    questions.push({
      id: 1,
      text: "Could you describe a technically challenging project you've worked on and how you approached solving the problems you encountered?"
    });
  }
  
  if (projects.length > 0) {
    questions.push({
      id: 2,
      text: `In your resume, you mentioned ${projects[0]}. What was your specific role in this project, and what technologies did you use?`
    });
  } else if (companies.length > 0) {
    questions.push({
      id: 2,
      text: `During your time at ${companies[0]}, what was the most significant project you contributed to and what was your role?`
    });
  } else {
    questions.push({
      id: 2,
      text: "What project in your career are you most proud of and why?"
    });
  }
  
  if (skills.length > 0) {
    questions.push({
      id: 3,
      text: `Your resume highlights skills in ${skills.slice(0, 3).join(", ")}. Can you provide an example of how you've applied ${skills[0]} in a real-world scenario?`
    });
  } else {
    questions.push({
      id: 3,
      text: "What do you consider to be your strongest technical skill, and how have you applied it in your work?"
    });
  }
  
  if (experiences.length > 0) {
    questions.push({
      id: 4,
      text: `You mentioned that you ${experiences[0]}. Can you elaborate on this experience and the impact it had?`
    });
  } else {
    questions.push({
      id: 4,
      text: "Can you describe a situation where you had to learn a new technology quickly to complete a project? How did you approach this challenge?"
    });
  }
  
  questions.push({
    id: 5,
    text: "Looking at your career progression, what technical area are you most interested in developing further and why?"
  });
  
  return questions;
}

function extractSkills(resumeText: string): string[] {
  const skillsSection = resumeText.match(/skills:?\s*([^.]*)(\.|$)/i)?.[1] || "";
  const skillsList = skillsSection.split(/[,\n•-]/).map(s => s.trim()).filter(Boolean);
  
  // Add additional skills that might be mentioned throughout the resume
  const additionalSkills = [
    "leadership", "management", "communication", "problem-solving", 
    "architecture", "design", "development", "testing", "deployment"
  ].filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()));
  
  return [...new Set([...skillsList, ...additionalSkills])];
}

function extractTechnologies(resumeText: string): string[] {
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", 
    "Express", "Python", "Django", "Flask", "Java", "Spring", "C#", ".NET",
    "PHP", "Laravel", "Ruby", "Rails", "Go", "Rust", "SQL", "MySQL", 
    "PostgreSQL", "MongoDB", "NoSQL", "Redis", "AWS", "Azure", "GCP", 
    "Docker", "Kubernetes", "CI/CD", "Git", "Jenkins", "Travis", "GitHub Actions",
    "HTML", "CSS", "SASS", "LESS", "TailwindCSS", "Bootstrap", "Material UI"
  ];
  
  return techKeywords.filter(tech => 
    new RegExp(`\\b${tech.replace(/\./g, "\\.")}\\b`, "i").test(resumeText)
  );
}

function extractCompanies(resumeText: string): string[] {
  const experienceSection = resumeText.match(/experience:?\s*([\s\S]*?)(?=education:|skills:|$)/i)?.[1] || "";
  const companyLines = experienceSection.split('\n').filter(line => line.includes('at '));
  
  return companyLines.map(line => {
    const match = line.match(/at\s+([^(]*)/) || line.match(/at\s+(.*)/);
    return match ? match[1].trim() : '';
  }).filter(Boolean);
}

function extractProjects(resumeText: string): string[] {
  const projectIndicators = [
    "developed", "implemented", "created", "built", "designed", "architected", 
    "led", "managed", "maintained", "enhanced", "optimized", "deployed"
  ];
  
  // Extract lines that might describe projects
  const lines = resumeText.split('\n').filter(line => 
    projectIndicators.some(indicator => line.toLowerCase().includes(indicator.toLowerCase())) && 
    line.length > 20
  );
  
  return lines.map(line => {
    // Try to extract the project description
    const parts = line.split(' that ');
    if (parts.length > 1) {
      return parts[0].trim();
    }
    return line.trim();
  }).slice(0, 3); // Get top 3 projects at most
}

function extractExperiences(resumeText: string): string[] {
  const experienceIndicators = [
    "led", "improved", "reduced", "increased", "mentored", "collaborated",
    "conducted", "delivered", "achieved", "streamlined", "automated"
  ];
  
  // Extract sentences or bullet points that describe experiences
  const lines = resumeText.split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
    .map(line => line.trim().replace(/^[-•]\s*/, ''));
  
  const experiences = lines.filter(line => 
    experienceIndicators.some(indicator => line.toLowerCase().includes(indicator.toLowerCase())) &&
    line.length > 15
  );
  
  return experiences.slice(0, 5); // Get top 5 experiences at most
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
