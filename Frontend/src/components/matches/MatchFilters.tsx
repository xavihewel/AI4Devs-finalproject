import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { MatchDto } from '../../types/api';
import { Button, Card, CardContent, Input, Select } from '../ui';

export interface FilterOptions {
  minScore: number;
  minSeats: number;
  dateFrom: string;
  dateTo: string;
  sortBy: 'score' | 'date' | 'seats';
  sortOrder: 'asc' | 'desc';
}

interface MatchFiltersProps {
  matches: MatchDto[];
  onFilteredMatches: (filteredMatches: MatchDto[]) => void;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function MatchFilters({ 
  matches, 
  onFilteredMatches, 
  onFiltersChange 
}: MatchFiltersProps) {
  const { t } = useTranslation('matches');
  
  const [filters, setFilters] = useState<FilterOptions>({
    minScore: 0,
    minSeats: 1,
    dateFrom: '',
    dateTo: '',
    sortBy: 'score',
    sortOrder: 'desc'
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('matchFilters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters(parsed);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('matchFilters', JSON.stringify(filters));
  }, [filters]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...matches];

    // Apply score filter
    if (filters.minScore > 0) {
      filtered = filtered.filter(match => match.score >= filters.minScore / 100);
    }

    // Apply seats filter
    if (filters.minSeats > 1) {
      filtered = filtered.filter(match => match.seatsFree >= filters.minSeats);
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(match => new Date(match.dateTime) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(match => new Date(match.dateTime) <= toDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'date':
          comparison = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
          break;
        case 'seats':
          comparison = a.seatsFree - b.seatsFree;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    onFilteredMatches(filtered);
    onFiltersChange(filters);
  }, [matches, filters, onFilteredMatches, onFiltersChange]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.minScore > 0) count++;
    if (filters.minSeats > 1) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      minScore: 0,
      minSeats: 1,
      dateFrom: '',
      dateTo: '',
      sortBy: 'score',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
  };

  const sortOptions = [
    { value: 'score', label: t('filters.sort.score') },
    { value: 'date', label: t('filters.sort.date') },
    { value: 'seats', label: t('filters.sort.seats') }
  ];

  const orderOptions = [
    { value: 'desc', label: t('filters.order.desc') },
    { value: 'asc', label: t('filters.order.asc') }
  ];

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('filters.title')}
            </h3>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {t('filters.activeCount', { count: activeFiltersCount })}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                >
                  {t('filters.clear')}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Score Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.minScore')} ({filters.minScore}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Seats Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.minSeats')}
              </label>
              <Select
                value={filters.minSeats.toString()}
                onChange={(e) => handleFilterChange('minSeats', parseInt(e.target.value))}
                options={Array.from({ length: 8 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: `${i + 1} ${i === 0 ? t('filters.seat') : t('filters.seats')}`
                }))}
              />
            </div>

            {/* Date From */}
            <div>
              <Input
                label={t('filters.dateFrom')}
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            {/* Date To */}
            <div>
              <Input
                label={t('filters.dateTo')}
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <Select
                label={t('filters.sortBy')}
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                options={sortOptions}
              />
            </div>

            {/* Sort Order */}
            <div>
              <Select
                label={t('filters.sortOrder')}
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                options={orderOptions}
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.minScore > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t('filters.scoreChip', { score: filters.minScore })}
                  <button
                    onClick={() => handleFilterChange('minScore', 0)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.minSeats > 1 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {t('filters.seatsChip', { seats: filters.minSeats })}
                  <button
                    onClick={() => handleFilterChange('minSeats', 1)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.dateFrom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {t('filters.fromChip', { date: new Date(filters.dateFrom).toLocaleDateString() })}
                  <button
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.dateTo && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {t('filters.toChip', { date: new Date(filters.dateTo).toLocaleDateString() })}
                  <button
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
