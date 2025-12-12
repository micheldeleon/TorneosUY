import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Trophy, ArrowLeft, Edit, Trash2, UserX, Users,
  Play, AlertTriangle, Settings, Save, X,
  UngroupIcon, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { getTournamentById, getTournamentFixtures, getTournamentStandings, cancelTournament, setResultForMatchLiga, setResultForMatchEliminatorio, generateFixtureForLeague, generateFixtureForEliminatory } from "../../services/api.service";
import { useGlobalContext } from "../../context/global.context";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Avatar, AvatarFallback } from "../../components/ui/Avatar";
import { ModalResultado } from "../../components/Tournament/ModalResultado";
import { AsignarPosiciones } from "../../components/Tournament/AsignarPosiciones";
import { TablaPosiciones } from "../../components/Tournament/TablaPosiciones";
import type { Participante } from "../../components/types/tournament";


interface Partido {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  resultadoLocal?: number;
  resultadoVisitante?: number;
  fecha?: string;
  estado: "jugado" | "pendiente" | "en_vivo";
}

interface Jornada {
  numero: number;
  partidos: Partido[];
}

interface Duelo {
  id: number;
  equipo1: string;
  equipo2: string;
  equipo1Id?: number;
  equipo2Id?: number;
  resultado1?: number;
  resultado2?: number;
  ganador?: string;
  estado: "jugado" | "pendiente" | "en_vivo";
}

interface Etapa {
  nombre: string;
  duelos: Duelo[];
}

