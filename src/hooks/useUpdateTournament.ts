// src/hooks/useUpdateTournament.ts
import { useState } from 'react';
import { updateTournament } from '../services/api.service';
import type { UpdateTournamentRequest, UpdateTournamentResponse } from '../models';

export const useUpdateTournament = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    tournamentId: number,
    data: UpdateTournamentRequest
  ): Promise<UpdateTournamentResponse> => {
    setLoading(true);
    setError(null);

    try {
      const { call } = updateTournament({ tournamentId, data });
      const response = await call;

      setLoading(false);
      return {
        success: true,
        data: response.data
      };
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Error al actualizar el torneo';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return { update, loading, error, setError };
};
