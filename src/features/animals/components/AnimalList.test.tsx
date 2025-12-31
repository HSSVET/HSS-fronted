import React from 'react';
import { render, screen, waitFor } from '../../../test-utils/testUtils';
import AnimalList from './AnimalList';
import * as animalService from '../services/animalService';

// Mock the animal service
jest.mock('../services/animalService');
jest.mock('../../../hooks/useLoading', () => ({
  useLoading: () => ({
    loading: { isLoading: false },
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
  }),
}));

jest.mock('../../../context/ErrorContext', () => ({
  useError: () => ({
    addError: jest.fn(),
    showSuccess: jest.fn(),
  }),
}));

describe('AnimalList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render animal list', async () => {
    // Mock API response
    const mockAnimals = {
      success: true,
      data: {
        items: [
          {
            id: 1,
            name: 'Test Animal 1',
            species: { name: 'Kedi' },
            breed: { name: 'Tekir' },
            owner: { firstName: 'Test', lastName: 'Owner' },
            birthDate: '2022-01-01',
            gender: 'MALE',
          },
        ],
        total: 1,
        totalPages: 1,
      },
      status: 200,
    };

    (animalService.AnimalService.prototype.getAnimals as jest.Mock).mockResolvedValue(mockAnimals);

    render(<AnimalList />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Hayvan Listesi')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    // Mock loading state
    jest.mock('../../../hooks/useLoading', () => ({
      useLoading: () => ({
        loading: { isLoading: true, loadingMessage: 'Yükleniyor...' },
        startLoading: jest.fn(),
        stopLoading: jest.fn(),
      }),
    }));

    render(<AnimalList />);
    // Loading spinner should be visible
  });

  it('should display empty state when no animals', async () => {
    const mockEmptyResponse = {
      success: true,
      data: {
        items: [],
        total: 0,
        totalPages: 0,
      },
      status: 200,
    };

    (animalService.AnimalService.prototype.getAnimals as jest.Mock).mockResolvedValue(mockEmptyResponse);

    render(<AnimalList />);

    await waitFor(() => {
      expect(screen.getByText(/Hayvan bulunamadı/i)).toBeInTheDocument();
    });
  });
});

