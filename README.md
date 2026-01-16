# Gym Tracker - Voice-Powered Workout Tracking

A voice-enabled gym tracker that uses AI to intelligently understand and log your workouts. Just speak your workout details, and the app parses and saves everything automatically.

## Features

- Voice input using Web Speech API (browser-native)
- AI-powered workout parsing with GPT-4 (understands "bench" = "Bench Press")
- Context-aware: knows your workout split and recent exercises
- Progress tracking with charts and graphs
- Cloud storage with Supabase (PostgreSQL)
- Mobile-friendly interface

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Recharts
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 API
- **Voice**: Web Speech API

## Setup Instructions

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor and run the schema from `supabase-schema.sql`
4. Go to Project Settings > API to get:
   - Project URL (`SUPABASE_URL`)
   - Anon/Public Key (`SUPABASE_ANON_KEY`)

### 2. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys:
# - OPENAI_API_KEY (your OpenAI API key)
# - SUPABASE_URL (from Supabase dashboard)
# - SUPABASE_ANON_KEY (from Supabase dashboard)

# Install dependencies (already done)
npm install

# Start the server
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Copy environment template
cp .env.example .env

# Edit .env and add:
# - VITE_API_URL=http://localhost:3001
# - VITE_SUPABASE_URL (same as backend)
# - VITE_SUPABASE_ANON_KEY (same as backend)

# Install dependencies (already done)
npm install

# Start the dev server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Authentication Setup (Supabase)

For now, you can create a test user directly in Supabase:
1. Go to Authentication > Users in Supabase dashboard
2. Click "Add User" and create a test account
3. Copy the User ID (UUID) to use in API requests

## How to Use

### 1. Set Up Your Workout Split

Navigate to the Workout Split section and configure your weekly schedule:
- Monday: Chest, Shoulders, Triceps
- Tuesday: Back, Biceps
- etc.

### 2. Log a Workout with Voice

1. Click the microphone button
2. Say something like: "Bench press, 40kg, four sets, 8 reps, 6 reps, 6 reps, 5 reps"
3. The AI will parse it into structured data
4. Review and save

### 3. View Your Progress

- Dashboard shows today's workouts
- Workout history table shows all past sessions
- Progress charts show strength gains over time

## Voice Input Examples

### Complete Input
"Bench press, 40 kilograms, first set 8 reps, second set 6 reps, third set 6 reps"

### Abbreviated Input
"Bench, 40kg, 8, 6, 6"

### Using Aliases
"Bench" → AI understands this means "Bench Press"

### Shorthand
"Shoulder press, 20kg, three sets, 10 reps each"

## API Endpoints

### AI Parsing
- `POST /api/ai/parse` - Parse voice transcript

### Workouts
- `POST /api/workouts` - Save workout
- `GET /api/workouts?userId=xxx` - Get workout history
- `GET /api/workouts/progress/:exerciseId?userId=xxx` - Get progress data

### Exercises
- `GET /api/exercises` - Get exercise library

### Workout Split
- `POST /api/workout-split` - Save workout split
- `GET /api/workout-split?userId=xxx` - Get workout split

## Project Structure

```
Gym Tracker/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── ai.js
│   │   ├── workouts.js
│   │   ├── exercises.js
│   │   └── workoutSplit.js
│   ├── services/
│   │   ├── openai.js
│   │   └── supabase.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── WorkoutList.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   └── WorkoutSplitSetup.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/
│   │   │   └── useSpeechRecognition.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── .env
└── supabase-schema.sql
```

## Development

### Start Both Servers

Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

## Future Enhancements

- Voice feedback after logging
- Progressive overload recommendations
- PR (Personal Record) detection
- Workout templates and programs
- Social features
- Mobile app (React Native)
- Offline mode with sync

## License

MIT
