import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { About } from "./About";
import { Faq } from "./FAQ";
import { Contact } from "./Contact";
import { Logo } from "../components/Logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllTournaments } from "../services/api.service";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails } from "../models";
import { TournamentCardAlt } from "../components/TournamentCard/TournamentCardAlt";

export const HomeLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [tournaments, setTournaments] = useState<TournamentDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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


  const TOURNAMENTS_PER_PAGE = 4;
  const totalPages = Math.ceil(tournaments.length / TOURNAMENTS_PER_PAGE);
  const start = (currentPage - 1) * TOURNAMENTS_PER_PAGE;
  const end = start + TOURNAMENTS_PER_PAGE;
  const paginated = tournaments.slice(start, end);

  return (
    <div className="min-h-screen w-full bg-surface text-slate-900">
      <section id="inicio" className="pt-32 pb-20 px-4 bg-surface-dark">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl text-white tracking-tight">Organizá - Jugá - Ganá</h1>
          <p className="text-gray-400 text-xl mt-5 mb-2">La plataforma definitiva para organizar torneos</p>
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => document.getElementById("torneos")?.scrollIntoView({ behavior: "smooth" })} className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-6">Ver Torneos</Button>
            <Button onClick={() => navigate("/crearTorneo")} variant="outline" className="border-purple-600 text-purple-300 px-8 py-6">Organizar Torneo</Button>
          </div>
        </div>
      </section>

      <section id="torneos" className="mx-auto max-w-6xl px-4 pt-20 pb-20">
        <div className="flex items-center justify-between mb-12">

          <div>
            <h2 className="text-white text-3xl mb-2">Torneos Disponibles</h2>
            <p className="text-gray-400">Participá y competí en tu disciplina favorita</p>
          </div>
        </div>


        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {paginated.map(t => {
            const costText = t.registrationCost === 0 ? "Gratis" : new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(t.registrationCost);
            const dateText = new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(t.startAt));
            const participantsText = `${t.teamsInscribed} / ${t.maxParticipantsPerTournament}`;
            const esPrivado = t.privateTournament ? "Privado" : "Público";
            
            return (
              <TournamentCardAlt
                key={t.id}
                tournament={{
                  id: t.id,
                  tipo: t.discipline.name || "Sin Disciplina",
                  nombre: t.name,
                  fecha: dateText,
                  formato: t.format.name,
                  participantes: participantsText,
                  costo: costText,
                  badge: esPrivado,
                  estado: t.status
                }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="text-purple-400"> <ChevronLeft /> </Button>
          <span className="text-gray-400">{currentPage} / {totalPages}</span>
          <Button variant="ghost" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="text-purple-400"> <ChevronRight /> </Button>
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
