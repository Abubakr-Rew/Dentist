import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Clinics from './pages/Clinics';
import ClinicProfile from './pages/ClinicProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import ClinicDashboard from './pages/ClinicDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/clinics/:id" element={<ClinicProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
