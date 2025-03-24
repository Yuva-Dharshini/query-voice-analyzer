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
        "content": `You are an expert technical interviewer analyzing resumes to generate highly specific, personalized questions.
        
IMPORTANT: Your questions must ONLY reference information explicitly found in the candidate's resume.
DO NOT make assumptions or create questions about skills/experience not mentioned.
DO NOT use generic questions that could apply to any candidate.

For each resume section (skills, experience, projects, education), create questions that directly reference specific details.
Examples:
- If they mention "microservices architecture", ask about specific implementation details or challenges.
- If they list "React", ask about specific React projects or complex components they built.
- If they note performance improvements (e.g., "improved system performance by 40%"), ask specifically how they measured and achieved this.

Every question must contain specific details from the resume to ensure relevance.`
      },
      {
        "role": "user",
        "content": `Here is the candidate's resume text. Generate 5 highly specific interview questions that ONLY reference information explicitly mentioned in this resume. Each question must directly refer to specific skills, experiences, projects or achievements listed.

RESUME:
${resumeText}

Format your response as a JSON array of objects with 'id' and 'text' fields.`
      }
    ],
    "temperature": 0.5,
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
    
    console.warn("Couldn't parse questions from the response, using resume-based questions");
    return generateResumeBasedQuestions(resumeText);
  } catch (error) {
    console.error("Error generating questions:", error);
    return generateResumeBasedQuestions(resumeText);
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

function generateResumeBasedQuestions(resumeText: string): Question[] {
  // Extract key elements from resume
  const skills = extractSkills(resumeText);
  const experiences = extractExperiences(resumeText);
  const projects = extractProjects(resumeText);
  const achievements = extractAchievements(resumeText);
  
  const questions: Question[] = [];
  
  // Generate skill-based questions
  if (skills.length > 0) {
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    questions.push({
      id: questions.length + 1,
      text: `You mentioned ${randomSkill} in your skills. Could you describe a specific project where you applied ${randomSkill} and what challenges you faced?`
    });
  }
  
  // Generate experience-based questions
  if (experiences.length > 0) {
    const randomExp = experiences[Math.floor(Math.random() * experiences.length)];
    questions.push({
      id: questions.length + 1,
      text: `Regarding your role at ${randomExp.company}, could you elaborate on how you ${randomExp.description}?`
    });
  }
  
  // Generate project-based questions
  if (projects.length > 0) {
    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    questions.push({
      id: questions.length + 1,
      text: `For the project where you ${randomProject}, what was your specific contribution and how did you measure its success?`
    });
  }
  
  // Generate achievement-based questions
  if (achievements.length > 0) {
    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    questions.push({
      id: questions.length + 1,
      text: `You mentioned that you ${randomAchievement}. Could you walk me through the process and methodology you used to achieve this result?`
    });
  }
  
  // Fill remaining questions with more specific content from the resume
  while (questions.length < 5) {
    const remainingCount = 5 - questions.length;
    
    // Add additional skill questions if needed
    if (skills.length > 1 && remainingCount > 0) {
      const unusedSkills = skills.filter(skill => 
        !questions.some(q => q.text.includes(skill))
      );
      
      if (unusedSkills.length > 0) {
        const skill = unusedSkills[Math.floor(Math.random() * unusedSkills.length)];
        questions.push({
          id: questions.length + 1,
          text: `How have you kept your knowledge of ${skill} current, and what recent developments in this area have you incorporated into your work?`
        });
      }
    }
    
    // Add additional experience questions if needed
    if (experiences.length > 1 && questions.length < 5) {
      const unusedExperiences = experiences.filter(exp => 
        !questions.some(q => q.text.includes(exp.company))
      );
      
      if (unusedExperiences.length > 0) {
        const exp = unusedExperiences[Math.floor(Math.random() * unusedExperiences.length)];
        questions.push({
          id: questions.length + 1,
          text: `In your position at ${exp.company}, what was the most challenging aspect of ${exp.description} and how did you overcome it?`
        });
      }
    }
    
    // If we still need questions, add generic but resume-content-based questions
    if (questions.length < 5) {
      const companyNames = extractCompanyNames(resumeText);
      const technologies = extractTechnologies(resumeText);
      
      if (companyNames.length > 0 && !questions.some(q => q.text.includes("transition"))) {
        const company = companyNames[Math.floor(Math.random() * companyNames.length)];
        questions.push({
          id: questions.length + 1,
          text: `What prompted your transition to ${company}, and how did your previous experience prepare you for this role?`
        });
      } else if (technologies.length > 0) {
        const tech = technologies[Math.floor(Math.random() * technologies.length)];
        questions.push({
          id: questions.length + 1,
          text: `You've worked with ${tech}. What specific aspects of ${tech} do you find most valuable, and where do you see room for improvement in this technology?`
        });
      } else {
        // Very last resort - extract any noun phrases from resume
        const nounPhrases = extractNounPhrases(resumeText);
        if (nounPhrases.length > 0) {
          const phrase = nounPhrases[Math.floor(Math.random() * nounPhrases.length)];
          questions.push({
            id: questions.length + 1,
            text: `Could you tell me more about your experience with ${phrase} mentioned in your resume?`
          });
        }
      }
    }
    
    // Break the loop if we can't add more questions to avoid infinite loop
    if (questions.length < 5 && remainingCount === 5 - questions.length) {
      break;
    }
  }
  
  // If we still don't have 5 questions, add very specific resume-text based questions
  while (questions.length < 5) {
    const lines = resumeText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 15 && !line.startsWith('Name:') && !line.startsWith('Contact:'));
      
    if (lines.length > 0) {
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const words = randomLine.split(' ')
        .filter(word => word.length > 3)
        .filter(word => !['with', 'and', 'the', 'that', 'this', 'from', 'have'].includes(word.toLowerCase()));
      
      if (words.length > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        questions.push({
          id: questions.length + 1,
          text: `Your resume mentions "${randomWord}". Could you elaborate on your experience with this?`
        });
      } else {
        // Absolute last resort
        questions.push({
          id: questions.length + 1, 
          text: `Based on your resume, could you elaborate more on "${randomLine.substring(0, 30)}..."?`
        });
      }
    } else {
      break;
    }
  }
  
  return questions;
}

