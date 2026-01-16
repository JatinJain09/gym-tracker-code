const express = require('express');
const router = express.Router();
const { parseWorkoutTranscript } = require('../services/openai');
const supabase = require('../services/supabase');

/**
 * POST /api/ai/parse
 * Parse voice transcript into structured workout data
 */
router.post('/parse', async (req, res) => {
  try {
    const { transcript, userId } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // Fetch user context (workout split and recent exercises)
    const context = {};

    if (userId) {
      // Get today's workout split
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const { data: workoutSplit } = await supabase
        .from('workout_splits')
        .select('*')
        .eq('user_id', userId)
        .eq('day_of_week', today)
        .single();

      context.workoutSplit = workoutSplit || {};

      // Get recent exercises (last 5)
      const { data: recentExercises } = await supabase
        .from('workouts')
        .select('exercise_id, exercises(name), weight_kg, sets')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      context.recentExercises = recentExercises || [];
    }

    // Parse transcript with AI
    const parsedData = await parseWorkoutTranscript(transcript, context);

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error in /api/ai/parse:', error);
    res.status(500).json({ error: 'Failed to parse transcript', details: error.message });
  }
});

module.exports = router;
