# Deployment Guide

## Frontend Deployment (Vercel - Recommended)

### Option 1: Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Add Environment Variable:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_BACKEND_URL` = `your-backend-url`
   - Redeploy

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable `NEXT_PUBLIC_BACKEND_URL`
5. Deploy

## Backend Deployment

### Option 1: Railway

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Deploy:**
```bash
cd backend
railway login
railway init
railway up
```

3. **Add Environment Variables:**
```bash
railway variables set GEMINI_API_KEY=your_key_here
railway variables set PORT=3001
```

### Option 2: Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `GEMINI_API_KEY`
   - `PORT` (optional, Render provides one)

### Option 3: Heroku

1. **Install Heroku CLI:**
```bash
npm i -g heroku
```

2. **Deploy:**
```bash
cd backend
heroku create your-app-name
heroku config:set GEMINI_API_KEY=your_key_here
git subtree push --prefix backend heroku main
```

## Production Checklist

### Backend
- [ ] Add `GEMINI_API_KEY` environment variable
- [ ] Set appropriate `PORT`
- [ ] Enable CORS for production frontend URL
- [ ] Add rate limiting (optional)
- [ ] Set up error logging (optional)

### Frontend
- [ ] Set `NEXT_PUBLIC_BACKEND_URL` to production backend
- [ ] Test enrichment functionality
- [ ] Verify localStorage works
- [ ] Test all routes

## Environment Variables Summary

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

For production, change to your deployed backend URL:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Railway
1. Settings → Domains
2. Add custom domain
3. Configure DNS CNAME record

## Monitoring & Logs

### Vercel
- View logs in Dashboard → Deployments → Function Logs

### Railway
- View logs: `railway logs`
- Or in Railway Dashboard

### Render
- View logs in Dashboard → Logs

## Troubleshooting Deployment Issues

**Build fails on Frontend:**
- Ensure all dependencies are in `package.json`
- Check TypeScript errors: `npm run build` locally

**Build fails on Backend:**
- Verify `tsconfig.json` is correct
- Test build locally: `npm run build`

**Enrichment not working in production:**
- Verify `GEMINI_API_KEY` is set correctly
- Check CORS settings
- Verify backend URL in frontend env

**CORS errors:**
Update backend `src/index.ts`:
```typescript
app.use(cors({
  origin: 'https://your-frontend.vercel.app'
}));
```