function extractSkills(text: string): string[] {
  // Extract skills section
  const skillsSection = text.match(/skills:?\s*([^]*?)(?=experience:|education:|$)/i)?.[1] || "";
  
  // Extract individual skills from bullet points or commas
  const skillList = skillsSection
    .split(/[-•*,\/\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && !s.match(/^(and|or|with|the|a|an)$/i));
  
  // Also look for technologies mentioned throughout the resume
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Express", 
    "Python", "Django", "Flask", "Java", "Spring", "C#", ".NET", "PHP", "Laravel",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "NoSQL", "Redis", "GraphQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git",
    "TensorFlow", "PyTorch", "Machine Learning", "AI", "Data Science",
    "REST API", "Microservices", "Agile", "Scrum", "DevOps", "Test-Driven Development"
  ];
  
  const additionalSkills = techKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase()) && 
    !skillList.some(s => s.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  return [...new Set([...skillList, ...additionalSkills])].filter(s => s.length > 0);
}

function extractExperiences(text: string): Array<{company: string, description: string}> {
  const experienceSection = text.match(/experience:?\s*([^]*?)(?=education:|skills:|$)/i)?.[1] || "";
  
  // Match company lines (assuming format like "Position at Company (dates)")
  const companyLines = experienceSection.match(/^[^\n-•*].*\([^)]*\)/gim) || [];
  
  const experiences: Array<{company: string, description: string}> = [];
  
  companyLines.forEach(line => {
    const company = line.match(/at\s+([^(]*)/i)?.[1]?.trim() || "";
    
    // Find bullet points associated with this company
    const startIndex = experienceSection.indexOf(line) + line.length;
    const nextCompanyIndex = companyLines.find(l => experienceSection.indexOf(l) > startIndex) 
      ? experienceSection.indexOf(companyLines.find(l => experienceSection.indexOf(l) > startIndex) || "")
      : experienceSection.length;
    
    const companyContent = experienceSection.substring(startIndex, nextCompanyIndex);
    
    // Extract bullet points
    const bulletPoints = companyContent.match(/[-•*]\s*(.*?)(?=[-•*]|$)/gs) || [];
    
    bulletPoints.forEach(point => {
      const description = point.replace(/^[-•*]\s*/, "").trim();
      if (description.length > 10) {
        experiences.push({ company, description });
      }
    });
    
    // If no bullet points found, use the line itself
    if (bulletPoints.length === 0 && company) {
      experiences.push({ 
        company, 
        description: line.replace(/\([^)]*\)/, "").replace(/at\s+([^(]*)/, "").trim() 
      });
    }
  });
  
  return experiences;
}

function extractProjects(text: string): string[] {
  // Look for project descriptions, either in dedicated section or in experience
  const projectSection = text.match(/projects:?\s*([^]*?)(?=experience:|education:|skills:|$)/i)?.[1] || "";
  
  let projects: string[] = [];
  
  // Extract project names and descriptions
  const projectMatches = projectSection.match(/[-•*]\s*(.*?)(?=[-•*]|$)/gs) || [];
  projects = projectMatches.map(p => p.replace(/^[-•*]\s*/, "").trim()).filter(p => p.length > 10);
  
  // If no dedicated project section, look for project-related keywords in experience
  if (projects.length === 0) {
    const experienceSection = text.match(/experience:?\s*([^]*?)(?=education:|skills:|$)/i)?.[1] || "";
    
    const projectKeywords = ["project", "developed", "created", "built", "implemented", "designed"];
    
    const lines = experienceSection.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.replace(/^[-•*]\s*/, "").trim();
      if (trimmedLine.length > 10 && projectKeywords.some(keyword => 
        trimmedLine.toLowerCase().includes(keyword.toLowerCase())
      )) {
        projects.push(trimmedLine);
      }
    });
  }
  
  return projects;
}

