import { useState, useEffect } from 'react';
import { getWorkouts } from '../services/api';

const WorkoutList = ({ userId, refreshTrigger }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, [userId, refreshTrigger]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const result = await getWorkouts(userId, 20);
      setWorkouts(result.data || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading workouts...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No workouts logged yet. Start by recording your first workout!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Recent Workouts</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exercise</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sets</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Reps</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workouts.map((workout) => {
              const totalReps = workout.sets.reduce((sum, set) => sum + set.reps, 0);
              const volume = workout.weight_kg * totalReps;

              return (
                <tr key={workout.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(workout.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{workout.exercises?.name}</div>
                      <div className="text-xs text-gray-500">{workout.exercises?.muscle_group}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {workout.weight_kg} kg
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {workout.sets.map((set, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {set.reps}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {totalReps}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {volume.toFixed(0)} kg
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutList;
