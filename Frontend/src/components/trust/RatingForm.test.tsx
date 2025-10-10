import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RatingForm } from './RatingForm';
import { RatingsService } from '../../api/ratings';

// Mock the API service
jest.mock('../../api/ratings');
const mockRatingsService = RatingsService as jest.Mocked<typeof RatingsService>;

describe('RatingForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render rating form with all fields', () => {
    render(
      <RatingForm
        ratedUserId="test-user"
        ratedUserName="Test User"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Valorar a Test User')).toBeInTheDocument();
    expect(screen.getByText('Tipo de valoración')).toBeInTheDocument();
    expect(screen.getByText('👍 Positivo')).toBeInTheDocument();
    expect(screen.getByText('👎 Negativo')).toBeInTheDocument();
    expect(screen.getByText('Etiquetas (selecciona al menos una)')).toBeInTheDocument();
    expect(screen.getByText('Comentario (opcional)')).toBeInTheDocument();
  });

  it('should allow selecting rating type', () => {
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const negativeRadio = screen.getByLabelText('👎 Negativo');
    fireEvent.click(negativeRadio);

    expect(negativeRadio).toBeChecked();
  });

  it('should allow selecting tags', () => {
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const punctualCheckbox = screen.getByText('punctual').previousElementSibling as HTMLInputElement;
    fireEvent.click(punctualCheckbox);

    expect(punctualCheckbox).toBeChecked();
  });

  it('should allow entering comment', () => {
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const commentTextarea = screen.getByPlaceholderText('Describe tu experiencia...');
    fireEvent.change(commentTextarea, { target: { value: 'Great experience!' } });

    expect(commentTextarea).toHaveValue('Great experience!');
  });

  it('should show error when no tags selected', async () => {
    mockRatingsService.createRating.mockResolvedValue({} as any);
    
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Enviar Valoración');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Selecciona al menos una etiqueta')).toBeInTheDocument();
    });
  });

  it('should submit rating successfully', async () => {
    mockRatingsService.createRating.mockResolvedValue({} as any);
    
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Select a tag
    const punctualCheckbox = screen.getByText('punctual').previousElementSibling as HTMLInputElement;
    fireEvent.click(punctualCheckbox);

    // Submit form
    const submitButton = screen.getByText('Enviar Valoración');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRatingsService.createRating).toHaveBeenCalledWith({
        ratedId: 'test-user',
        ratingType: 'THUMBS_UP',
        tags: ['punctual'],
        comment: undefined
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should show error when API fails', async () => {
    mockRatingsService.createRating.mockRejectedValue(new Error('API Error'));
    
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Select a tag
    const punctualCheckbox = screen.getByText('punctual').previousElementSibling as HTMLInputElement;
    fireEvent.click(punctualCheckbox);

    // Submit form
    const submitButton = screen.getByText('Enviar Valoración');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al crear la valoración')).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should disable submit button while loading', async () => {
    mockRatingsService.createRating.mockImplementation(() => new Promise(() => {}));
    
    render(
      <RatingForm
        ratedUserId="test-user"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Select a tag
    const punctualCheckbox = screen.getByText('punctual').previousElementSibling as HTMLInputElement;
    fireEvent.click(punctualCheckbox);

    // Submit form
    const submitButton = screen.getByText('Enviar Valoración');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Guardando...')).toBeInTheDocument();
      expect(screen.getByText('Guardando...')).toBeDisabled();
    });
  });
});
