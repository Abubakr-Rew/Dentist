import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Clinics from './pages/Clinics';
import ClinicProfile from './pages/ClinicProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import ClinicDashboard from './pages/ClinicDashboard';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import NotFound from './pages/NotFound';

function ProtectedRoute({ role, children }: { role?: string; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/clinics/:id" element={<ClinicProfile />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
