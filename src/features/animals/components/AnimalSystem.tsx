import * as React from 'react';
import { useState } from 'react';
import type { JSX } from 'react';
import { Box, Button } from '@mui/material';
import AnimalList from './AnimalList';
import AddAnimalDialog from './AddAnimalDialog';
import { useAnimals } from '../hooks/useAnimals';
import { useError } from '../../../context/ErrorContext';
import '../styles/AnimalSystem.css';

function AnimalSystem(): React.ReactElement {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { createAnimal } = useAnimals({ autoFetch: false });
  const { addError, showSuccess } = useError();

  const handleAddAnimal = async (animal: {
    ownerId: number;
    name: string;
    speciesId: number;
    breedId: number;
    gender?: string;
    birthDate?: string;
    weight?: number;
    color?: string;
    microchipNo?: string;
    allergies?: string;
    chronicDiseases?: string;
    notes?: string;
  }) => {
    try {
      const ok = await createAnimal(animal);
      if (ok) {
        setIsAddDialogOpen(false);
        showSuccess('Hayvan başarıyla eklendi');
        
        // Custom event dispatch et - AnimalList'i yenilemek için
        window.dispatchEvent(new CustomEvent('animalAdded'));
      } else {
        // Hata zaten gösterilmiş, dialog açık kalacak
        console.error('Hayvan eklenemedi');
      }
    } catch (err) {
      console.error('Hayvan ekleme hatası:', err);
      addError('Hayvan eklenirken bir hata oluştu', 'error', err instanceof Error ? err.message : 'Bilinmeyen hata');
      throw err; // AddAnimalDialog'a hata bildirmek için
    }
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