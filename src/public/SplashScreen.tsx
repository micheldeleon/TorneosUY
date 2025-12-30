import { Trophy } from "lucide-react";

export const SplashScreen = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2a] to-[#0f0f0f] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Orbs Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 transform hover:scale-110 hover:rotate-3 transition-all duration-300 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-transparent opacity-50 rounded-2xl"></div>
                        <Trophy className="w-9 h-9 text-purple-900 relative z-10" />
                    </div>

                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-5xl">
                        TuTorneo
                    </h1>
                </div>
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};
