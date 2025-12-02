import { useParams, useNavigate } from "react-router-dom";
import { Trophy, Calendar, Users, ArrowLeft, Phone, Star, Award } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Checkbox } from "../components/ui/Checkbox";
import { Progress } from "../components/ui/Progress";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { getTournamentById } from "../services/api.service";
import type { TournamentDetails } from "../models";


function formatCurrency(value: number) {
  return value === 0
    ? "Gratis"
    : new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(value);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export function TournamentDetails() {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { id } = useParams();

  const {
    data,
    loading,
    error,
    fetch
  } = useApi<TournamentDetails, number>(getTournamentById);

  const t = data;

  // Se ejecuta una vez cuando cargue el componente
  useEffect(() => {
    if (id) {
      fetch(Number(id));
    }
  }, [id, fetch]);


  useEffect(() => {
    if (!id) return;
    // fetch devuelve una función cleanup (() => controller.abort())
    const cleanup = fetch(Number(id));
    return cleanup;
  }, [id, fetch]);

  // Mostrar error SOLO si hay error
  if (error) {
    return (
      <div className="min-h-screen grid place-items-center text-purple-300 bg-surface">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mostrar loader mientras carga o mientras t es falsy
  if (loading || !t) {
    return (
      <div className="min-h-screen grid place-items-center text-purple-300 bg-surface">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const progress = t.maxParticipantsPerTournament > 0 ? (t.teamsInscribed / t.maxParticipantsPerTournament) * 100 : 0;
  const statusClass = !t.privateTournament ? "bg-green-600/20 text-green-300 border-green-600/50" : "bg-rose-600/20 text-rose-300 border-rose-600/50";

  const organizador = "Ignacio Barcelo"; // Reemplazar con t.organizerName cuando esté disponible
  const organizerRating = 4.5; // Reemplazar con t.organizerRating cuando esté disponible

  // Get organizer initials
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const esPrivado = t.privateTournament ? "Privado" : "Público";
  console.log(t);

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a torneos
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Inscription Card */}
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6 sticky top-24">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-400 text-sm">{t.discipline.name}</span>
                </div>
                <Badge className={statusClass}>{esPrivado}</Badge>
              </div>

              <h2 className="text-white mb-6">{t.name}</h2>

              <dl className="space-y-3 text-sm mb-6">
                <div className="flex items-center justify-between text-gray-400">
                  <dt>Costo:</dt>
                  <dd className="text-white">{formatCurrency(t.registrationCost)}</dd>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <dt>Creado el:</dt>
                  <dd className="text-white">{formatDate(t.createdAt)}</dd>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <dt>Fecha inicio:</dt>
                  <dd className="text-white">{formatDate(t.startAt)}</dd>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <dt>Fecha fin:</dt>
                  <dd className="text-white">{formatDate(t.endAt)}</dd>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <dt>Fecha limite de inscripciones:</dt>
                  <dd className="text-white">{formatDate(t.registrationDeadline)}</dd>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <dt>Participantes:</dt>
                  <dd className="text-white">{`${t.teamsInscribed} / ${t.maxParticipantsPerTournament}`}</dd>
                </div>
              </dl>

              <Progress value={progress} className="mb-6 h-2" />

              <div className="flex items-start gap-2 mb-6">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-0.5 border-gray-600"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-400 cursor-pointer"
                >
                  Acepto Términos y Condiciones
                </label>
              </div>

              <Button
                disabled={!acceptedTerms}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inscribirme
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 order-1 md:order-2 space-y-6">
            {/* Organizer Card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 grid place-items-center border border-white/20 flex-shrink-0">
                  {/* <span className="text-2xl">{getInitials(t.organizerName)}</span> */}
                  <span className="text 2x1">{getInitials(organizador)}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{organizador}</div>
                  <div className="text-sm opacity-80">Organizador</div>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(organizerRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/30"
                          }`}
                      />
                    ))}
                    <span className="text-sm ml-1 opacity-80">{organizerRating}/5</span>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors grid place-items-center">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tournament Details Card */}
            <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-6">
                <div className="text-gray-400">Formato:</div>
                <div className="text-white">{t.format.name}</div>
                {t.format.name === "Liga" && (
                  <>
                    <div className="text-gray-400">Puntos por victoria: </div>
                    <div className="text-white">{t.format.winPoints}</div>

                    <div className="text-gray-400">Puntos por empate:</div>
                    <div className="text-white">{t.format.drawPoints}</div>

                    <div className="text-gray-400">Puntos por derrota: </div>
                    <div className="text-white">{t.format.lossPoints}</div>
                  </>
                )}

                {/* <div className="text-gray-400">Lugar:</div>
                <div className="text-white">{t.place}</div> */}

                <div className="text-gray-400">Premio:</div>
                <div className="text-white">{t.prize}</div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white">Detalles</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {/* {t.details} */}
                  Detalles del torneo no disponibles por el momento. // Reemplazar con t.details cuando esté disponible
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white">Fecha del Torneo</h3>
                </div>
                <p className="text-gray-300 text-xl">{formatDate(t.startAt)}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white">Cupos Disponibles</h3>
                </div>
                <p className="text-gray-300 text-xl">{t.maxParticipantsPerTournament - t.teamsInscribed} de {t.maxParticipantsPerTournament}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}