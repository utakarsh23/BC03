# VC Discovery Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4-green)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)](https://ai.google.dev/)

A full-stack venture capital company discovery platform with AI-powered enrichment.

## 🎯 Features

- **Company Discovery**: Search, filter, and sort through companies
- **AI Enrichment**: One-click company data enrichment using Google Gemini
- **Custom Lists**: Organize companies into custom lists
- **Saved Searches**: Save and re-run search queries
- **Data Export**: Export lists to CSV or JSON
- **Persistent Storage**: All data saved in localStorage

## 🚀 Quick Start

```bash
# 1. Clone/navigate to project
cd BC04

# 2. Run setup
./setup.sh  # Mac/Linux
# or
setup.bat   # Windows

# 3. Add Gemini API key to backend/.env
GEMINI_API_KEY=your_key_here

# 4. Start backend (Terminal 1)
cd backend && npm run dev

# 5. Start frontend (Terminal 2)
cd frontend && npm run dev

# 6. Open http://localhost:3000
```

Get API key: https://makersuite.google.com/app/apikey

## 📖 Documentation

- [Getting Started Guide](GETTING_STARTED.md) - Step-by-step setup checklist
- [Quick Start](QUICKSTART.md) - Fast setup and usage
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Project Summary](PROJECT_SUMMARY.md) - Complete overview

## 🏗️ Architecture

```
Frontend (Next.js)          Backend (Express)
     |                            |
     |-------- HTTP/JSON ---------|
     |                            |
  Client-side              AI Enrichment
   Filtering              (Gemini API)
     |                            |
 localStorage              In-Memory Cache
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **AI**: Google Gemini
- **Scraping**: Cheerio
- **Caching**: In-memory

## 📁 Project Structure

```
BC04/
├── frontend/              # Next.js app
│   ├── app/
│   │   ├── companies/    # Company pages
│   │   ├── lists/        # Lists management
│   │   └── saved/        # Saved searches
│   ├── components/       # React components
│   ├── data/            # Mock data
│   └── types/           # TypeScript types
│
└── backend/             # Express API
    └── src/
        ├── routes/      # API endpoints
        └── services/    # Business logic
```

## 🎨 Screenshots

### Companies Page
- Search and filter companies
- Sortable columns
- Pagination

### Company Profile
- Detailed information
- Notes section
- AI enrichment
- Save to lists

### Lists Management
- Create custom lists
- Export to CSV/JSON
- Manage companies

### Saved Searches
- Save filter combinations
- Quick re-run

## 🔑 Environment Variables

### Backend `.env`
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 📊 Mock Data

Includes 15 companies across:
- AI/ML, FinTech, HealthTech, EdTech
- CleanTech, Cybersecurity, Logistics
- PropTech, FoodTech, DevTools
- MarTech, BioTech, Transportation
- SaaS, InsurTech

## 🔄 Enrichment Pipeline

1. User clicks "Enrich" on company profile
2. Frontend sends company website to API
3. Backend fetches homepage HTML
4. Extracts and cleans text content
5. Sends to Gemini AI for analysis
6. AI returns structured insights
7. Backend caches result
8. Frontend displays enriched data

### Enrichment Data
- **Summary**: 1-2 sentence overview
- **What they do**: 3-6 bullet points
- **Keywords**: 5-10 relevant keywords
- **Signals**: 2-4 growth indicators
- **Sources**: URLs with timestamps

## 🚢 Deployment

### Vercel (Frontend)
```bash
cd frontend
vercel
```

### Railway (Backend)
```bash
cd backend
railway init
railway up
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run build
npm run dev

# Backend
cd backend
npm run build
npm run dev
```

## 📝 API Endpoints

### POST `/api/enrich`

Enrich company data.

**Request:**
```json
{
  "website": "https://example.com"
}
```

**Response:**
```json
{
  "summary": "Company summary",
  "whatTheyDo": ["point1", "point2"],
  "keywords": ["keyword1", "keyword2"],
  "signals": ["signal1", "signal2"],
  "sources": [{"url": "...", "timestamp": "..."}],
  "enrichedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

This is an assignment project. For production use:
- Add authentication
- Implement database
- Add rate limiting
- Set up monitoring
- Add tests

## 📄 License

MIT License - feel free to use for learning and development.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Gemini API Docs](https://ai.google.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

**Backend Issues:**
- Verify Gemini API key
- Check port 3001 availability
- Review terminal logs

**Frontend Issues:**
- Check backend URL in `.env.local`
- Verify backend is running
- Clear browser cache

**Enrichment Fails:**
- Validate API key
- Check website accessibility
- Review backend logs

See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed troubleshooting.

## ⚡ Performance

- Client-side filtering for instant results
- In-memory caching prevents duplicate API calls
- Pagination limits DOM size
- Text extraction limited to 5000 chars
- 10s timeout on web requests

## 🔒 Security

- API keys in environment variables
- No credentials in code
- Server-side enrichment only
- CORS enabled for frontend
- Input validation on backend

## 🎉 Status

✅ **Complete and Ready to Deploy**

All requirements met:
- ✅ Next.js frontend with sidebar
- ✅ Companies page with filters
- ✅ Company profiles
- ✅ Lists management
- ✅ Saved searches
- ✅ Live AI enrichment
- ✅ Export functionality
- ✅ Persistent storage
- ✅ Loading & error states

## 📞 Support

For issues or questions:
1. Check [GETTING_STARTED.md](GETTING_STARTED.md)
2. Review [TROUBLESHOOTING](GETTING_STARTED.md#-troubleshooting)
3. Check browser/terminal console logs

---

**Built with ❤️ for VC discovery**
