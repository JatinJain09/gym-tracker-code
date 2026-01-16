# Gym Tracker - Quick Start

## What You Have

A complete voice-powered gym tracker that lets you log workouts by speaking. The AI understands natural language and automatically structures your workout data.

## Repository

**GitHub:** https://github.com/JatinJain09/gym-tracker-code

## What Works

- Voice recording with Web Speech API (Chrome/Edge)
- AI parsing with OpenAI GPT-4 (understands aliases like "bench" → "Bench Press")
- Workout storage in Supabase PostgreSQL
- Dashboard showing workout history
- Progress charts for tracking strength gains

## Before You Can Use It

You need to complete these setup steps (detailed in SETUP_GUIDE.md):

1. **Create Supabase Account** (5 minutes)
   - Sign up at supabase.com
   - Create new project
   - Run the SQL schema from `supabase-schema.sql`
   - Get API keys (URL + anon key)
   - Create a test user and copy the User ID

2. **Configure Environment Variables** (2 minutes)
   - Backend: Create `backend/.env` with OpenAI + Supabase keys
   - Frontend: Create `frontend/.env` with API URL + Supabase keys

3. **Update User ID** (1 minute)
   - Edit `frontend/src/pages/Dashboard.jsx` line 8
   - Replace `'test-user-123'` with your real Supabase User ID

4. **Start Servers** (1 minute)
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. **Open Browser**
   - Go to http://localhost:5173
   - Allow microphone access
   - Start logging workouts!

## Example Voice Commands

- "Bench press, 40kg, four sets, 8 reps, 6 reps, 6 reps, 5 reps"
- "Bench, 40kg, 8, 6, 6" (shorthand)
- "Shoulder press, 20kg, three sets, 10 reps each"
- "Deadlift, 100kg, 5, 5, 5, 5"

## Project Structure

```
backend/
  ├── server.js           # Main Express server
  ├── routes/             # API endpoints
  │   ├── ai.js          # AI parsing endpoint
  │   ├── workouts.js    # CRUD for workouts
  │   └── ...
  ├── services/
  │   ├── openai.js      # GPT-4 integration
  │   └── supabase.js    # Database client
  └── .env               # API keys (YOU CREATE THIS)

frontend/
  ├── src/
  │   ├── pages/
  │   │   └── Dashboard.jsx       # Main page
  │   ├── components/
  │   │   ├── VoiceInput.jsx      # Mic + recording UI
  │   │   ├── WorkoutList.jsx     # History table
  │   │   └── ProgressChart.jsx   # Charts
  │   ├── hooks/
  │   │   └── useSpeechRecognition.js  # Web Speech API
  │   └── services/
  │       └── api.js              # Backend client
  └── .env                        # Config (YOU CREATE THIS)

supabase-schema.sql     # Database schema (run in Supabase)
SETUP_GUIDE.md          # Detailed setup instructions
```

## API Keys You Need

1. **OpenAI API Key**
   - Get from: https://platform.openai.com/api-keys
   - Costs: ~$0.01-0.02 per workout parse (GPT-4)
   - Add to `backend/.env` as `OPENAI_API_KEY`

2. **Supabase Keys**
   - Get from: Your Supabase project settings → API
   - Free tier: 500MB database, unlimited API requests
   - Add to both `backend/.env` and `frontend/.env`

## Cost Estimate

- **Supabase**: Free (up to 500MB database)
- **OpenAI GPT-4**: ~$0.01-0.02 per workout parse
- **Web Speech API**: Free (browser-native)

For 20 workouts/month: ~$0.20-0.40 in OpenAI costs.

## Troubleshooting

### "Speech recognition not supported"
→ Use Chrome or Edge (Safari/Firefox don't support Web Speech API)

### "Failed to parse transcript"
→ Check OpenAI API key in `backend/.env`

### "Failed to save workout"
→ Check User ID in `Dashboard.jsx` matches Supabase user

### Backend won't start
→ Verify all values in `backend/.env` are set correctly

**Full troubleshooting guide:** See SETUP_GUIDE.md

## Next Steps After Setup

1. Test voice logging with a simple workout
2. Set up your workout split (insert directly in Supabase for now)
3. Log workouts for a week to see progress charts
4. Consider adding authentication (Supabase Auth)
5. Deploy to production (Vercel for frontend, Railway for backend)

## Need Help?

Read the full setup guide: `SETUP_GUIDE.md`

Happy tracking! 💪
