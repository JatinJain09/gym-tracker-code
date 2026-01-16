import { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { parseWorkoutTranscript, saveWorkout } from '../services/api';

const VoiceInput = ({ userId, onWorkoutSaved }) => {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isSupported) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Speech recognition is not supported in your browser. Please use Chrome or Edge.</p>
      </div>
    );
  }

  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      setError(null);
      setParsedData(null);
      setSuccessMessage('');
      startListening();
    }
  };

  const handleParse = async () => {
    if (!transcript.trim()) {
      setError('No transcript to parse');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await parseWorkoutTranscript(transcript, userId);
      setParsedData(result.data);
    } catch (err) {
      console.error('Error parsing transcript:', err);
      setError('Failed to parse workout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!parsedData) return;

    setIsProcessing(true);
    setError(null);

    try {
      await saveWorkout({
        userId,
        exerciseName: parsedData.exercise,
        weightKg: parsedData.weight_kg,
        sets: parsedData.sets,
        muscleGroup: parsedData.muscle_group,
        notes: parsedData.notes || '',
      });

      setSuccessMessage(`Workout saved: ${parsedData.exercise}`);

      // Reset form
      setTimeout(() => {
        resetTranscript();
        setParsedData(null);
        setSuccessMessage('');
        if (onWorkoutSaved) onWorkoutSaved();
      }, 2000);
    } catch (err) {
      console.error('Error saving workout:', err);
      setError('Failed to save workout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSet = (index, field, value) => {
    const newSets = [...parsedData.sets];
    newSets[index] = { ...newSets[index], [field]: parseInt(value) || 0 };
    setParsedData({ ...parsedData, sets: newSets });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Voice Input</h2>

      {/* Microphone Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleToggleListen}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isProcessing}
        >
          {isListening ? (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mb-4">
        {isListening ? 'Listening... Click to stop' : 'Click to start recording'}
      </p>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Transcript:</label>
          <div className="bg-gray-100 p-3 rounded border border-gray-300">
            <p className="text-gray-800">{transcript}</p>
          </div>
          {!parsedData && (
            <button
              onClick={handleParse}
              disabled={isProcessing}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isProcessing ? 'Parsing...' : 'Parse Workout'}
            </button>
          )}
        </div>
      )}

      {/* Parsed Data Preview */}
      {parsedData && (
        <div className="mb-4 bg-blue-50 p-4 rounded border border-blue-200">
          <h3 className="font-bold text-lg mb-2">Parsed Workout</h3>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Exercise:</label>
            <p className="text-gray-900">{parsedData.exercise}</p>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Weight (kg):</label>
            <input
              type="number"
              value={parsedData.weight_kg}
              onChange={(e) => setParsedData({ ...parsedData, weight_kg: parseFloat(e.target.value) })}
              className="w-24 px-2 py-1 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sets:</label>
            {parsedData.sets.map((set, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <span className="w-16">Set {set.set_number}:</span>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleEditSet(index, 'reps', e.target.value)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
                <span>reps</span>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Muscle Group:</label>
            <p className="text-gray-900">{parsedData.muscle_group}</p>
          </div>

          <button
            onClick={handleSaveWorkout}
            disabled={isProcessing}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {isProcessing ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
