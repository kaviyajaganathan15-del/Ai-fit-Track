import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutForm from './pages/WorkoutForm';
import AIPage from './pages/AIPage';

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <h3>FitTrack AI</h3>
      <div>
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/workout/new">Add Workout</Link>
            <Link to="/ai">AI</Link>
            <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/workout/new" element={<Protected><WorkoutForm /></Protected>} />
          <Route path="/workout/:id/edit" element={<Protected><WorkoutForm /></Protected>} />
          <Route path="/ai" element={<Protected><AIPage /></Protected>} />
        </Routes>
      </div>
    </>
  );
}
