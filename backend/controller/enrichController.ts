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
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Enrichment failed',
    });
  }
}


export default enrichWebsite;