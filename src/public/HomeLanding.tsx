import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { About } from "./About";
import { Faq } from "./FAQ";
import { Contact } from "./Contact";
import { Logo } from "../components/Logo";
import { getAllTournaments } from "../services/api.service";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails } from "../models";
import { TournamentCardAlt } from "../components/TournamentCard/TournamentCardAlt";
import { Sparkles, Badge, Rocket, ChevronRight, Play } from "lucide-react";

export const HomeLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tournaments, setTournaments] = useState<TournamentDetails[]>([]);

  const {
    data: response
  } = useApi(getAllTournaments, { autoFetch: true });

  useEffect(() => {
    if (!response) return;
    setTournaments(response);
  }, [response]);

  useEffect(() => {
    const hashId = location.hash ? location.hash.replace("#", "") : null;
    const stateId = (location.state as any)?.scrollTo ?? null;
    const idToScroll = hashId ?? stateId;
    if (!idToScroll) return;

    const t = setTimeout(() => {
      const el = document.getElementById(idToScroll);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);

    return () => clearTimeout(t);
  }, [location]);

  const TOURNAMENTS_TO_SHOW = 3;
  const tournamentsToDisplay = tournaments.slice(0, TOURNAMENTS_TO_SHOW);

  return (
    <div className="min-h-screen w-full bg-surface text-slate-900">
      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2a] to-[#0f0f0f]">
        {/* Animated Orbs Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Compite.<br />Domina.<br />Conquista.
          </h1>

          <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            La plataforma definitiva para organizar y participar en torneos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate("/signup")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all group"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Comenzar Gratis
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate("/torneos")}
              size="lg"
              variant="outline"
              className="border-2 border-purple-600/50 text-purple-300 hover:bg-purple-600/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ver Torneos
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-100/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </div>
      </section>
      
      {/* <section id="inicio" className="pt-32 pb-20 px-4 bg-surface-dark">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl text-white tracking-tight">Organizá - Jugá - Ganá</h1>
          <p className="text-gray-400 text-xl mt-5 mb-2">La plataforma definitiva para organizar torneos</p>
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => navigate("/torneos")} className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-6">Ver Torneos</Button>
            <Button onClick={() => navigate("/crearTorneo")} variant="outline" className="border-purple-600 text-purple-300 px-8 py-6">Organizar Torneo</Button>
          </div>
        </div>
      </section> */}

      <section id="torneos" className="mx-auto max-w-6xl px-4 pt-20 pb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-white text-3xl mb-2">Torneos Disponibles</h2>
            <p className="text-gray-400">Participá y competí en tu disciplina favorita</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {tournamentsToDisplay.map(t => {
            return (
              <TournamentCardAlt
                key={t.id}
                tournament={t}
              />
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/torneos")}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3"
          >
            Ver Más Torneos
          </Button>
        </div>
      </section>

      <section id="quienes-somos"><About /></section>
      <section id="preguntas-frecuentes"><Faq /></section>
      <section id="contacto"><Contact /></section>

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <h3 className="text-center text-slate-100 font-semibold mb-6">Patrocinadores</h3>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-center">
          <Logo text="XBOX" />
          <Logo text="Uruguay Natural" />
          <Logo text="VIBEZ" />
          <Logo text="logitech" />
        </div>
      </section>
    </div>
  );
};
