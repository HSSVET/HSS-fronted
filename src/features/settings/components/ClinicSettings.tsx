import React, { useState } from 'react';

const ClinicSettings: React.FC = () => {
  const [clinicData, setClinicData] = useState({
    name: 'Veteriner Klinik',
    address: 'Örnek Mahalle, Veteriner Sok. No: 1',
    city: 'İstanbul',
    phone: '+90 212 123 45 67',
    email: 'info@veterinerklinik.com',
    workingHours: '09:00 - 18:00',
    emergencyPhone: '+90 532 987 65 43'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClinicData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Clinic settings updated:', clinicData);
  };

  return (
    <div className="clinic-settings">
      <h2>Klinik Ayarları</h2>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="name">Klinik Adı</label>
          <input
            type="text"
            id="name"
            name="name"
            value={clinicData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Adres</label>
          <textarea
            id="address"
            name="address"
            value={clinicData.address}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Şehir</label>
          <input
            type="text"
            id="city"
            name="city"
            value={clinicData.city}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={clinicData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            value={clinicData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="workingHours">Çalışma Saatleri</label>
          <input
            type="text"
            id="workingHours"
            name="workingHours"
            value={clinicData.workingHours}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="emergencyPhone">Acil Durum Telefonu</label>
          <input
            type="tel"
            id="emergencyPhone"
            name="emergencyPhone"
            value={clinicData.emergencyPhone}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="save-button">
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default ClinicSettings; 