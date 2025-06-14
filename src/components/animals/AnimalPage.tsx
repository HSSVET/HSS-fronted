import React from 'react';
import AnimalList from './AnimalList';

const AnimalPage: React.FC = () => {
  const handleAddAnimal = () => {
    console.log('Yeni hayvan ekle');
    // Buraya yeni hayvan ekleme mantığı gelecek
  };

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <AnimalList onAddAnimal={handleAddAnimal} />
    </div>
  );
};

export default AnimalPage; 