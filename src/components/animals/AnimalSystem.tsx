import * as React from 'react';
import { useState } from 'react';
import type { JSX } from 'react';
import { Box, Button } from '@mui/material';
import AnimalList from './AnimalList';
import AddAnimalDialog from './AddAnimalDialog';
import '../../styles/components/AnimalSystem.css';

function AnimalSystem(): React.ReactElement {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddAnimal = (animal: {
    name: string;
    species: string;
    breed: string;
    health: string;
    lastCheckup: string;
    owner: string;
    nextVaccine: string;
  }) => {
    // Yeni hayvan eklendi, dialog'u kapat
    setIsAddDialogOpen(false);
    console.log('Yeni hayvan eklendi:', animal);
  };

  return (
    <div className="animal-system">
      <div className="animal-system-container">
        <div className="animal-system-header">
          <div>
            <h1 className="animal-system-title">Hayvan Listesi</h1>
            <p className="animal-system-subtitle">Hasta hayvanları yönetin ve kayıtlarını takip edin</p>
          </div>
          <div className="quick-actions">
            <button 
              className="action-button"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Yeni Hayvan
            </button>
          </div>
        </div>
        
        <div className="content-section">
          <AnimalList />
        </div>
      </div>
      
      <AddAnimalDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddAnimal}
      />
    </div>
  );
}

export default AnimalSystem; 