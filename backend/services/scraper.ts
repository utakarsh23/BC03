import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VCDiscovery/1.0)',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();

    let text = $('body').text();
    text = text.replace(/\s+/g, ' ').trim();
    
    return text.substring(0, 5000);
  } catch (error) {
    throw new Error(`Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
