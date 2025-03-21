
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
        "content": "You are a helpful assistant that analyzes resumes and generates relevant interview questions."
      },
      {
        "role": "user",
        "content": `Based on the following resume, generate 5 specific questions to ask the candidate. Focus on their experience, skills, and potential areas for elaboration. Format each question as a JSON array entry with an id and text field:\n\n${resumeText}`
      }
    ],
    "temperature": 0.7,
    "max_tokens": 500
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
    const content = result.choices[0].message.content;
    
    // Try to parse if response is already in JSON format
    try {
      const parsedQuestions = JSON.parse(content);
      if (Array.isArray(parsedQuestions)) {
        return parsedQuestions.map((q, i) => ({
          id: i + 1,
          text: typeof q === 'string' ? q : q.text || `Question ${i + 1}`
        }));
      }
    } catch (e) {
      console.log("Response not in JSON format, extracting questions...");
    }
    
    // Fallback extraction from text
    const questionRegex = /\d+\.\s+(.*?)(?=\d+\.|$)/gs;
    const matches = Array.from(content.matchAll(questionRegex));
    
    if (matches.length > 0) {
      return matches.map((match, index) => ({
        id: index + 1,
        text: match[1].trim()
      })).filter(q => q.text);
    }
    
    // Another fallback for numbered lists
    const questions = content
      .split('\n')
      .filter(line => /^\d+\./.test(line))
      .map((line, index) => ({
        id: index + 1,
        text: line.replace(/^\d+\.\s+/, '').trim()
      }));
    
    return questions.length ? questions : generateFallbackQuestions();
  } catch (error) {
    console.error("Error generating questions:", error);
    return generateFallbackQuestions();
  }
}

function generateFallbackQuestions(): Question[] {
  return [
    { id: 1, text: "Tell me about your most recent work experience." },
    { id: 2, text: "What are your key technical skills?" },
    { id: 3, text: "Describe a challenging project you've worked on." },
    { id: 4, text: "What are your career goals?" },
    { id: 5, text: "Why are you interested in this position?" }
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
    // In a real application, you would send this file to a backend for processing
    // For now, we'll just read the text file contents directly in the browser
    if (file.type === 'text/plain') {
      return await file.text();
    } else {
      // For other file types (PDF, DOCX) we'd need a backend
      // This is a simplified implementation
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string || 
            "File content extracted. For PDF and DOCX files, this would normally require backend processing.");
        };
        reader.readAsText(file);
      });
    }
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    return "Error extracting text from the file. Please try again with a different file.";
  }
}
