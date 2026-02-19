# VC Discovery Platform

A modern, full-stack VC intelligence platform with live company enrichment powered by AI. Built with Next.js 14, TypeScript, and Google Gemini AI.

## ✨ Key Features

### 🏢 Companies Directory
- **Advanced Search**: Real-time search with intelligent history suggestions (last 25 searches)
- **Multi-faceted Filters**: Filter by sector, stage, and location
- **Sortable Columns**: Click any column header to sort
- **Smart Pagination**: Navigate through 10 companies per page
- **Bulk Export**: Download filtered results as CSV or JSON
- **File Import**: Upload CSV/JSON files to create company lists instantly

### 👤 Company Profiles
- **Comprehensive Overview**: All key company information at a glance
- **Multi-Note System**: Add unlimited notes per company with timestamps
- **Instagram-Style Bookmarks**: Quick-save companies to custom lists with elegant modal
- **Live AI Enrichment**: One-click enrichment using Google Gemini AI
  - Company summary (1-2 sentences)
  - What they do (3-6 bullet points)
  - Keywords (5-10 relevant terms)
  - Derived signals (2-4 insights)
  - Source attribution with timestamps
- **Signals Timeline**: Track important company events and updates
- **Visual Indicators**: Note counter badges, enrichment status

### 📋 Lists Management
- **Create & Organize**: Build custom lists for deal flow tracking
- **List Search**: Find companies within your lists instantly
- **Smart Pagination**: View 5 lists per page for better organization
- **Modal View**: Elegant popup to view list details and manage companies
- **Export Options**: Download individual lists or all lists as CSV/JSON
- **File Upload**: Import companies via CSV/JSON to create new lists
- **Quick Actions**: Floating action button for rapid access

### 💾 Saved Searches
- **Persistent Queries**: Save search terms and filter combinations
- **One-Click Re-run**: Instantly apply saved search parameters
- **Full Filter Support**: Preserves sector, stage, and location filters
- **localStorage Persistence**: Your searches survive browser sessions

### 🎨 Modern UI/UX
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Expandable Sidebar**: Collapsible navigation with hamburger menu
- **Floating Action Buttons**: Quick access to common actions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean Typography**: Premium feel with consistent design system
- **Loading States**: Smooth animations and clear feedback

### ⌨️ Keyboard Shortcuts
- `Cmd/Ctrl + F` - Focus search bar
- `Cmd/Ctrl + O` - Open file upload (Companies page)
- `Cmd/Ctrl + S` - Save/download list (when viewing a list)
- `Esc` - Exit search input
- `1` - Navigate to Companies page
- `2` - Navigate to Lists page

## Project Structure

```
BC04/
├── docker-compose.yml           # Docker orchestration
├── frontend/                    # Next.js 14 application
│   ├── Dockerfile              # Frontend container config
│   ├── app/
│   │   ├── companies/          # Companies directory & profiles
│   │   ├── lists/              # List management
│   │   ├── saved/              # Saved searches
│   │   ├── layout.tsx          # Root layout with sidebar
│   │   └── globals.css         # Global styles & dark mode
│   ├── components/
│   │   ├── Sidebar.tsx         # Expandable navigation
│   │   ├── SearchBar.tsx       # Search with history
│   │   ├── ThemeToggle.tsx     # Dark mode toggle
│   │   ├── BookmarkPopup.tsx   # Save to list modal
│   │   ├── NotesModal.tsx      # Multi-note manager
│   │   └── FloatingActionButton.tsx  # FAB component
│   ├── data/
│   │   └── mockCompanies.ts    # Seed data (15 companies)
│   └── types/
│       └── index.ts            # TypeScript interfaces
│
└── backend/                     # Express API server
    ├── Dockerfile              # Backend container config
    ├── src/
    │   ├── routes/
    │   │   └── enrich.ts       # AI enrichment endpoint
    │   ├── services/
    │   │   └── enrichmentService.ts  # Gemini AI integration
    │   └── index.ts            # Server entry point
    └── .env.example            # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for manual setup)
- Docker & Docker Compose (for Docker setup)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Option 1: 🐳 Docker Setup (Recommended)

The easiest way to run the entire platform:

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd BC04
```

2. **Create backend `.env` file**
```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Run with Docker Compose**
```bash
cd ..  # Back to root directory
docker-compose up --build
```

That's it! The platform will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8087

**Docker Commands:**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up --build

# Stop and remove volumes
docker-compose down -v
```

### Option 2: 📦 Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

