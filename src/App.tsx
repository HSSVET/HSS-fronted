import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './shared';
import { Dashboard } from './features/dashboard';
import { AnimalPage, AnimalDetailPage } from './features/animals';
import { AppointmentPage } from './features/appointments';
import { LabDashboard, LabTestTypes } from './features/laboratory';
import { Billing } from './features/billing';
import { 
  ReportsPage, 
  AnimalReports, 
  AppointmentReports, 
  FinancialReports 
} from './features/reports';
import { 
  SettingsPage, 
  ProfileSettings, 
  ClinicSettings, 
  UserSettings 
} from './features/settings';
import { 
  InventoryPage, 
  MedicineStock, 
  SuppliesStock 
} from './features/inventory';
import './shared/styles/App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Animals */}
          <Route path="/animals" element={<AnimalPage />} />
          <Route path="/animals/add" element={<div>Yeni Hayvan Ekle Sayfası (Yakında)</div>} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />

          {/* Appointments */}
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/appointments/calendar" element={<div>Takvim Görünümü (Yakında)</div>} />
          <Route path="/appointments/list" element={<div>Randevu Listesi (Yakında)</div>} />
          <Route path="/appointments/add" element={<div>Yeni Randevu Ekle (Yakında)</div>} />
          <Route path="/appointments/:id" element={<div>Randevu Detayı (Yakında)</div>} />
          <Route path="/appointments/:id/edit" element={<div>Randevu Düzenle (Yakında)</div>} />

          {/* Laboratory */}
          <Route path="/laboratory" element={<LabDashboard />} />
          <Route path="/laboratory/test-types" element={<LabTestTypes />} />
          <Route path="/laboratory/tests" element={<div>Test Listesi (Yakında)</div>} />
          <Route path="/laboratory/tests/add" element={<div>Yeni Test Ekle (Yakında)</div>} />
          <Route path="/laboratory/tests/:id" element={<div>Test Detayı (Yakında)</div>} />

          {/* Billing */}
          <Route path="/billing" element={<Billing />} />
          <Route path="/billing/invoices" element={<div>Fatura Listesi (Yakında)</div>} />
          <Route path="/billing/invoices/add" element={<div>Yeni Fatura Oluştur (Yakında)</div>} />
          <Route path="/billing/invoices/:id" element={<div>Fatura Detayı (Yakında)</div>} />
          <Route path="/billing/payments" element={<div>Ödeme Listesi (Yakında)</div>} />
          <Route path="/billing/payments/add" element={<div>Yeni Ödeme Ekle (Yakında)</div>} />
          <Route path="/billing/reports" element={<div>Fatura Raporları (Yakında)</div>} />

          {/* Reports */}
          <Route path="/reports" element={<ReportsPage />}>
            <Route index element={<Navigate to="/reports/animals" replace />} />
            <Route path="animals" element={<AnimalReports />} />
            <Route path="appointments" element={<AppointmentReports />} />
            <Route path="financial" element={<FinancialReports />} />
          </Route>

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="/settings/profile" replace />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="clinic" element={<ClinicSettings />} />
            <Route path="users" element={<UserSettings />} />
          </Route>

          {/* Inventory */}
          <Route path="/inventory" element={<InventoryPage />}>
            <Route index element={<Navigate to="/inventory/medicines" replace />} />
            <Route path="medicines" element={<MedicineStock />} />
            <Route path="supplies" element={<SuppliesStock />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
