import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const token = res.data.token ?? res.data.data?.token;
      if (!token) throw new Error('Token not found in response');
      login(token);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
      <button type="submit">Login</button>
      <p>New user? <Link to="/register">Register</Link></p>
    </form>
  );
}