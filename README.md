# Kibbe AI Discovery App

A full-stack application to determine your Kibbe body type using GPT-4 Vision and a guided visual quiz, with Supabase authentication, history tracking, and sharing to Reddit.

## Setup

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env` based on `.env.example`
4. `npm run dev`

### Backend
1. `cd backend`
2. `python3 -m venv venv && source venv/bin/activate`
3. `pip install -r requirements.txt`
4. Create `.env` based on `.env.example`
5. `uvicorn main:app --reload`

## Deployment
- Frontend: Vercel (set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Backend: Render (set SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY, STORAGE_BUCKET)

### Reddit Bot
1. Set Reddit API credentials in `backend/.env` (see `backend/.env.example`).
2. From `backend`, run `python reddit_bot.py <reddit_post_url>` to analyze an image post and automatically reply with the Kibbe type and style guide. Add `--all` to analyze every image if the post contains a gallery.
