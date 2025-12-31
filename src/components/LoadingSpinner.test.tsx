import React from 'react';
import { render, screen } from '../test-utils/testUtils';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should not render when isLoading is false', () => {
    render(<LoadingSpinner isLoading={false} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should render spinner when isLoading is true', () => {
    render(<LoadingSpinner isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display message when provided', () => {
    render(<LoadingSpinner isLoading={true} message="Yükleniyor..." />);
    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
  });

  it('should render with backdrop variant by default', () => {
    render(<LoadingSpinner isLoading={true} />);
    // Backdrop variant renders a backdrop element
    const backdrop = document.querySelector('.MuiBackdrop-root');
    expect(backdrop).toBeInTheDocument();
  });

  it('should render with inline variant', () => {
    render(<LoadingSpinner isLoading={true} variant="inline" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

