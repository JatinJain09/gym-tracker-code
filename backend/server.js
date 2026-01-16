require('dotenv').config();
const express = require('express');
const cors = require('cors');

const workoutsRouter = require('./routes/workouts');
const aiRouter = require('./routes/ai');
const exercisesRouter = require('./routes/exercises');
const workoutSplitRouter = require('./routes/workoutSplit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts', workoutsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/workout-split', workoutSplitRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gym Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
