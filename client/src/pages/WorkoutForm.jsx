import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { unwrap, errMsg } from '../api';

const empty = { workoutName: '', category: '', duration: '', caloriesBurned: '', workoutDate: '' };

export default function WorkoutForm() {
  const { id } = useParams();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get(`/workouts/${id}`)
      .then((res) => {
        const w = unwrap(res);
        setForm({
          workoutName: w.workoutName,
          category: w.category,
          duration: w.duration,
          caloriesBurned: w.caloriesBurned,
          workoutDate: w.workoutDate?.slice(0, 10),
        });
      })
      .catch((err) => setError(errMsg(err)));
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const body = { ...form, duration: Number(form.duration), caloriesBurned: Number(form.caloriesBurned) };
    try {
      if (id) await api.put(`/workouts/${id}`, body);
      else await api.post('/workouts', body);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{id ? 'Edit Workout' : 'Add Workout'}</h2>
      {error && <p className="error">{error}</p>}
      <input name="workoutName" placeholder="Workout Name" value={form.workoutName} onChange={change} required />
      <input name="category" placeholder="Category (e.g. Running)" value={form.category} onChange={change} required />
      <input name="duration" type="number" min="1" placeholder="Duration (minutes)" value={form.duration} onChange={change} required />
      <input name="caloriesBurned" type="number" min="0" placeholder="Calories Burned" value={form.caloriesBurned} onChange={change} required />
      <input name="workoutDate" type="date" value={form.workoutDate} onChange={change} required />
      <button type="submit">{id ? 'Update' : 'Add'}</button>
    </form>
  );
}