function extractAchievements(text: string): string[] {
  // Look for lines with achievement indicators
  const achievementKeywords = [
    "improved", "increased", "reduced", "saved", "enhanced", "optimized", 
    "accelerated", "streamlined", "boosted", "delivered", "achieved", "led",
    "spearheaded", "pioneered", "transformed", "revamped", "%"
  ];
  
  const lines = text.split('\n');
  
  return lines
    .map(line => line.replace(/^[-•*]\s*/, "").trim())
    .filter(line => 
      line.length > 10 && 
      achievementKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
    );
}

function extractCompanyNames(text: string): string[] {
  const experienceSection = text.match(/experience:?\s*([^]*?)(?=education:|skills:|$)/i)?.[1] || "";
  
  // Try to match company names (assuming format with "at Company")
  const companyMatches = experienceSection.matchAll(/at\s+([^(,]*)/gi);
  
  const companies = Array.from(companyMatches, m => m[1].trim());
  
  // Second pattern: Company name followed by dates in parentheses
  const companyDateMatches = experienceSection.matchAll(/([^,\n]*?)\s*\([^)]*\)/gi);
  const companiesWithDates = Array.from(companyDateMatches, m => m[1].trim());
  
  return [...new Set([...companies, ...companiesWithDates])].filter(c => 
    c.length > 2 && 
    !["the", "a", "an"].includes(c.toLowerCase())
  );
}

function extractTechnologies(text: string): string[] {
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Express", 
    "Python", "Django", "Flask", "Java", "Spring", "C#", ".NET", "PHP", "Laravel",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "NoSQL", "Redis", "GraphQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git",
    "TensorFlow", "PyTorch", "Machine Learning", "AI", "Data Science",
    "REST API", "Microservices", "Agile", "Scrum", "DevOps", "Test-Driven Development"
  ];
  
  return techKeywords.filter(tech => 
    text.toLowerCase().includes(tech.toLowerCase())
  );
}

function extractNounPhrases(text: string): string[] {
  // This is a simplified approach to extract potentially meaningful phrases
  const lines = text.split('\n');
  
  // Get words that might be meaningful
  const blacklist = ["the", "a", "an", "and", "or", "but", "of", "for", "with", "at", "from", "to", "in", "on", "by"];
  
  const phrases: string[] = [];
  
  lines.forEach(line => {
    const cleaned = line.replace(/[-•*]\s*/, "").trim();
    if (cleaned.length < 10) return;
    
    // Extract 2-3 word phrases that might be meaningful
    const words = cleaned.split(/\s+/);
    
    for (let i = 0; i < words.length - 1; i++) {
      if (!blacklist.includes(words[i].toLowerCase()) && words[i].length > 2) {
        if (i < words.length - 1 && !blacklist.includes(words[i+1].toLowerCase()) && words[i+1].length > 2) {
          phrases.push(`${words[i]} ${words[i+1]}`);
          
          if (i < words.length - 2 && !blacklist.includes(words[i+2].toLowerCase()) && words[i+2].length > 2) {
            phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
          }
        }
      }
    }
  });
  
  return [...new Set(phrases)];
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
    
    // For PDF files - use PDF.js for better extraction
    if (file.type === 'application/pdf') {
      const pdfjsLib = await import('pdfjs-dist');
      // Set the worker source path
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      try {
        // Convert the file to an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        // Check if we got meaningful content
        if (fullText.trim().length > 50) {
          return fullText;
        } else {
          console.log("PDF.js extraction returned limited text, trying fallback method");
        }
      } catch (pdfError) {
        console.error("Error in PDF.js extraction:", pdfError);
      }
    }
    
    // For DOCX files - in a real application we'd use a library
    // Here we're just trying to read the file as text as a fallback
    try {
      const textContent = await file.text();
      
      // Check if we got anything meaningful
      if (textContent && textContent.length > 100 && !textContent.includes("Could not extract")) {
        return textContent;
      }
    } catch (e) {
      console.log("Could not extract text directly, proceeding with fallback...");
    }
    
    // If direct text extraction failed or returned too little content,
    // Return a user-friendly message explaining the limitations
    console.log("Using basic text extraction fallback for the resume");
    
    // Create a simplified representation, maintaining the file name
    const fileName = file.name.split('.')[0] || "Candidate";
    
    return `NOTE: Limited text extraction from ${file.type} file. For best results, please convert your resume to plain text format before uploading.
    
The following is the partially extracted content from "${file.name}":

${await file.text()}`;
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    return "Error extracting text from the file. Please try again with a different file format (TXT is recommended for this demo).";
  }
}
