export interface Company {
  id: string;
  name: string;
  website: string;
  sector: string;
  stage: string;
  location: string;
  description?: string;
  fundingRaised?: string;
  employeeCount?: string;
}

export interface EnrichmentData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: {
    url: string;
    timestamp: string;
  }[];
  enrichedAt: string;
}

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    sector?: string;
    stage?: string;
    location?: string;
  };
  createdAt: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}
