interface EnrichmentCache {
  [key: string]: {
    data: any;
    timestamp: string;
  };
}

const cache: EnrichmentCache = {};

export function getCachedEnrichment(website: string) {
  return cache[website] || null;
}

export function setCachedEnrichment(website: string, data: any) {
  cache[website] = {
    data,
    timestamp: new Date().toISOString(),
  };
}

export function hasCachedEnrichment(website: string): boolean {
  return website in cache;
}
