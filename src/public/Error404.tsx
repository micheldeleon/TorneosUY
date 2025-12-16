import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "../components/ui/Card";
import {
    Home,
    Search,
    Map,
    Sparkles,
} from "lucide-react";

export default function Error404() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Animated Orbs Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

            <div className="relative max-w-4xl w-full z-10">

                {/* Contenido principal */}
                <div className="p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8">

                    {/* Número 404 grande */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-30 animate-pulse" />
                            <h1 className="relative text-6xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                404
                            </h1>
                        </div>
                    </div>

                    {/* Título y descripción */}
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">
                            ¡Oops! Página No Encontrada
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            Parece que te has aventurado fuera del mapa. Esta página no existe o ha sido movida a otra ubicación.
                        </p>
                    </div>

                    {/* Información de la ruta */}
                    {location.pathname && (
                        <Card className="bg-gray-900/50 border-purple-500/20 p-3 sm:p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="bg-purple-500/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                                    <Map className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-200 mb-1 text-sm sm:text-base">Ruta solicitada:</h3>
                                    <p className="text-xs sm:text-sm text-gray-400 font-mono truncate">{location.pathname}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Sugerencias */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

                        <Card onClick={() => navigate('/torneos')} className="bg-gray-900/50 border-purple-500/20 p-4 sm:p-5 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-100 cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                                <div className="p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200 mb-1 text-sm sm:text-base">Torneos</h3>
                                    <p className="text-xs text-gray-400">Explora competencias activas</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Mensaje de ayuda */}
                    <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-surface-dark/10 border border-purple-500/20 p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-purple-500/20 p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-purple-200 mb-2 text-sm sm:text-base">¿Necesitas ayuda?</h3>
                                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                                    Si llegaste aquí desde un enlace dentro de TuTorneo, por favor repórtalo para que podamos solucionarlo.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                        Verifica la URL
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-pink-400 rounded-full" />
                                        Intenta buscar en torneos
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                        Contacta con soporte
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
