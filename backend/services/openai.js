const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse workout transcript using GPT-4
 * @param {string} transcript - The voice transcript
 * @param {object} context - User context (workout split, recent exercises)
 * @returns {Promise<object>} Parsed workout data
 */
async function parseWorkoutTranscript(transcript, context = {}) {
  const { workoutSplit = {}, recentExercises = [] } = context;

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

  const systemPrompt = `You are a gym workout assistant. Parse voice input into structured workout data.

Context:
- Today is ${today.toISOString().split('T')[0]}, ${dayOfWeek}
- User's workout split for today: ${JSON.stringify(workoutSplit)}
- User's recent exercises: ${JSON.stringify(recentExercises)}

Task: Extract workout data from the transcript.

Expected Output (JSON):
{
  "exercise": "Bench Press",
  "weight_kg": 40,
  "sets": [
    {"set_number": 1, "reps": 8},
    {"set_number": 2, "reps": 6}
  ],
  "muscle_group": "Chest",
  "notes": ""
}

Rules:
- Recognize exercise aliases (e.g., "bench" → "Bench Press", "pull ups" → "Pull-ups")
- Infer muscle group from exercise
- If weight unit not specified, assume kg
- Number sets sequentially starting from 1
- If user says "same weight" or doesn't mention weight, use the weight from their most recent workout for this exercise
- Parse natural language like "first set 8 reps, second set 6 reps, third set 6 reps" correctly
- Parse shorthand like "8, 6, 6" as 3 sets with those rep counts
- Common exercise mappings:
  - "bench" → "Bench Press"
  - "squat" → "Barbell Squat"
  - "deadlift" → "Deadlift"
  - "ohp" or "overhead press" → "Overhead Press"
  - "rows" → "Barbell Row"
  - "pull ups" or "pullups" → "Pull-ups"
  - "lat pulldown" → "Lat Pulldown"
  - "shoulder press" → "Shoulder Press"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Transcript: "${transcript}"` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const parsedData = JSON.parse(response.choices[0].message.content);
    return parsedData;
  } catch (error) {
    console.error('Error parsing workout transcript:', error);
    throw new Error('Failed to parse workout transcript');
  }
}

module.exports = {
  parseWorkoutTranscript,
};
