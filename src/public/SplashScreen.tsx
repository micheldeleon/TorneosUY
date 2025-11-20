import { Trophy, Loader2 } from "lucide-react";

export const SplashScreen = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1232] to-[#1a0d2e] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-violet-500 to-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

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
