# Gym Tracker - Setup Guide

Welcome to your voice-powered gym tracker! Follow these steps to get everything up and running.

## Prerequisites

- Node.js installed (v18 or later)
- OpenAI API key
- Supabase account (free tier works great)

## Step 1: Set Up Supabase Database

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account)
2. Click "New Project"
3. Fill in project details:
   - Name: `gym-tracker`
   - Database Password: (create a strong password and save it)
   - Region: Choose closest to you
4. Click "Create new project" and wait for it to initialize (~2 minutes)

### Run Database Schema

1. In your Supabase project dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `supabase-schema.sql` from the project root
4. Copy all the SQL code and paste it into the query editor
5. Click "Run" to execute the schema
6. You should see success messages - the database tables are now created!

### Get API Keys

1. Go to **Settings** (gear icon in left sidebar)
2. Click **API** in the Settings menu
3. Copy these two values (you'll need them in Step 2):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJxxxx...` (long JWT token)

### Create a Test User

1. Go to **Authentication** > **Users** (left sidebar)
2. Click "Add User" > "Create new user"
3. Enter email: `test@example.com` and password: `test123456`
4. Click "Create user"
5. **IMPORTANT**: Copy the User ID (UUID) - you'll need this!
   - It looks like: `12345678-1234-1234-1234-123456789abc`

## Step 2: Configure Backend Environment Variables

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

3. Edit `backend/.env` and fill in your credentials:
   ```env
   # OpenAI API Key (get from https://platform.openai.com/api-keys)
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here

   # Supabase Configuration (from Step 1)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJyour-actual-supabase-anon-key-here

   # Server Configuration
   PORT=3001
   ```

4. Save the file

## Step 3: Configure Frontend Environment Variables

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Create `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

3. Edit `frontend/.env` and fill in:
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:3001

   # Supabase Configuration (same as backend)
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJyour-actual-supabase-anon-key-here
   ```

4. Save the file

## Step 4: Update User ID in Frontend

1. Open `frontend/src/pages/Dashboard.jsx`
2. Find line 8: `const [userId] = useState('test-user-123');`
3. Replace `'test-user-123'` with your actual User ID from Supabase (Step 1.3):
   ```javascript
   const [userId] = useState('12345678-1234-1234-1234-123456789abc'); // Your real UUID
   ```
4. Save the file

## Step 5: Start the Application

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

You should see: `Server running on port 3001`

### Terminal 2 - Frontend Server

Open a new terminal window:

```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:5173`

## Step 6: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. You should see the Gym Tracker dashboard
3. Click the microphone button (make sure to allow microphone access)
4. Say: **"Bench press, 40kg, four sets, 8 reps, 6 reps, 6 reps, 5 reps"**
5. Click the microphone again to stop recording
6. Click "Parse Workout" - the AI should extract the workout details
7. Review the parsed data and click "Save Workout"
8. Your workout should appear in the "Recent Workouts" table below!

## Troubleshooting

### Backend won't start

- **Error: Missing Supabase environment variables**
  - Make sure you created `backend/.env` and filled in all values
  - Double-check the `SUPABASE_URL` and `SUPABASE_ANON_KEY`

- **Error: OpenAI API key invalid**
  - Check that your `OPENAI_API_KEY` is correct
  - Make sure it starts with `sk-`
  - Verify the key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Frontend won't connect to backend

- Make sure the backend is running (Terminal 1 shows "Server running")
- Check that `VITE_API_URL=http://localhost:3001` in `frontend/.env`
- Try opening `http://localhost:3001/health` in your browser - should show `{"status":"ok"}`

### Microphone not working

- **Chrome/Edge**: Should work by default (Web Speech API is built-in)
- **Firefox/Safari**: Web Speech API support is limited - use Chrome or Edge
- Check browser permissions: Allow microphone access when prompted

### Parse button does nothing

- Open browser console (F12) to see error messages
- Common issue: OpenAI API key not set or invalid
- Check backend terminal for error logs

### Workouts not saving

- Check User ID: Make sure you updated `Dashboard.jsx` with real UUID from Supabase
- Verify database connection: Check backend logs for Supabase errors
- Ensure Supabase schema was run successfully (Step 1.2)

## Next Steps

### Set Up Your Workout Split

1. You can manually insert workout splits in Supabase SQL Editor:
   ```sql
   INSERT INTO workout_splits (user_id, day_of_week, muscle_groups)
   VALUES
     ('your-user-id-here', 'Monday', ARRAY['Chest', 'Shoulders', 'Triceps']),
     ('your-user-id-here', 'Tuesday', ARRAY['Back', 'Biceps']),
     ('your-user-id-here', 'Wednesday', ARRAY['Legs']),
     ('your-user-id-here', 'Thursday', ARRAY['Shoulders', 'Arms']),
     ('your-user-id-here', 'Friday', ARRAY['Chest', 'Back']);
   ```

2. The AI will use this context when parsing your voice input!

### Explore the Code

- **Backend API**: `backend/routes/` - REST endpoints
- **AI Parsing**: `backend/services/openai.js` - GPT-4 integration
- **Voice Input**: `frontend/src/components/VoiceInput.jsx` - Recording UI
- **Speech Recognition**: `frontend/src/hooks/useSpeechRecognition.js` - Web Speech API

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [GitHub Repository](https://github.com/JatinJain09/gym-tracker-code)

## Support

If you run into issues:
1. Check the troubleshooting section above
2. Review backend terminal logs for errors
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly

Happy tracking!
