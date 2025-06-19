import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './shared';
import { Dashboard } from './features/dashboard';
import { AnimalPage, AnimalDetailPage } from './features/animals';
import { AppointmentPage } from './features/appointments';
import { LabDashboard, LabTestTypes } from './features/laboratory';
import { Billing } from './features/billing';
import './shared/styles/App.css';

function App() {
  return (
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
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<div>Envanter/Stok Sayfası (Yakında)</div>} />
          <Route path="/reports" element={<div>Raporlar Sayfası (Yakında)</div>} />
          <Route path="/settings" element={<div>Ayarlar Sayfası (Yakında)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
