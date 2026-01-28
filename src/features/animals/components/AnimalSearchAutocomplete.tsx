import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { Pets } from '@mui/icons-material';
import { animalService, type AnimalRecord } from '../services/animalService';

interface AnimalSearchAutocompleteProps {
  value: AnimalRecord | null;
  onSelect: (animal: AnimalRecord | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  error?: boolean;
  errorText?: string;
}

// Debounce utility function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const AnimalSearchAutocomplete: React.FC<AnimalSearchAutocompleteProps> = ({
  value,
  onSelect,
  label = 'Hasta Seç',
  placeholder = 'Hasta adı, sahip adı veya mikroçip numarası ile arayın...',
  required = false,
  helperText = 'Hastanın adını, sahibinin adını veya mikroçip numarasını yazın',
  error = false,
  errorText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<AnimalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchAnimals = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await animalService.searchAnimals(query.trim());
      if (response.success && response.data) {
        setOptions(response.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error searching animals:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all animals when autocomplete opens with empty search
  const loadAllAnimals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await animalService.getAllAnimals();
      if (response.success && response.data) {
        setOptions(response.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error loading animals:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchAnimals(debouncedSearchTerm);
    } else if (open && options.length === 0) {
      // Load all animals when opening with no search term
      loadAllAnimals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, open, searchAnimals, loadAllAnimals]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      onChange={(_, newValue) => {
        onSelect(newValue);
      }}
      inputValue={searchTerm}
      onInputChange={(_, newInputValue) => {
        setSearchTerm(newInputValue);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => {
        const ownerName = option.owner?.name || option.owner?.fullName || 'Bilinmeyen Sahip';
        const microchip = option.microchipNumber ? ` - ${option.microchipNumber}` : '';
        return `${option.name} (${ownerName})${microchip}`;
      }}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Pets sx={{ color: 'primary.main', fontSize: 20 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {option.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              Sahip: {option.owner?.name || option.owner?.fullName || 'Bilinmeyen'}
              {option.species?.name && ` • ${option.species.name}`}
              {option.breed?.name && ` • ${option.breed.name}`}
              {option.microchipNumber && ` • Çip: ${option.microchipNumber}`}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={error ? errorText : helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText={
        searchTerm.length < 2
          ? 'En az 2 karakter girin'
          : 'Eşleşen hasta bulunamadı'
      }
    />
  );
};

export default AnimalSearchAutocomplete;
