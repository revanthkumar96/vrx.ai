import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Hugging Face client
const hf = new HfInference(process.env.HF_TOKEN);

class AIService {
  constructor() {
    this.groqModel = 'meta-llama/llama-4-scout-17b-16e-instruct'; // Using Llama 4 Scout as requested
  }

  /**
   * Generate AI response for Career Companion
   * @param {string} userMessage - User's message
   * @param {Object} context - User's profile and context
   * @returns {Promise<string>} AI response
   */
  async generateCareerCompanionChatResponse(userMessage, context) {
    try {
      const systemPrompt = `
        You are "Aura", an advanced AI Career Companion & Tech Mentor.
        
        USER PROFILE:
        - Name: ${context.name || 'Friend'}
        - Role/Domain: ${context.study_domain || 'Tech Enthusiast'}
        - Skills: ${context.skills ? context.skills.join(', ') : 'Not specified'}
        - LinkedIn: ${context.linkedin_handle ? 'Connected' : 'Not Connected'}
        
        CODING STATS:
        - LeetCode Solved: ${context.leetcode_solved || 0}
        - CodeChef Solved: ${context.codechef_solved || 0}
        - Codeforces Solved: ${context.codeforces_solved || 0} (Contest: ${context.codeforces_contest_solved || 0})
        - Current Streak: ${context.coding_current_streak || 0} days
        
        RECENT ACTIVITY:
        - Active Days (Last 7 days): ${context.active_days_this_week || 0}
        - Problems Today: ${context.problems_solved_today || 0}
        
        YOUR GOAL:
        Provide personalized, actionable, and encouraging career advice. 
        - If their streak is low (<3 days), motivate them gently.
        - If they are highly active, challenge them with advanced concepts.
        - Use their coding stats to tailor your advice (e.g., "Since you're doing well on LeetCode...").
        - Mention their specific tech stack/skills.
        
        Tone: Professional, encouraging, insightful, and concise. Use emojis sparingly.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context.history || []), // Include chat history if available
          { role: 'user', content: userMessage }
        ],
        model: this.groqModel,
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at the moment.";
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
  }

  /**
   * Generate an AI assignment (Quiz or Coding Problem)
   * @param {string} type - 'quiz' or 'coding'
   * @param {string} topic - Topic (e.g., 'React', 'Algorithms')
   * @param {string} difficulty - 'Beginner', 'Intermediate', 'Advanced'
   * @returns {Promise<Object>} Generated assignment
   */
  async generateAssignment(type, topic, difficulty) {
    try {
      const prompt = type === 'quiz' 
        ? `Generate a 5-question multiple choice quiz about ${topic} at ${difficulty} level. Return JSON format: { "title": "...", "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "answer": "correct option" } ] }`
        : `Generate a coding problem about ${topic} at ${difficulty} level. Return JSON format: { "title": "...", "description": "...", "examples": [{ "input": "...", "output": "..." }], "initialCode": "...", "solution": "..." }`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert technical interviewer and educator. Output ONLY valid JSON.' },
          { role: 'user', content: prompt }
        ],
        model: this.groqModel,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch (error) {
      console.error('Error generating assignment:', error);
      throw new Error('Failed to generate assignment');
    }
  }
}

export default new AIService();
