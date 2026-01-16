const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

/**
 * POST /api/workout-split
 * Save user's workout split
 */
router.post('/', async (req, res) => {
  try {
    const { userId, splits } = req.body;

    if (!userId || !splits || !Array.isArray(splits)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Delete existing splits for this user
    await supabase
      .from('workout_splits')
      .delete()
      .eq('user_id', userId);

    // Insert new splits
    const splitsToInsert = splits.map(split => ({
      user_id: userId,
      day_of_week: split.day,
      muscle_groups: split.muscleGroups,
    }));

    const { data, error } = await supabase
      .from('workout_splits')
      .insert(splitsToInsert)
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/workout-split:', error);
    res.status(500).json({ error: 'Failed to save workout split', details: error.message });
  }
});

/**
 * GET /api/workout-split
 * Get user's workout split
 */
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data: splits, error } = await supabase
      .from('workout_splits')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: splits });
  } catch (error) {
    console.error('Error in GET /api/workout-split:', error);
    res.status(500).json({ error: 'Failed to fetch workout split', details: error.message });
  }
});

module.exports = router;
