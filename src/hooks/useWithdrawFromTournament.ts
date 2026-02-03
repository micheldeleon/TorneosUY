import { useState } from "react";
import { withdrawTeamFromTournament, withdrawRunnerFromTournament } from "../services/api.service";
import { toast } from "sonner";

interface UseWithdrawFromTournamentOptions {
  tournamentId: number;
  format: "team" | "runner"; // "team" for team formats, "runner" for race format
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useWithdrawFromTournament({
  tournamentId,
  format,
  onSuccess,
  onError,
}: UseWithdrawFromTournamentOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdraw = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (format === "team") {
        const { call } = withdrawTeamFromTournament({
          tournamentId,
        });
        response = await call;
      } else {
        const { call } = withdrawRunnerFromTournament({
          tournamentId,
        });
        response = await call;
      }

      if (response.data?.message) {
        toast.success(response.data.message || "Te has desuscrito del torneo correctamente");
        onSuccess?.();
      }
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
