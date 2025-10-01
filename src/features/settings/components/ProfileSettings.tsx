import React, { useState } from 'react';

const ProfileSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: 'Dr. Ahmet',
    lastName: 'Kaya',
    email: 'ahmet.kaya@example.com',
    phone: '+90 532 123 45 67',
    specialty: 'Genel Veteriner Hekim',
    licenseNumber: '12345'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
  };

  return (
    <div className="profile-settings">
      <h2>Profil Ayarları</h2>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="firstName">Ad</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Soyad</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialty">Uzmanlık Alanı</label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="licenseNumber">Lisans Numarası</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
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

export default ProfileSettings; 