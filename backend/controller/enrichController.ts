import { Router, Request, Response } from 'express';
import { fetchWebsiteContent } from '../services/scraper';
import { enrichWithAI } from '../services/ai';
import { getCachedEnrichment, setCachedEnrichment, hasCachedEnrichment } from '../services/cache';


async function enrichWebsite(req: Request, res: Response) {
  const { website } = req.body;

  if (!website) {
    return res.status(400).json({ error: 'Website URL is required' });
  }

  try {
    if (hasCachedEnrichment(website)) {
      const cached = getCachedEnrichment(website);
      return res.json(cached.data);
    }

    const websiteText = await fetchWebsiteContent(website);
    
    const aiData = await enrichWithAI(websiteText, website);

    const enrichmentData = {
      summary: aiData.summary,
      whatTheyDo: aiData.whatTheyDo,
      keywords: aiData.keywords,
      signals: aiData.signals,
      sources: [
        {
          url: website,
          timestamp: new Date().toISOString(),
        },
      ],
      enrichedAt: new Date().toISOString(),
    };

    setCachedEnrichment(website, enrichmentData);

    res.json(enrichmentData);
  } catch (error) {
    console.error('Enrichment error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Enrichment failed';
    let statusCode = 500;
    
    if (error instanceof Error) {
      const errorString = error.message.toLowerCase();
      
      // Rate limit / quota errors
      if (errorString.includes('quota') || errorString.includes('rate limit') || errorString.includes('429')) {
        errorMessage = 'API quota exceeded. Please try again later.';
        statusCode = 429;
      } 
      // Network/fetch errors
      else if (errorString.includes('fetch') || errorString.includes('enotfound') || errorString.includes('timeout')) {
        errorMessage = 'Failed to fetch website content. The website may be unreachable.';
        statusCode = 502;
      }
      // Parsing errors
      else if (errorString.includes('parse') || errorString.includes('json')) {
        errorMessage = 'Failed to parse website content.';
        statusCode = 422;
      }
      // Generic error
      else {
        errorMessage = error.message;
      }
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
}


export default enrichWebsite;