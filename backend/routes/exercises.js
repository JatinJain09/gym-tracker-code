const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

/**
 * GET /api/exercises
 * Get all exercises from the library
 */
router.get('/', async (req, res) => {
  try {
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: exercises });
  } catch (error) {
    console.error('Error in GET /api/exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises', details: error.message });
  }
});

module.exports = router;
