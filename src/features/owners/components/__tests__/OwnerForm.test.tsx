import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OwnerForm from '../OwnerForm';

// Mock MUI icons to avoid rendering issues in test environment
jest.mock('@mui/icons-material', () => ({
  Business: () => <span data-testid="business-icon" />,
}));

describe('OwnerForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders individual customer fields by default', () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/Ad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Soyad/i)).toBeInTheDocument();
    expect(screen.getByText(/Bireysel/i)).toBeInTheDocument();

    // Corporate fields should not be visible
    expect(screen.queryByLabelText(/Kurumsal Ünvan/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Vergi No/i)).not.toBeInTheDocument();
  });

  it('shows corporate fields when Kurumsal is selected', async () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const kurumsalBtn = screen.getByText(/Kurumsal/i);
    fireEvent.click(kurumsalBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/Kurumsal Ünvan/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Vergi No/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Vergi Dairesi/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitBtn = screen.getByText(/Kaydet/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Ad gereklidir/i)).toBeInTheDocument();
      expect(screen.getByText(/Soyad gereklidir/i)).toBeInTheDocument();
    });
  });
});
