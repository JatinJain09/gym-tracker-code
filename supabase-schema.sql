-- Users table (Supabase Auth handles this, but we'll reference it)

-- Exercises table (reference data for common gym exercises)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  aliases TEXT[] DEFAULT '{}',
  muscle_group TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout splits table (user's weekly workout schedule)
CREATE TABLE IF NOT EXISTS workout_splits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  muscle_groups TEXT[] NOT NULL, -- ['Chest', 'Shoulders', 'Triceps']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_of_week)
);

-- Workouts table (logged workout sessions)
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(6, 2),
  sets JSONB NOT NULL, -- [{"set_number": 1, "reps": 8}, {"set_number": 2, "reps": 6}]
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_exercise_id ON workouts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workout_splits_user_id ON workout_splits(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Policies for exercises (public read, admin write)
CREATE POLICY "Exercises are viewable by everyone" ON exercises
  FOR SELECT USING (true);

-- Policies for workout_splits (users can only read/write their own)
CREATE POLICY "Users can view their own workout splits" ON workout_splits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout splits" ON workout_splits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout splits" ON workout_splits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout splits" ON workout_splits
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for workouts (users can only read/write their own)
CREATE POLICY "Users can view their own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Insert some common exercises
INSERT INTO exercises (name, aliases, muscle_group, description) VALUES
  ('Bench Press', ARRAY['bench', 'flat bench', 'barbell bench'], 'Chest', 'Barbell bench press on flat bench'),
  ('Incline Bench Press', ARRAY['incline bench', 'incline'], 'Chest', 'Barbell bench press on incline bench'),
  ('Squat', ARRAY['squat', 'barbell squat', 'back squat'], 'Legs', 'Barbell back squat'),
  ('Deadlift', ARRAY['deadlift', 'dl'], 'Back', 'Conventional deadlift'),
  ('Overhead Press', ARRAY['ohp', 'overhead press', 'military press'], 'Shoulders', 'Standing barbell overhead press'),
  ('Barbell Row', ARRAY['rows', 'barbell row', 'bent over row'], 'Back', 'Bent over barbell row'),
  ('Pull-ups', ARRAY['pull ups', 'pullups', 'pull up'], 'Back', 'Bodyweight pull-ups'),
  ('Lat Pulldown', ARRAY['lat pulldown', 'pulldown'], 'Back', 'Lat pulldown machine'),
  ('Shoulder Press', ARRAY['shoulder press', 'dumbbell press'], 'Shoulders', 'Seated dumbbell shoulder press'),
  ('Dumbbell Curl', ARRAY['curls', 'bicep curl', 'db curl'], 'Biceps', 'Standing dumbbell bicep curl'),
  ('Tricep Dips', ARRAY['dips', 'tricep dips'], 'Triceps', 'Bodyweight tricep dips'),
  ('Leg Press', ARRAY['leg press'], 'Legs', 'Leg press machine'),
  ('Romanian Deadlift', ARRAY['rdl', 'romanian deadlift'], 'Legs', 'Romanian deadlift'),
  ('Leg Curl', ARRAY['leg curl', 'hamstring curl'], 'Legs', 'Lying leg curl machine'),
  ('Leg Extension', ARRAY['leg extension'], 'Legs', 'Leg extension machine'),
  ('Calf Raises', ARRAY['calf raises', 'calves'], 'Legs', 'Standing calf raises'),
  ('Cable Flyes', ARRAY['cable flyes', 'flyes', 'chest flyes'], 'Chest', 'Cable chest flyes'),
  ('Face Pulls', ARRAY['face pulls'], 'Shoulders', 'Cable face pulls'),
  ('Lateral Raises', ARRAY['lateral raises', 'side raises'], 'Shoulders', 'Dumbbell lateral raises')
ON CONFLICT (name) DO NOTHING;
