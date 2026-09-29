import { useState } from 'react';
import api, { unwrap, errMsg } from '../api';

const toText = (d) => {
  if (typeof d === 'string') return d;
  return d?.recommendation || d?.insights || d?.insight || d?.text || d?.response || JSON.stringify(d, null, 2);
};

export default function AIPage() {
  const [rec, setRec] = useState({ age: '', fitnessGoal: '', experience: 'Beginner' });
  const [ins, setIns] = useState({ totalWorkouts: '', averageDuration: '', totalCaloriesBurned: '' });
  const [recResult, setRecResult] = useState('');
  const [insResult, setInsResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const getRec = async (e) => {
    e.preventDefault();
    setError(''); setRecResult(''); setLoading('rec');
    try {
      const res = await api.post('/ai/workout-recommendation', { ...rec, age: Number(rec.age) });
      setRecResult(toText(unwrap(res)));
    } catch (err) { setError(errMsg(err)); }
    setLoading('');
  };

  const getIns = async (e) => {
    e.preventDefault();
    setError(''); setInsResult(''); setLoading('ins');
    try {
      const res = await api.post('/ai/fitness-insights', {
        totalWorkouts: Number(ins.totalWorkouts),
        averageDuration: Number(ins.averageDuration),
        totalCaloriesBurned: Number(ins.totalCaloriesBurned),
      });
      setInsResult(toText(unwrap(res)));
    } catch (err) { setError(errMsg(err)); }
    setLoading('');
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}

      <form className="card" onSubmit={getRec}>
        <h2>Workout Recommendation</h2>
        <input type="number" placeholder="Age" value={rec.age} onChange={(e) => setRec({ ...rec, age: e.target.value })} required />
        <input placeholder="Fitness Goal (e.g. Weight Loss)" value={rec.fitnessGoal} onChange={(e) => setRec({ ...rec, fitnessGoal: e.target.value })} required />
        <select value={rec.experience} onChange={(e) => setRec({ ...rec, experience: e.target.value })}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button type="submit" disabled={loading === 'rec'}>{loading === 'rec' ? 'Thinking...' : 'Get Recommendation'}</button>
        {recResult && <pre className="result">{recResult}</pre>}
      </form>

      <form className="card" onSubmit={getIns}>
        <h2>Fitness Insights</h2>
        <input type="number" placeholder="Total Workouts" value={ins.totalWorkouts} onChange={(e) => setIns({ ...ins, totalWorkouts: e.target.value })} required />
        <input type="number" placeholder="Average Duration (min)" value={ins.averageDuration} onChange={(e) => setIns({ ...ins, averageDuration: e.target.value })} required />
        <input type="number" placeholder="Total Calories Burned" value={ins.totalCaloriesBurned} onChange={(e) => setIns({ ...ins, totalCaloriesBurned: e.target.value })} required />
        <button type="submit" disabled={loading === 'ins'}>{loading === 'ins' ? 'Thinking...' : 'Get Insights'}</button>
        {insResult && <pre className="result">{insResult}</pre>}
      </form>
    </div>
  );
}