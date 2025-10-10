import React, { useState } from 'react';
import { RatingsService, RatingCreateDto } from '../../api/ratings';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface RatingFormProps {
  ratedUserId: string;
  ratedUserName?: string;
  tripId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const COMMON_TAGS = [
  'puntual',
  'amigable',
  'seguro',
  'respetuoso',
  'comunicativo',
  'flexible',
  'organizado',
  'confiable'
];

export function RatingForm({ ratedUserId, ratedUserName, tripId, onSuccess, onCancel }: RatingFormProps) {
  const [ratingType, setRatingType] = useState<'THUMBS_UP' | 'THUMBS_DOWN'>('THUMBS_UP');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTags.length === 0) {
      setError('Selecciona al menos una etiqueta');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ratingData: RatingCreateDto = {
        ratedId: ratedUserId,
        tripId,
        ratingType,
        tags: selectedTags,
        comment: comment.trim() || undefined
      };

      await RatingsService.createRating(ratingData);
      onSuccess?.();
    } catch (err) {
      setError('Error al crear la valoración');
      console.error('Error creating rating:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Valorar a {ratedUserName || 'usuario'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de valoración
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ratingType"
                  value="THUMBS_UP"
                  checked={ratingType === 'THUMBS_UP'}
                  onChange={(e) => setRatingType(e.target.value as 'THUMBS_UP')}
                  className="mr-2"
                />
                <span className="text-green-600">👍 Positivo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ratingType"
                  value="THUMBS_DOWN"
                  checked={ratingType === 'THUMBS_DOWN'}
                  onChange={(e) => setRatingType(e.target.value as 'THUMBS_DOWN')}
                  className="mr-2"
                />
                <span className="text-red-600">👎 Negativo</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas (selecciona al menos una)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_TAGS.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="mr-2"
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe tu experiencia..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || selectedTags.length === 0}
            >
              {loading ? 'Guardando...' : 'Enviar Valoración'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
