import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { unwrap, errMsg } from '../api';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState({ name: '', category: '', date: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/workouts');
      const data = unwrap(res);
      setWorkouts(Array.isArray(data) ? data : data.workouts || []);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  useEffect(() => { load(); }, []);

  const doSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      Object.entries(search).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await api.get('/workouts/search', { params });
      const data = unwrap(res);
      setWorkouts(Array.isArray(data) ? data : data.workouts || []);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div>
      <h2>My Workouts</h2>
      {error && <p className="error">{error}</p>}

      <form className="row" onSubmit={doSearch}>
        <input placeholder="Name" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
        <input placeholder="Category" value={search.category} onChange={(e) => setSearch({ ...search, category: e.target.value })} />
        <input type="date" value={search.date} onChange={(e) => setSearch({ ...search, date: e.target.value })} />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setSearch({ name: '', category: '', date: '' }); load(); }}>Reset</button>
      </form>

      {workouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Duration (min)</th><th>Calories</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w._id}>
                <td>{w.workoutName}</td>
                <td>{w.category}</td>
                <td>{w.duration}</td>
                <td>{w.caloriesBurned}</td>
                <td>{w.workoutDate?.slice(0, 10)}</td>
                <td>
                  <Link to={`/workout/${w._id}/edit`}>Edit</Link>{' '}
                  <button onClick={() => remove(w._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}