import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Parsing
export const parseWorkoutTranscript = async (transcript, userId) => {
  const response = await api.post('/api/ai/parse', { transcript, userId });
  return response.data;
};

// Workouts
export const saveWorkout = async (workoutData) => {
  const response = await api.post('/api/workouts', workoutData);
  return response.data;
};

export const getWorkouts = async (userId, limit = 50, offset = 0) => {
  const response = await api.get('/api/workouts', {
    params: { userId, limit, offset },
  });
  return response.data;
};

export const getProgressData = async (exerciseId, userId) => {
  const response = await api.get(`/api/workouts/progress/${exerciseId}`, {
    params: { userId },
  });
  return response.data;
};

// Exercises
export const getExercises = async () => {
  const response = await api.get('/api/exercises');
  return response.data;
};

// Workout Split
export const saveWorkoutSplit = async (userId, splits) => {
  const response = await api.post('/api/workout-split', { userId, splits });
  return response.data;
};

export const getWorkoutSplit = async (userId) => {
  const response = await api.get('/api/workout-split', {
    params: { userId },
  });
  return response.data;
};

export default api;
