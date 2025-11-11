import { TournamentCard } from "../components/TournamentCard/TournamentCard";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { About } from "./About";
import { Faq } from "./FAQ";
import { Contact } from "./Contact";
import { Logo } from "../components/Logo";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Tournament = {
  id: number;
  title: string;
  category: string;
  status: "Público" | "Privado";
  price: number;
  date: string; // ISO YYYY-MM-DD
  participants: number;
  capacity: number;
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const TOURNAMENTS: Readonly<Tournament[]> = [
  { id: 1, title: "Campeonato Fútbol 5 x Campomar", category: "Fútbol", status: "Público", price: 500, date: "2025-10-21", participants: 5, capacity: 16 },
  { id: 2, title: "Carrera running", category: "Running", status: "Público", price: 0, date: "2025-11-02", participants: 23, capacity: 25 },
  { id: 3, title: "Torneo CS2 x XUruguay", category: "eSports - CS2", status: "Público", price: 1000, date: "2025-11-29", participants: 5, capacity: 8 },
  { id: 4, title: "Campeonato Fútbol 11 x Alcobendas", category: "Fútbol", status: "Privado", price: 700, date: "2025-12-01", participants: 14, capacity: 16 },
];

export const HomeLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // hook movido dentro del componente (corrección)
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // prioridad: hash, luego state.scrollTo
    const hashId = location.hash ? location.hash.replace("#", "") : null;
    const stateId = (location.state as any)?.scrollTo ?? null;
    const idToScroll = hashId ?? stateId;
    if (!idToScroll) return;

    // delay pequeño para asegurar que DOM está listo
    const t = setTimeout(() => {
      const el = document.getElementById(idToScroll);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // fallback: ir arriba
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);

    return () => clearTimeout(t);
  }, [location]);

  return (
    <div className="min-h-screen w-full bg-surface text-slate-900">
      {/* <Hero /> */}
      <section id="inicio" className="pt-32 pb-20 px-4 bg-surface-dark">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl text-white tracking-tight">
              Organizá - Jugá - Ganá
            </h1>
            <p className="text-gray-400 text-xl">
              La plataforma definitiva para organizar y participar en torneos deportivos y de eSports
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button
                onClick={() => scrollToSection("torneos")}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 py-6"
              >
                Ver Torneos
              </Button>
              <Button
                onClick={() => scrollToSection("contacto")}
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-600/10 px-8 py-6"
              >
                Organizar Torneo
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* TORNEOS */}
      <section id="torneos" className="mx-auto max-w-6xl px-4 pt-20 pb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-white text-3xl mb-2">Torneos Disponibles</h2>
            <p className="text-gray-400">Únete a la competencia y demuestra tu habilidad</p>
          </div>
          <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600/10">
            <span className="mr-2">⚙️</span> Filtrar
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4  mb-8">
          {TOURNAMENTS.map(t => {
            const costText = t.price === 0
              ? "Gratis"
              : new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(t.price);

            const dateText = new Intl.DateTimeFormat("es-UY", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(t.date));

            const participantsText = `${t.participants} / ${t.capacity}`;
            const progress = t.capacity > 0 ? (t.participants / t.capacity) * 100 : 0;

            const statusClass =
              t.status === "Público"
                ? "bg-gradient-to-r from-purple-600 to-green-800 text-white border-surface"
                : "bg-gradient-to-r from-purple-600 to-red-800 text-white border-surface";

            return (
              <TournamentCard
                key={t.id}
                discipline={t.category}
                title={t.title}
                costText={costText}
                dateText={dateText}
                participantsText={participantsText}
                statusLabel={t.status}
                statusClass={statusClass}
                progress={progress}
                isDisabled={t.participants >= t.capacity}
                onRegister={() => navigate(`/torneo/${t.id}`)}
              />
            );
          })}
        </div>

        {/* Paginación */}
        
        <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-gray-400">
              {currentPage}
            </span>
            <Button
              variant="ghost"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
      </section>
      <section id="quienes-somos">
        <About />
      </section>
      <section id="preguntas-frecuentes">
        <Faq />
      </section>
      <section id="contacto">
        <Contact />
      </section>
      {/* Patrocinadores */}

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <h3 className="text-center text-slate-100 font-semibold mb-6 ">
          Patrocinadores
        </h3>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-center ">
          <Logo text="XBOX" />
          <Logo text="Uruguay Natural" />
          <Logo text="VIBEZ" />
          <Logo text="logitech" />
        </div>
      </section>

    </div>
  );
};