import { useEffect } from "react";
import { Star, TrendingUp } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { getOrganizerReputation } from "../../services/api.service";
import { Card } from "../ui/Card";
import { Avatar, AvatarFallback } from "../ui/Avatar";

interface OrganizerReputationProps {
  organizerId: number;
}

export function OrganizerReputation({ organizerId }: OrganizerReputationProps) {
  const { data: reputation, loading, error, fetch } = useApi(getOrganizerReputation);

  useEffect(() => {
    if (organizerId) {
      fetch(organizerId);
    }
  }, [organizerId, fetch]);

  if (loading) {
    return (
      <Card className="bg-[#2a2a2a] border-gray-800 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  if (error || !reputation) {
    return null;
  }

  const { averageScore, totalRatings, recentRatings } = reputation;

  const renderStars = (score: number, size: "sm" | "lg" = "sm") => {
    const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(score)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };


  return (
    <Card className="bg-[#2a2a2a] border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white text-xl font-bold">Reputación del Organizador</h3>
          <p className="text-gray-400 text-sm">
            {totalRatings === 0 ? "Sin calificaciones aún" : `Basado en ${totalRatings} calificación${totalRatings !== 1 ? "es" : ""}`}
          </p>
        </div>
      </div>

      {totalRatings === 0 ? (
        <div className="text-center py-8">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Este organizador aún no ha sido calificado</p>
        </div>
      ) : (
        <>
          {/* Average Score */}
          <div className="flex items-center justify-center gap-4 mb-8 p-6 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 rounded-xl border border-yellow-700/30">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {averageScore.toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm mb-2">de 5.0</div>
              {renderStars(averageScore, "lg")}
            </div>
          </div>

          {/* Recent Ratings */}
          {recentRatings.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Calificaciones Recientes</h4>
              <div className="space-y-4">
                {recentRatings.map((rating, index) => (
                  <div
                    key={index}
                    className="bg-surface-dark/50 border border-purple-500/20 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                            {rating.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{rating.userName}</p>
                          
                        </div>
                      </div>
                      {renderStars(rating.score)}
                    </div>
                    {rating.comment && (
                      <p className="text-gray-300 text-sm mt-2 pl-[52px]">"{rating.comment}"</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2 pl-[52px]">
                      {new Date(rating.createdAt).toLocaleDateString("es-UY", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
