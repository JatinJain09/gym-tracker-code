const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

/**
 * POST /api/workouts
 * Save a new workout
 */
router.post('/', async (req, res) => {
  try {
    const { userId, exerciseName, weightKg, sets, muscleGroup, notes, date } = req.body;

    if (!userId || !exerciseName || !sets || sets.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find or create exercise
    let { data: exercise } = await supabase
      .from('exercises')
      .select('id')
      .eq('name', exerciseName)
      .single();

    if (!exercise) {
      // Create new exercise
      const { data: newExercise, error: createError } = await supabase
        .from('exercises')
        .insert({
          name: exerciseName,
          muscle_group: muscleGroup || 'Unknown',
          aliases: [exerciseName.toLowerCase()],
        })
        .select()
        .single();

      if (createError) throw createError;
      exercise = newExercise;
    }

    // Save workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        exercise_id: exercise.id,
        date: date || new Date().toISOString().split('T')[0],
        weight_kg: weightKg,
        sets: sets,
        notes: notes || '',
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    res.json({ success: true, data: workout });
  } catch (error) {
    console.error('Error in POST /api/workouts:', error);
    res.status(500).json({ error: 'Failed to save workout', details: error.message });
  }
});

/**
 * GET /api/workouts
 * Fetch user's workout history
 */
router.get('/', async (req, res) => {
  try {
    const { userId, limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select(`
        *,
        exercises (
          id,
          name,
          muscle_group
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ success: true, data: workouts });
  } catch (error) {
    console.error('Error in GET /api/workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts', details: error.message });
  }
});

/**
 * GET /api/workouts/progress/:exerciseId
 * Get progress data for a specific exercise
 */
router.get('/progress/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('date, weight_kg, sets')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('date', { ascending: true });

    if (error) throw error;

    // Calculate total reps per workout for visualization
    const progressData = workouts.map(workout => ({
      date: workout.date,
      weight: workout.weight_kg,
      totalReps: workout.sets.reduce((sum, set) => sum + set.reps, 0),
      volume: workout.weight_kg * workout.sets.reduce((sum, set) => sum + set.reps, 0),
    }));

    res.json({ success: true, data: progressData });
  } catch (error) {
    console.error('Error in GET /api/workouts/progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress data', details: error.message });
  }
});

module.exports = router;
