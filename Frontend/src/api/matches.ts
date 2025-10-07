import { api } from './client';
import type { MatchDto } from '../types/api';

export interface MatchSearchParams {
  destinationSedeId: string;
  time?: string;
  origin?: string;
}

export class MatchesService {
  /**
   * Find matches for a specific destination and criteria
   */
  static async findMatches(params: MatchSearchParams): Promise<MatchDto[]> {
    const searchParams = new URLSearchParams({
      destinationSedeId: params.destinationSedeId,
    });

    if (params.time) {
      searchParams.append('time', params.time);
    }

    if (params.origin) {
      searchParams.append('origin', params.origin);
    }

    const response = await api.get<MatchDto[]>(`/matches?${searchParams.toString()}`);
    return response.data;
  }

  /**
   * Get matches for the current user
   */
  static async getMyMatches(): Promise<MatchDto[]> {
    const response = await api.get<MatchDto[]>('/matches/my-matches');
    return response.data;
  }

  /**
   * Get a specific match by ID
   */
  static async getMatchById(id: string): Promise<MatchDto> {
    const response = await api.get<MatchDto>(`/matches/${id}`);
    return response.data;
  }
}
