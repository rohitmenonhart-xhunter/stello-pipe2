import OpenAI from 'openai';
import { BrdAnswers } from '../App';
import { getPythonApiUrl } from '../config/api';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

export const generateFollowUpQuestions = async (brdAnswers: BrdAnswers): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert website requirements analyst specializing in modern static websites and landing pages. Based on the client's initial BRD responses, generate 5 specific follow-up questions that will help determine:
          1. What type of business they are running
          2. Which pages from our standard set (Home, About Us, Services, Products, Case Studies, Articles, Careers, Pricing, Contact) would be most beneficial
          3. What specific content and features each page should have
          4. How to make their static website modern and engaging
          
          Focus on questions that will help us recommend the most appropriate pages and features for their specific business case.`
        },
        {
          role: "user",
          content: `Here are the client's BRD responses:
            Business Goals: ${brdAnswers.businessGoals}
            Target Audience: ${brdAnswers.targetAudience}
            Key Features: ${brdAnswers.keyFeatures}
            Content Types: ${brdAnswers.contentTypes}
            Design Preferences: ${brdAnswers.designPreferences}
            Technical Requirements: ${brdAnswers.technicalRequirements}
            Timeline: ${brdAnswers.timeline}
            Budget: ${brdAnswers.budget}
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const questions = response.choices[0].message.content?.split('\n').filter(q => q.trim() !== '') || [];
    return questions.slice(0, 5); // Ensure we only return 5 questions
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    throw error;
  }
};

export const generateIADiagram = async (brdAnswers: BrdAnswers): Promise<string> => {
  try {
    console.log('Sending BRD answers:', brdAnswers); // Add logging
    
    const response = await fetch(getPythonApiUrl('generate-ia'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brdAnswers,
        followUpAnswers: [] // Keep empty array for API compatibility
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('Server error:', errorData); // Add logging
      throw new Error(errorData.detail || 'Failed to generate IA diagram');
    }

    const data = await response.json();
    return data.iaStructure;
  } catch (error) {
    console.error("Error generating IA diagram:", error);
    throw error;
  }
};