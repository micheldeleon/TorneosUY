import { useState } from "react";
import { leaveTournament } from "../services/api.service";
import { toast } from "sonner";

interface UseWithdrawFromTournamentOptions {
  tournamentId: number;
  format: "team" | "runner"; // "team" for team formats, "runner" for race format
  reason?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useWithdrawFromTournament({
  tournamentId,
  format: _format,
  reason,
  onSuccess,
  onError,
}: UseWithdrawFromTournamentOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdraw = async () => {
    setLoading(true);
    setError(null);

    try {
      const { call } = leaveTournament({
        tournamentId,
        reason,
      });
      const response = await call;

      if (response.data?.message) {
        toast.success(response.data.message || "Te has desuscrito del torneo correctamente");
      } else {
        toast.success("Te has desuscrito del torneo correctamente");
      }
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Error al desuscribirse del torneo";

      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error };
}