export function ManageTournament() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const tournamentId = params.id ? parseInt(params.id) : undefined;
  
  const { data: tournamentData, loading, error } = useApi(
    getTournamentById,
    { autoFetch: true, params: tournamentId }
  );

  const { data: fixturesData, fetch: fetchFixtures } = useApi<any, number>(getTournamentFixtures);
  const { fetch: cancelTournamentFetch, loading: cancelLoading } = useApi<any, number>(cancelTournament);
  const { data: standingsData, fetch: fetchStandings } = useApi<any, number>(getTournamentStandings);
  const { fetch: generateFixtureLeague } = useApi(generateFixtureForLeague);
  const { fetch: generateFixtureEliminatory } = useApi(generateFixtureForEliminatory);
  
  // Verificar si el usuario es el organizador
  useEffect(() => {
    if (tournamentData && user) {
      if (tournamentData.organizerId !== user.id) {
        navigate("/", { 
          state: { 
            error: "No tienes permisos para gestionar este torneo" 
          } 
        });
      }
    }
  }, [tournamentData, user, navigate]);

  // Fetch fixtures if tournament format is "Eliminatorio" or "Liga"
  useEffect(() => {
    if (tournamentData?.id && (tournamentData.format.name === "Eliminatorio" || tournamentData.format.name === "Liga")) {
      fetchFixtures(tournamentData.id);
    }
  }, [tournamentData?.id, tournamentData?.format.name, fetchFixtures]);

  // Fetch standings if tournament format is "Liga"
  useEffect(() => {
    if (tournamentData?.id && tournamentData.format.name === "Liga") {
      fetchStandings(tournamentData.id);
    }
  }, [tournamentData?.id, tournamentData?.format.name, fetchStandings]);
  

  
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [tablaPosiciones, setTablaPosiciones] = useState<any[]>([]);
  
  // Estados para loader y notificaciones
  const [showLoader, setShowLoader] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: '' });
    }, 3000);
  };
  
  // Estados para edición
  const [modoEdicion, setModoEdicion] = useState(false);

  // Funciones de transformación de datos
  const transformStandingsToTable = (standings: any[]) => {
    if (!standings || standings.length === 0) return [];

    return standings.map((team, index) => ({
      posicion: index + 1,
      equipo: team.teamName,
      pj: team.played,
      pg: team.won,
      pe: team.draw,
      pp: team.lost,
      gf: team.goalsFor,
      gc: team.goalsAgainst,
      pts: team.points,
    }));
  };

  const transformFixturesToLeague = (fixtures: any[]) => {
    if (!fixtures || fixtures.length === 0) return [];

    const fixturesByRound = fixtures.reduce((acc, fixture) => {
      const round = fixture.round;
      if (!acc[round]) acc[round] = [];
      acc[round].push(fixture);
      return acc;
    }, {} as Record<number, any[]>);

    return Object.entries(fixturesByRound)
      .sort(([roundA], [roundB]) => Number(roundA) - Number(roundB))
      .map(([round, matchesInRound]) => ({
        numero: Number(round),
        partidos: (matchesInRound as any[]).map(match => ({
          id: match.id,
          equipoLocal: match.homeTeam?.name || "",
          equipoVisitante: match.awayTeam?.name || "",
          resultadoLocal: match.scoreHome ?? undefined,
          resultadoVisitante: match.scoreAway ?? undefined,
          fecha: match.scheduledAt ? new Date(match.scheduledAt).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' }) : undefined,
          estado: (match.status === "FINISHED" ? "jugado" : "pendiente") as "jugado" | "pendiente" | "en_vivo",
        }))
      }));
  };

  const transformFixturesToBracket = (fixtures: any[]) => {
    if (!fixtures || fixtures.length === 0) return [];

    const fixturesByRound = fixtures.reduce((acc, fixture) => {
      const round = fixture.round;
      if (!acc[round]) acc[round] = [];
      acc[round].push(fixture);
      return acc;
    }, {} as Record<number, any[]>);

    const sortedRounds = Object.entries(fixturesByRound)
      .sort(([roundA], [roundB]) => Number(roundA) - Number(roundB));
    
    const getRoundName = (matchCount: number): string => {
      if (matchCount >= 256) return "Ciento veintiochoavos de Final";
      if (matchCount >= 128) return "Sesentaicuatroavos de Final";
      if (matchCount >= 64) return "Treintaidosavos de Final";
      if (matchCount >= 32) return "Dieciseisavos de Final";
      if (matchCount >= 16) return "Octavos de Final";
      if (matchCount === 4) return "Cuartos de Final";
      if (matchCount === 2) return "Semifinales";
      if (matchCount === 1) return "Final";
      return `Ronda ${matchCount} equipos`;
    };
    
    return sortedRounds.map(([, matchesInRound]) => ({
      nombre: getRoundName((matchesInRound as any[]).length),
      duelos: (matchesInRound as any[]).map(match => ({
        id: match.id,
        equipo1: match.homeTeam?.name || "",
        equipo2: match.awayTeam?.name || "",
        equipo1Id: match.homeTeam?.id,
        equipo2Id: match.awayTeam?.id,
        resultado1: match.scoreHome ?? undefined,
        resultado2: match.scoreAway ?? undefined,
        ganador: match.winnerTeam?.name || "",
        estado: (match.status === "FINISHED" ? "jugado" : "pendiente") as "jugado" | "pendiente" | "en_vivo",
      }))
    }));
  };

  // Transformar fixtures según el formato del torneo
  useEffect(() => {
    if (fixturesData && tournamentData) {
      if (tournamentData.format.name === "Liga") {
        const jornadas = transformFixturesToLeague(fixturesData);
        setJornadas(jornadas);
      } else if (tournamentData.format.name === "Eliminatorio") {
        const etapas = transformFixturesToBracket(fixturesData);
        setEtapas(etapas);
      }
    }
  }, [fixturesData, tournamentData]);

  // Transformar standings para tabla de posiciones
  useEffect(() => {
    if (standingsData) {
      const tabla = transformStandingsToTable(standingsData);
      setTablaPosiciones(tabla);
    }
  }, [standingsData]);

  // Modal de resultado
  const [modalResultado, setModalResultado] = useState<{
    isOpen: boolean;
    partidoId?: number;
    equipoLocal?: string;
    equipoVisitante?: string;
    equipoLocalId?: number;
    equipoVisitanteId?: number;
    resultadoActual?: { local: number; visitante: number };
  }>({ isOpen: false });

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleIniciarTorneo = () => {
    if (confirm("¿Estás seguro de iniciar el torneo? No podrás editar los detalles después.")) {
      setModoEdicion(false);
    }
  };

  const handleCancelarTorneo = async () => {
    if (!confirm("¿Estás seguro de cancelar el torneo? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      if (tournamentId) {
        setShowLoader(true);
        cancelTournamentFetch(tournamentId);
        
        setTimeout(() => {
          setShowLoader(false);
          showNotification('success', 'Torneo cancelado correctamente. Los participantes serán notificados.');
          setTimeout(() => {
            navigate("/perfil");
          }, 1500);
        }, 1000);
      }
    } catch (error) {
      console.error("Error al cancelar torneo:", error);
      setShowLoader(false);
      showNotification('error', 'Error al cancelar el torneo. Por favor intenta nuevamente.');
    }
  };

  const handleEliminarParticipante = (id: number) => {
    if (confirm("¿Eliminar este participante del torneo?")) {
      setParticipantes(participantes.filter(p => p.id !== id));
    }
  };

  const handleGuardarDetalles = () => {
    showNotification('success', 'Detalles guardados correctamente');
    setModoEdicion(false);
  };

  const handleAbrirModalResultado = (partido: Partido) => {
    setModalResultado({
      isOpen: true,
      partidoId: partido.id,
      equipoLocal: partido.equipoLocal,
      equipoVisitante: partido.equipoVisitante,
      resultadoActual: partido.resultadoLocal !== undefined ? {
        local: partido.resultadoLocal,
        visitante: partido.resultadoVisitante!,
      } : undefined,
    });
  };

  const handleGuardarResultado = async (resultadoLocal: number, resultadoVisitante: number) => {
    if (!tournamentData?.id || !modalResultado.partidoId) return;

    try {
      setShowLoader(true);
      
      const { call } = setResultForMatchLiga({
        tournamentId: tournamentData.id,
        matchId: modalResultado.partidoId,
        result: {
          scoreHome: resultadoLocal,
          scoreAway: resultadoVisitante,
        }
      });

      await call;
      
      setJornadas(jornadas.map(jornada => ({
        ...jornada,
        partidos: jornada.partidos.map(partido =>
          partido.id === modalResultado.partidoId
            ? { ...partido, resultadoLocal, resultadoVisitante, estado: "jugado" as const }
            : partido
        ),
      })));
      
      setTimeout(() => {
        if (tournamentData?.id) {
          fetchFixtures(tournamentData.id);
          if (tournamentData.format.name === "Liga") {
            fetchStandings(tournamentData.id);
          }
        }
        setShowLoader(false);
        showNotification('success', 'Resultado guardado correctamente');
      }, 500);
      
    } catch (error) {
      console.error("Error al guardar resultado:", error);
      setShowLoader(false);
      showNotification('error', 'Error al guardar el resultado. Por favor intenta nuevamente.');
    }
  };

  const handleAbrirModalDuelo = (duelo: Duelo) => {
    setModalResultado({
      isOpen: true,
      partidoId: duelo.id,
      equipoLocal: duelo.equipo1,
      equipoVisitante: duelo.equipo2,
      equipoLocalId: duelo.equipo1Id,
      equipoVisitanteId: duelo.equipo2Id,
      resultadoActual: duelo.resultado1 !== undefined ? {
        local: duelo.resultado1,
        visitante: duelo.resultado2!,
      } : undefined,
    });
  };

  const handleGuardarResultadoDuelo = async (resultado1: number, resultado2: number) => {
    if (!tournamentData?.id || !modalResultado.partidoId) return;

    try {
      const winnerTeamId = resultado1 > resultado2 ? modalResultado.equipoLocalId : modalResultado.equipoVisitanteId;
      
      if (!winnerTeamId) {
        showNotification('error', 'Error: No se pudo determinar el equipo ganador.');
        return;
      }

      setShowLoader(true);

      const { call } = setResultForMatchEliminatorio({
        tournamentId: tournamentData.id,
        matchId: modalResultado.partidoId,
        result: {
          scoreHome: resultado1,
          scoreAway: resultado2,
          winnerTeamId: winnerTeamId,
        }
      });

      await call;

      const ganador = resultado1 > resultado2 ? modalResultado.equipoLocal : modalResultado.equipoVisitante;
      
      setEtapas(etapas.map(etapa => ({
        ...etapa,
        duelos: etapa.duelos.map(duelo =>
          duelo.id === modalResultado.partidoId
            ? { ...duelo, resultado1, resultado2, ganador, estado: "jugado" as const }
            : duelo
        ),
      })));
      
      setTimeout(() => {
        if (tournamentData?.id) {
          fetchFixtures(tournamentData.id);
        }
        setShowLoader(false);
        showNotification('success', 'Resultado del duelo guardado correctamente');
      }, 500);
      
    } catch (error) {
      console.error("Error al guardar resultado del duelo:", error);
      setShowLoader(false);
      showNotification('error', 'Error al guardar el resultado. Por favor intenta nuevamente.');
    }
  };

  const handleGuardarPosiciones = (participantesOrdenados: Participante[]) => {
    setParticipantes(participantesOrdenados);
    showNotification('success', 'Posiciones guardadas correctamente');
  };

  const handleGenerarFixture = async () => {
    if (!tournamentId || !tournamentData) return;

    try {
      setShowLoader(true);
      
      if (tournamentData.format.name === "Liga") {
        await generateFixtureLeague({
          tournamentId,
          isDoubleRound: tournamentData.isDoubleRound || false,
        });
      } else if (tournamentData.format.name === "Eliminatorio") {
        await generateFixtureEliminatory({ tournamentId });
      }

      // Refetch fixtures after generation
      setTimeout(() => {
        fetchFixtures(tournamentId);
        setShowLoader(false);
        showNotification('success', 'Fixture generado correctamente');
      }, 1000);
    } catch (error) {
      console.error("Error al generar fixture:", error);
      setShowLoader(false);
      showNotification('error', 'Error al generar el fixture. Por favor intenta nuevamente.');
    }
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando torneo...</p>
        </div>
      </div>
    );
  }

  if (error || !tournamentData) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-white text-xl mb-2">Error al cargar el torneo</h2>
          <p className="text-gray-400 mb-6">
            {error?.message || "No se pudo obtener la información del torneo"}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-3xl">{tournamentData.name}</h1>
                  <p className="text-gray-400">Panel de Gestión del Organizador</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={
                tournamentData.status === "ABIERTO" 
                  ? "bg-blue-600/20 text-blue-300 border-blue-600/50"
                  : tournamentData.status === "INICIADO"
                  ? "bg-green-600/20 text-green-300 border-green-600/50"
                  : "bg-gray-600/20 text-gray-300 border-gray-600/50"
              }>
                {tournamentData.status === "ABIERTO" ? "Por Comenzar" : tournamentData.status === "INICIADO" ? "En Curso" : "Finalizado"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        {tournamentData.status === "ABIERTO" && (
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6 mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white">El torneo aún no ha comenzado</p>
                  <p className="text-gray-400 text-sm">Puedes editar detalles y gestionar participantes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCancelarTorneo}
                  disabled={cancelLoading}
                  variant="outline"
                  className="border-rose-600 text-rose-300 hover:bg-rose-600/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {cancelLoading ? "Cancelando..." : "Cancelar Torneo"}
                </Button>
                <Button
                  onClick={handleIniciarTorneo}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Torneo
                </Button>
              </div>
            </div>
          </Card>
        )}


        {tournamentData.status === "INICIADO" && (!fixturesData || fixturesData.length === 0) && (tournamentData.format.name === "Liga" || tournamentData.format.name === "Eliminatorio") && (
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6 mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">El torneo ya ha comenzado</p>
                  <p className="text-gray-400 text-sm">Genera el fixture para comenzar la competición</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerarFixture}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white"
                >
                  <UngroupIcon className="w-4 h-4 mr-2" />
                  Generar fixture automático
                </Button>
              </div>
            </div>
          </Card>
        )}


        {/* Main Tabs */}
        <Tabs defaultValue="detalles" className="w-full">
          <TabsList className="bg-[#2a2a2a] border border-gray-800 mb-6">
            <TabsTrigger value="detalles" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400">
              <Settings className="w-4 h-4 mr-2" />
              Detalles
            </TabsTrigger>
            <TabsTrigger value="participantes" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              Participantes ({participantes.length})
            </TabsTrigger>
            <TabsTrigger value="competicion" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400">
              <Trophy className="w-4 h-4 mr-2" />
              Competición
            </TabsTrigger>
          </TabsList>

          {/* Detalles Tab */}
          <TabsContent value="detalles">
            <Card className="bg-[#2a2a2a] border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl">Información del Torneo</h3>
                {tournamentData.status === "ABIERTO" && (
                  <Button
                    onClick={() => setModoEdicion(!modoEdicion)}
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-600/10"
                  >
                    {modoEdicion ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {modoEdicion ? "Cancelar" : "Editar"}
                  </Button>
                )}
              </div>

              {modoEdicion ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-gray-300">Nombre del Torneo</Label>
                      <Input
                        id="nombre"
                        value={tournamentData.name}
                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-gray-300">Fecha limite de inscripciones</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={new Date(tournamentData.registrationDeadline).toLocaleDateString('es-UY')}
                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-gray-300">Fecha de Inicio</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={new Date(tournamentData.startAt).toLocaleDateString('es-UY')}
                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-gray-300">Fecha de Finalización</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={new Date(tournamentData.endAt).toLocaleDateString('es-UY')}
                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-gray-300">Costo de inscripciones</Label>
                      <Input
                        id="fecha"
                        type="number"
                        value={tournamentData.registrationCost}
                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="premio" className="text-gray-300">Premio</Label>
                      <Input
                        id="premio"
                        type="number"
                        value={tournamentData.prize}
                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-gray-300">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      //value={tournamentData.description}
                      value={"Proximamente..."}
                      rows={4}
                      className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 resize-none"
                      disabled
                    />
                  </div>

                  <Button
                    onClick={handleGuardarDetalles}
                    disabled
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios (Proximamente)
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Nombre</p>
                      <p className="text-white">{tournamentData.name}</p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Fecha limite de inscripciones</p>
                      <p className="text-white">{new Date(tournamentData.registrationDeadline).toLocaleDateString('es-UY')}</p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Fecha de Inicio</p>
                      <p className="text-white">{new Date(tournamentData.startAt).toLocaleDateString('es-UY')}</p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Fecha de Finalización</p>
                      <p className="text-white">{new Date(tournamentData.endAt).toLocaleDateString('es-UY')}</p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Costo de inscripciones</p>
                      <p className="text-white">{tournamentData.registrationCost}</p>
                    </div>

                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Premio</p>
                      <p className="text-white">{tournamentData.prize}</p>
                    </div>
                  </div>

                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Descripción</p>
                    <p className="text-gray-500 text-sm mb-1">Proximamente...</p>
                    {/* <p className="text-white">{tournamentData.description}</p> */}
                  </div>

                  {tournamentData.status !== "ABIERTO" && (
                    <div className="p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
                      <p className="text-yellow-300 text-sm">
                        ⚠️ El torneo ya ha comenzado. No puedes editar los detalles.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Participantes Tab */}
          <TabsContent value="participantes">
            <Card className="bg-[#2a2a2a] border-gray-800 p-6">
              <h3 className="text-white text-xl mb-6">Lista de Participantes</h3>

              <div className="space-y-3">
                {participantes.map((participante) => (
                  <div
                    key={participante.id}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-purple-600/30">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                          {getInitials(participante.nombre)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="text-white">{participante.nombre}</h4>
                        <p className="text-gray-500 text-sm">{participante.email}</p>
                      </div>

                      <Badge className={
                        participante.estado === "activo"
                          ? "bg-green-600/20 text-green-300 border-green-600/50"
                          : "bg-gray-600/20 text-gray-300 border-gray-600/50"
                      }>
                        {participante.estado}
                      </Badge>

                      {tournamentData.status === "ABIERTO" && participante.estado === "activo" && (
                        <Button
                          onClick={() => handleEliminarParticipante(participante.id)}
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-600/10"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {tournamentData.status === "ABIERTO" && (
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
                  <p className="text-blue-300 text-sm">
                    💡 Puedes eliminar participantes antes de iniciar el torneo.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Competición Tab */}
          <TabsContent value="competicion">
            {/* Liga */}
            {tournamentData.format.name === "Liga" && (
              <div className="space-y-6">
                {/* Tabla de Posiciones */}
                {tablaPosiciones.length > 0 && (
                  <Card className="bg-[#2a2a2a] border-gray-800 p-6">
                    <h3 className="text-white text-xl mb-4">Tabla de Posiciones</h3>
                    <TablaPosiciones posiciones={tablaPosiciones} />
                  </Card>
                )}

                {/* Fixture por Jornadas */}
                {jornadas.map((jornada) => (
                  <Card key={jornada.numero} className="bg-[#2a2a2a] border-gray-800 p-6">
                    <h3 className="text-white mb-4">Jornada {jornada.numero}</h3>
                    <div className="space-y-3">
                      {jornada.partidos.map((partido) => (
                        <div
                          key={partido.id}
                          onClick={() => {
                            if (tournamentData.status !== "ABIERTO" && partido.estado === "pendiente") {
                              handleAbrirModalResultado(partido);
                            } else if (partido.estado === "jugado") {
                              showNotification('error', 'La edición de resultados estará disponible próximamente.');
                            }
                          }}
                          className={`bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 ${
                            tournamentData.status !== "ABIERTO" && partido.estado === "pendiente" ? "hover:border-purple-600/50 cursor-pointer" : ""
                          } ${
                            partido.estado === "jugado" ? "cursor-not-allowed opacity-75" : ""
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-white">{partido.equipoLocal}</span>
                            </div>

                            {partido.estado === "jugado" ? (
                              <div className="flex items-center gap-3 bg-purple-900/20 px-4 py-2 rounded-lg">
                                <span className="text-white text-lg">{partido.resultadoLocal}</span>
                                <span className="text-gray-500">-</span>
                                <span className="text-white text-lg">{partido.resultadoVisitante}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">VS</span>
                            )}

                            <div className="flex items-center gap-3 flex-1 justify-end">
                              <span className="text-white">{partido.equipoVisitante}</span>
                            </div>
                          </div>

                          {tournamentData.status !== "ABIERTO" && (
                            <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                              <Badge className={
                                partido.estado === "jugado"
                                  ? "bg-gray-600/20 text-gray-300 border-gray-600/50"
                                  : "bg-blue-600/20 text-blue-300 border-blue-600/50"
                              }>
                                {partido.estado === "jugado" ? "Finalizado" : "Pendiente"}
                              </Badge>
                              <span className={partido.estado === "jugado" ? "text-gray-500 text-sm" : "text-purple-400 text-sm"}>
                                {partido.estado === "jugado" ? "Edición próximamente" : "Clic para establecer resultado"}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Eliminatoria */}
            {tournamentData.format.name === "Eliminatorio" && (
              <div className="space-y-6">
                {etapas.map((etapa, index) => (
                  <Card key={index} className="bg-[#2a2a2a] border-gray-800 p-6">
                    <h3 className="text-white mb-4">{etapa.nombre}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {etapa.duelos.map((duelo) => (
                        <div
                          key={duelo.id}
                          onClick={() => {
                            if (tournamentData.status !== "ABIERTO" && duelo.equipo1 && duelo.equipo2 && duelo.estado === "pendiente") {
                              handleAbrirModalDuelo(duelo);
                            } else if (duelo.estado === "jugado") {
                              showNotification('error', 'La edición de resultados estará disponible próximamente.');
                            }
                          }}
                          className={`bg-[#1a1a1a] border-2 rounded-xl overflow-hidden ${
                            tournamentData.status !== "ABIERTO" && duelo.equipo1 && duelo.equipo2 && duelo.estado === "pendiente"
                              ? "border-gray-800 hover:border-purple-600/50 cursor-pointer"
                              : "border-gray-800"
                          } ${
                            duelo.estado === "jugado" ? "opacity-75 cursor-not-allowed" : ""
                          } transition-colors`}
                        >
                          <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                            <span className="text-white">{duelo.equipo1 || "Por definir"}</span>
                            {duelo.resultado1 !== undefined && (
                              <span className="text-white text-lg">{duelo.resultado1}</span>
                            )}
                          </div>
                          <div className="p-3 flex justify-between items-center">
                            <span className="text-white">{duelo.equipo2 || "Por definir"}</span>
                            {duelo.resultado2 !== undefined && (
                              <span className="text-white text-lg">{duelo.resultado2}</span>
                            )}
                          </div>

                          {tournamentData.status !== "ABIERTO" && duelo.equipo1 && duelo.equipo2 && (
                            <div className="px-3 py-2 bg-purple-900/10 border-t border-gray-800">
                              <span className={duelo.estado === "jugado" ? "text-gray-500 text-sm" : "text-purple-400 text-sm"}>
                                {duelo.estado === "jugado" ? "Edición próximamente" : "Clic para establecer resultado"}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Carrera */}
            {(tournamentData.format.name === "Carrera" || tournamentData.format.name === "Battle Royale") && (
              <AsignarPosiciones
                participantes={participantes}
                onSave={handleGuardarPosiciones}
                readonly={tournamentData.status === "ABIERTO"}
              />
            )}

            {tournamentData.status === "ABIERTO" && (
              <Card className="bg-yellow-900/20 border-yellow-700/30 p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-300">
                    Debes iniciar el torneo para poder gestionar resultados y posiciones.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Resultado */}
      <ModalResultado
        isOpen={modalResultado.isOpen}
        onClose={() => setModalResultado({ isOpen: false })}
        onSave={tournamentData.format.name === "Eliminatorio" ? handleGuardarResultadoDuelo : handleGuardarResultado}
        equipoLocal={modalResultado.equipoLocal || ""}
        equipoVisitante={modalResultado.equipoVisitante || ""}
        resultadoActual={modalResultado.resultadoActual}
      />

      {/* Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Procesando...</p>
          </div>
        </div>
      )}

      {/* Notification Overlay */}
      {notification.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className={`max-w-md w-full mx-4 p-8 rounded-2xl ${
            notification.type === 'success' 
              ? '' 
              : ''
          }`}>
            <div className="text-center">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
              ) : (
                <XCircle className="w-20 h-20 text-rose-400 mx-auto mb-4" />
              )}
              <h3 className={`text-2xl font-bold mb-2 ${
                notification.type === 'success' ? 'text-green-400' : 'text-rose-100'
              }`}>
                {notification.type === 'success' ? '¡Éxito!' : 'Error'}
              </h3>
              <p className="text-white text-lg">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
