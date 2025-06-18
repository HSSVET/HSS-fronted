import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import AnimalPage from './components/animals/AnimalPage';
import AnimalDetailPage from './components/animals/AnimalDetailPage';
import AppointmentPage from './components/appointments/AppointmentPage';
import LabDashboard from './components/laboratory/LabDashboard';
import LabTestTypes from './components/laboratory/LabTestTypes';
import './styles/globals/App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/animals" element={<AnimalPage />} />
            <Route path="/animals/:id" element={<AnimalDetailPage />} />
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route path="/laboratory" element={<LabDashboard />} />
            <Route path="/laboratory/test-types" element={<LabTestTypes />} />
            <Route path="/inventory" element={<div>Envanter/Stok Sayfası (Yakında)</div>} />
            <Route path="/reports" element={<div>Raporlar Sayfası (Yakında)</div>} />
            <Route path="/settings" element={<div>Ayarlar Sayfası (Yakında)</div>} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