5. Start development server:
```bash
npm run dev
# or for production
npm run build && npm start
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional):
```bash
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📖 Usage Guide

### Getting Started
1. **Launch both servers** (backend on :3001, frontend on :3000)
2. **Browse companies** - Navigate to Companies page from sidebar
3. **Apply filters** - Use sector, stage, or location dropdowns
4. **Search** - Type in the search bar; see history suggestions
5. **Sort & paginate** - Click column headers, use pagination controls

### Working with Companies
1. **View profile** - Click any company name
2. **Enrich data** - Click "Enrich" button for AI-powered insights
3. **Add notes** - Click the floating pencil icon (shows note count badge)
4. **Save to list** - Click bookmark icon next to Enrich button
5. **Create lists** - Choose existing list or create new one in modal

### Managing Lists
1. **Create list** - Use FAB (+ button) or click "Create New List"
2. **Import companies** - Upload CSV/JSON via FAB
3. **Search lists** - Use search bar to filter lists
4. **View list** - Click "View" to see all companies in modal
5. **Export** - Download individual list (Cmd/S in modal) or all lists (FAB menu)

### Power User Features
- **Keyboard shortcuts** - See list in Features section
- **Dark mode** - Toggle in sidebar (preference persists)
- **Bulk operations** - Upload files, export filtered results
- **Search history** - Access last 25 searches from dropdown

## Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste into `backend/.env` file

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark mode
- **State Management**: React hooks (useState, useEffect, useMemo, useRef)
- **Persistence**: localStorage for notes, lists, searches, theme
- **Routing**: Next.js file-based routing
- **Icons**: SVG inline icons
- **File Handling**: FileReader API for CSV/JSON parsing

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Engine**: Google Gemini AI (gemini-1.5-flash)
- **Web Scraping**: Cheerio for HTML parsing
- **HTTP Client**: Node-fetch for website fetching
- **Caching**: In-memory cache for enrichment results
- **CORS**: Enabled for frontend communication

### Development Tools
- **Package Manager**: npm
- **Bundler**: Next.js built-in (Turbopack)
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint (Next.js config)

## 📡 API Documentation

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Enrich Company
```bash
POST /api/enrich
Content-Type: application/json
```

**Request:**
```json
{
  "website": "https://example.com",
  "companyName": "Example Inc."
}
```

**Response (Success):**
```json
{
  "summary": "Brief 1-2 sentence company overview",
  "whatTheyDo": [
    "Core product or service bullet point",
    "Key differentiator or technology",
    "Target market or customers"
  ],
  "keywords": ["AI", "SaaS", "Enterprise", "B2B", "Analytics"],
  "signals": [
    "Active careers page indicates growth",
    "Recent blog posts show product momentum"
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

**Response (Error):**
```json
{
  "error": "Failed to enrich company",
  "message": "Website unreachable or invalid URL"
}
```

**Features:**
- ✅ In-memory caching (prevents duplicate AI calls)
- ✅ Server-side only (API keys protected)
- ✅ Error handling with user-friendly messages
- ✅ Source attribution and timestamps
- ✅ Structured JSON output optimized for UI

## 🚢 Deployment

### Option 1: 🐳 Docker Deployment (Any Platform)

Deploy using Docker on any platform that supports containers (AWS ECS, Google Cloud Run, DigitalOcean, etc.)

#### Single Server Deployment

1. **Build and push images**
   ```bash
   # Build images
   docker build -t vc-platform-frontend ./frontend
   docker build -t vc-platform-backend ./backend
   
   # Tag for your registry
   docker tag vc-platform-frontend your-registry/vc-platform-frontend:latest
   docker tag vc-platform-backend your-registry/vc-platform-backend:latest
   
   # Push to registry
   docker push your-registry/vc-platform-frontend:latest
   docker push your-registry/vc-platform-backend:latest
   ```

2. **Deploy with docker-compose**
   ```bash
   # On your server
   docker-compose up -d
   ```

#### Docker Hub Deployment

1. **Push to Docker Hub**
   ```bash
   docker login
   docker tag vc-platform-frontend yourusername/vc-platform-frontend:latest
   docker tag vc-platform-backend yourusername/vc-platform-backend:latest
   docker push yourusername/vc-platform-frontend:latest
   docker push yourusername/vc-platform-backend:latest
   ```

2. **Pull and run on server**
   ```bash
   docker pull yourusername/vc-platform-frontend:latest
   docker pull yourusername/vc-platform-backend:latest
   docker-compose up -d
   ```

#### Production Docker Compose

For production, update `docker-compose.yml` with:
- Health checks
- Resource limits
- Proper logging drivers
- Volume mounts for persistence
- SSL/TLS certificates

### Option 2: 🚀 Cloud Platform Deployment

#### Frontend (Vercel - Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
     ```
   - Deploy

