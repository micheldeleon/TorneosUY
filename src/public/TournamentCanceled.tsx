import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
    AlertCircle,
    XCircle,
    Home,
    Search,
    Calendar,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { useEffect } from "react";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails } from "../models";
import { getTournamentById } from "../services/api.service";
import { SplashScreen } from "./SplashScreen";

export default function TournamentCanceled() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: t, loading, error, fetch } = useApi<TournamentDetails, number>(getTournamentById);

    useEffect(() => {
        if (id) {
            fetch(Number(id));
        }
    }, [id, fetch]);

    useEffect(() => {
        if (t && t.status === "INICIADO") {
            navigate(`/torneo-iniciado/${t.id}`);
        } else if (t && t.status === "FINALIZADO") {
            navigate(`/torneo-finalizado/${t.id}`);
        } else if (t && t.status === "ABIERTO") {
            navigate(`/torneo/${t.id}`);
        }
    }, [t, navigate]);

    // Loading state
    if (loading || !t) {
        return <SplashScreen />;
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen grid place-items-center text-rose-300 bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
                <div className="text-center">
                    <p className="mb-4">Error al cargar el torneo</p>
                    <Button onClick={() => navigate(-1)} variant="outline" className="text-purple-300 border-purple-600">
                        Volver
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-dark via-[#1a0a2a] to-surface-dark flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

            <div className="relative max-w-4xl w-full z-10">
                {/* Contenido principal */}
                <div className="p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8 mt-20">
                    {/* Título y descripción */}
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-800 via-red-500 to-red-800 bg-clip-text text-transparent">
                            Torneo Cancelado
                        </h2>
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200">
                            {t.name}
                        </h4>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            Lamentablemente, este torneo ha sido cancelado por el organizador.
                            No te preocupes, hay muchos otros torneos emocionantes esperándote.
                        </p>
                    </div>

                    {/* Mensaje de apoyo */}
                    <Card className="bg-gradient-to-r from-purple-500/10 via-red-500/10 to-surface-dark/10 border border-purple-500/20 p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-purple-500/20 p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-purple-200 mb-2 text-sm sm:text-base">¿Qué puedes hacer ahora?</h3>
                                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                                    Explora nuestra amplia selección de torneos activos. Encuentra competencias que se ajusten a tu nivel y estilo de juego.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                        Si tenías inscripción, será reembolsada
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-red-400 rounded-full" />
                                        Revisa tu email para más detalles
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Sugerencias */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Card onClick={() => navigate('/torneos')} className="bg-gray-900/50 border-purple-500/20 p-4 sm:p-5 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-100 cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                                <div className="p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200 mb-1 text-sm sm:text-base">Explorar Torneos</h3>
                                    <p className="text-xs text-gray-400">Encuentra nuevas competencias</p>
                                </div>
                            </div>
                        </Card>

                        <Card onClick={() => navigate('/')} className="bg-gray-900/50 border-purple-500/20 p-4 sm:p-5 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-100 cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                                <div className="p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Home className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200 mb-1 text-sm sm:text-base">Inicio</h3>
                                    <p className="text-xs text-gray-400">Vuelve a la página principal</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
