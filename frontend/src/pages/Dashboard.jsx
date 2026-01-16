import { useState } from 'react';
import VoiceInput from '../components/VoiceInput';
import WorkoutList from '../components/WorkoutList';

const Dashboard = () => {
  // For MVP, we'll use a hardcoded user ID
  // In production, this would come from authentication
  const [userId] = useState('test-user-123');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutSaved = () => {
    // Trigger refresh of workout list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Gym Tracker</h1>
          <p className="text-gray-600">Voice-powered workout tracking</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User ID Notice */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Setup Required:</strong> Using test user ID. Please set up Supabase authentication and update the user ID in the code.
            <br />
            <span className="text-xs">Current User ID: {userId}</span>
          </p>
        </div>

        {/* Voice Input Section */}
        <div className="mb-8">
          <VoiceInput userId={userId} onWorkoutSaved={handleWorkoutSaved} />
        </div>

        {/* Workout List Section */}
        <div className="mb-8">
          <WorkoutList userId={userId} refreshTrigger={refreshTrigger} />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click the microphone button to start recording</li>
            <li>Say your workout details, for example: "Bench press, 40kg, four sets, 8 reps, 6 reps, 6 reps, 5 reps"</li>
            <li>Click the microphone again to stop recording</li>
            <li>Click "Parse Workout" to process your input with AI</li>
            <li>Review the parsed data and edit if needed</li>
            <li>Click "Save Workout" to log it</li>
          </ol>

          <div className="mt-4 pt-4 border-t border-blue-300">
            <h3 className="font-semibold mb-2">Voice Input Examples:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>"Bench press, 40 kilograms, first set 8 reps, second set 6 reps"</li>
              <li>"Bench, 40kg, 8, 6, 6" (shorthand)</li>
              <li>"Shoulder press, 20kg, three sets, 10 reps each"</li>
              <li>"Deadlift, 100kg, 5, 5, 5, 5"</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
