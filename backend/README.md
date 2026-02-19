# VC Discovery - Backend API

Express.js backend with AI-powered company enrichment.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Add Gemini API key to .env
GEMINI_API_KEY=your_key_here

# Start development server
npm run dev

# Server runs on http://localhost:8087
```

## 📁 Structure

```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── routes/
│   │   └── enrich.ts         # Enrichment endpoint
│   └── services/
│       ├── ai.ts             # Gemini AI integration
│       ├── scraper.ts        # Web scraping
│       └── cache.ts          # In-memory cache
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env
```

## 🔑 Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

Get API key: https://makersuite.google.com/app/apikey

## 📡 API Endpoints

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### POST `/api/enrich`

Enrich company data using AI.

**Request Body:**
```json
{
  "website": "https://example.com"
}
```

**Response:**
```json
{
  "summary": "Brief 1-2 sentence summary",
  "whatTheyDo": [
    "Main product/service",
    "Key feature 1",
    "Key feature 2"
  ],
  "keywords": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  "signals": [
    "Growth indicator 1",
    "Market signal 2"
  ],
  "sources": [
    {
      "url": "https://example.com",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "enrichedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## 🧠 How Enrichment Works

1. **Receive Request**: Website URL from frontend
2. **Fetch Content**: Download homepage HTML
3. **Extract Text**: Clean and extract relevant text
4. **AI Analysis**: Send to Gemini for structured analysis
5. **Parse Response**: Extract JSON from AI response
6. **Cache Result**: Store in memory for future requests
7. **Return Data**: Send enriched data to frontend

## 🔧 Services

### `scraper.ts`
- Fetches website HTML
- Cleans and extracts text
- Removes scripts, styles, nav, footer
- Limits to 5000 characters

### `ai.ts`
- Integrates with Gemini AI
- Sends structured prompts
- Parses JSON responses
- Returns standardized data

### `cache.ts`
- In-memory caching
- Stores enrichment results
- Prevents duplicate API calls
- Reduces latency

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📦 Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **@google/generative-ai**: Gemini AI SDK
- **cheerio**: HTML parsing
- **node-fetch**: HTTP requests

## 🧪 Testing Locally

```bash
# Start server
npm run dev

# Test health endpoint
curl http://localhost:3001/health

# Test enrichment
curl -X POST http://localhost:3001/api/enrich \
  -H "Content-Type: application/json" \
  -d '{"website":"https://google.com"}'
```

## 🚢 Deployment

### Railway
```bash
railway init
railway up
railway variables set GEMINI_API_KEY=your_key
```

### Render
1. Create Web Service
2. Set build: `npm install && npm run build`
3. Set start: `npm start`
4. Add `GEMINI_API_KEY` env var

### Heroku
```bash
heroku create
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

## 🔒 Security

- API keys stored in environment variables
- CORS enabled for specific origins
- Input validation on requests
- Error messages sanitized
- No sensitive data in logs

## ⚡ Performance

- In-memory caching for instant repeated requests
- 10 second timeout on web requests
- Text extraction limited to 5KB
- Async/await for non-blocking operations

## 🐛 Debugging

Enable detailed logging:
```typescript
// src/index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

View logs:
```bash
# Development
npm run dev  # Logs appear in terminal

# Production
# Check platform-specific logs
```

## 📝 Code Style

- TypeScript strict mode
- Async/await over callbacks
- Descriptive variable names
- Minimal comments (code is self-documenting)
- Error handling on all async operations

## 🔄 Caching Strategy

**Current**: In-memory cache
- Fast
- Simple
- Resets on server restart

**Future Options**:
- Redis for persistence
- Database storage
- TTL expiration

## 🎯 API Design Principles

1. **Simplicity**: One endpoint, clear purpose
2. **REST**: Standard HTTP methods
3. **JSON**: Consistent data format
4. **Errors**: Meaningful error messages
5. **Validation**: Input checking

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
```bash
# Development
tail -f console output

# Production
railway logs
# or platform-specific logs
```

## 🚀 Production Checklist

- [ ] `GEMINI_API_KEY` set
- [ ] CORS configured for production domain
- [ ] Error handling tested
- [ ] Rate limiting added (optional)
- [ ] Monitoring set up (optional)
- [ ] Build succeeds: `npm run build`
- [ ] Health endpoint responds

## 🤝 Integration

Frontend integration:
```typescript
const response = await fetch('http://localhost:3001/api/enrich', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ website: 'https://example.com' })
});

const data = await response.json();
```

## 📄 License

MIT

## 🎓 Learn More

- [Express.js Docs](https://expressjs.com/)
- [Gemini API](https://ai.google.dev/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Part of VC Discovery Platform**