### Backend (Railway / Render / Fly.io)

#### Railway
1. Visit [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Set root directory to `backend`
4. Add environment variables:
   ```
   GEMINI_API_KEY=your_key
   PORT=3001
   ```
5. Deploy

#### Render
1. Visit [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (same as Railway)
6. Deploy

### Environment Variables Reference

**Backend (.env)**
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**Frontend (.env.local)** - Optional
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
# Defaults to http://localhost:3001 if not set
```

## 📂 Data Storage

### localStorage Schema

**Notes:** `notes` key
```typescript
{
  [companyId: string]: {
    id: string;
    text: string;
    createdAt: string;
  }[]
}
```

**Lists:** `lists` key
```typescript
{
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}[]
```

**Saved Searches:** `savedSearches` key
```typescript
{
  id: string;
  name: string;
  query: string;
  sector: string;
  stage: string;
  location: string;
  savedAt: string;
}[]
```

**Search History:** `searchHistory` key
```typescript
string[] // Last 25 searches
```

**Theme:** `theme` key
```typescript
'light' | 'dark'
```

## 🎯 Feature Highlights

### What Makes This Special

1. **Production-Ready UI**: Clean, modern interface that feels like a real product
2. **Live AI Enrichment**: Real-time data fetching and AI analysis
3. **Keyboard-First**: Power users can navigate entirely via keyboard
4. **Dark Mode**: Full theme support with system preference detection
5. **Zero Configuration**: Works out of the box with sensible defaults
6. **Type-Safe**: End-to-end TypeScript for reliability
7. **Secure**: API keys never exposed to browser
8. **Fast**: In-memory caching, optimized React rendering
9. **Persistent**: All user data saved locally
10. **Exportable**: Get your data out in standard formats

## 🐛 Troubleshooting

### Docker Issues

#### Containers won't start
- ✅ Check if `.env` file exists in `backend/` directory
- ✅ Verify `GEMINI_API_KEY` is set in `backend/.env`
- ✅ Check Docker daemon is running: `docker ps`
- ✅ View container logs: `docker-compose logs backend` or `docker-compose logs frontend`
- ✅ Rebuild containers: `docker-compose up --build`

#### Port conflicts
- ✅ Check if ports 3000 or 3001 are in use: `lsof -i :3000` or `lsof -i :3001`
- ✅ Stop conflicting services or change ports in `docker-compose.yml`

#### Frontend can't reach backend in Docker
- ✅ Make sure both containers are in the same network (check `docker-compose.yml`)
- ✅ Use service name `backend` not `localhost` for inter-container communication
- ✅ Verify `NEXT_PUBLIC_BACKEND_URL` environment variable in docker-compose

#### Changes not reflecting
- ✅ Rebuild images: `docker-compose up --build`
- ✅ Remove old containers: `docker-compose down && docker-compose up --build`
- ✅ Clear Docker cache: `docker system prune -a`

### Manual Setup Issues

#### Backend won't start
- ✅ Check if `.env` file exists in `backend/` directory
- ✅ Verify `GEMINI_API_KEY` is set correctly
- ✅ Ensure port 3001 is not in use: `lsof -i :3001`
- ✅ Run `npm install` to ensure dependencies are installed

### Frontend can't connect to backend
- ✅ Verify backend is running on `http://localhost:3001`
- ✅ Check browser console for CORS errors
- ✅ Ensure `NEXT_PUBLIC_BACKEND_URL` is set correctly (if using custom backend URL)

### Enrichment fails
- ✅ Verify Gemini API key is valid
- ✅ Check if target website is publicly accessible
- ✅ Look at backend console for detailed error messages
- ✅ Try a different company website

### Dark mode not persisting
- ✅ Check browser localStorage is enabled
- ✅ Clear cache and reload
- ✅ Ensure JavaScript is enabled

## 🤝 Contributing

This is an assignment project, but if you'd like to extend it:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a coding assignment.

## 🙏 Acknowledgments

- **Harmonic** - Workflow inspiration for VC intelligence interfaces
- **Google Gemini** - AI-powered enrichment engine
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ for teams who deserve better tools.**
