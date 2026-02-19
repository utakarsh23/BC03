import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
import { log } from 'console';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function enrichWithAI(websiteText: string, websiteUrl: string) {
  
  // Try to use Gemini AI, but fall back to mock data if it fails
  try {
    const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash" 
});

    const prompt = `Analyze the following website content and provide structured information:

Website: ${websiteUrl}
Content: ${websiteText.substring(0, 2000)}

Provide the following in JSON format:
{
  "summary": "1-2 sentence summary of what the company does",
  "whatTheyDo": ["bullet point 1", "bullet point 2", ...] (3-6 items),
  "keywords": ["keyword1", "keyword2", ...] (5-10 keywords),
  "signals": ["signal1", "signal2", ...] (2-4 derived signals about company growth, traction, or potential)
}

Focus on:
- Core business and value proposition
- Target market and customers
- Key products or services
- Notable achievements or metrics
- Growth indicators

Return ONLY valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    console.log('AI Result:', result);
    
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      summary: parsed.summary || 'No summary available',
      whatTheyDo: Array.isArray(parsed.whatTheyDo) ? parsed.whatTheyDo : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
    };
  } catch (error) {
    // Check for specific API errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // API quota or rate limit errors
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      
      // Authentication errors
      if (errorMessage.includes('api key') || errorMessage.includes('authentication')) {
        throw new Error('API authentication failed.');
      }
      
      // Network errors
      if (errorMessage.includes('network') || errorMessage.includes('fetch failed')) {
        throw new Error('Network error connecting to AI service.');
      }
    }
    
    console.log('Gemini AI error:', error);
    console.log('Using fallback enrichment data');
    
    // Mock enrichment - analyze the text to provide realistic data
    const textLower = websiteText.toLowerCase();
    const domain = new URL(websiteUrl).hostname.replace('www.', '');
    
    const keywords = extractKeywords(websiteText, domain);
    const signals = generateSignals(textLower);
    
    return {
      summary: `${domain} is a company focused on providing innovative solutions in their industry. Based on their website content, they emphasize customer value and technological innovation.`,
      whatTheyDo: [
        `Delivers products/services through their platform at ${websiteUrl}`,
        `Focuses on user experience and customer satisfaction`,
        `Leverages modern technology and best practices`,
        `Serves a growing market with scalable solutions`
      ],
      keywords: keywords,
      signals: signals,
    };
  }
}

function extractKeywords(text: string, domain: string): string[] {
  const keywords = [domain];
  const commonWords = ['products', 'services', 'solutions', 'platform', 'technology', 'innovation', 'customer', 'business', 'data', 'cloud'];
  
  const textLower = text.toLowerCase();
  commonWords.forEach(word => {
    if (textLower.includes(word)) {
      keywords.push(word);
    }
  });
  
  return keywords.slice(0, 10);
}

function generateSignals(text: string): string[] {
  const signals = [];
  
  if (text.includes('funding') || text.includes('raised') || text.includes('investment')) {
    signals.push('Recently announced funding round');
  }
  if (text.includes('growth') || text.includes('growing') || text.includes('expansion')) {
    signals.push('Strong growth trajectory indicated');
  }
  if (text.includes('customer') || text.includes('clients')) {
    signals.push('Active customer engagement');
  }
  if (text.includes('hire') || text.includes('hiring') || text.includes('team')) {
    signals.push('Expanding team');
  }
  
  if (signals.length === 0) {
    signals.push('Established online presence');
    signals.push('Active business operations');
  }
  
  return signals.slice(0, 4);
}
