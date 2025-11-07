import { Hero } from "../components/Hero/Hero";
import { TournamentCard } from "../components/TournamentCard/TournamentCard";
import { useNavigate } from "react-router-dom";

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

const TOURNAMENTS: Readonly<Tournament[]> = [
  { id: 1, title: "Campeonato Fútbol 5 x Campomar", category: "Fútbol", status: "Público", price: 500, date: "2025-10-21", participants: 5, capacity: 16 },
  { id: 2, title: "Carrera running", category: "Running", status: "Público", price: 0,   date: "2025-11-02", participants: 23, capacity: 25 },
  { id: 3, title: "Torneo CS2 x XUruguay", category: "eSports - CS2", status: "Público", price: 1000, date: "2025-11-29", participants: 5,  capacity: 8 },
  { id: 4, title: "Campeonato Fútbol 11 x Alcobendas", category: "Fútbol", status: "Privado", price: 700, date: "2025-12-01", participants: 14, capacity: 16 },
];

export const HomeLanding: React.FC = () => {
  const page = 1;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-surface text-slate-900">
      <Hero />

      {/* TORNEOS */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-center mx-auto md:mx-0 text-lg font-semibold text-slate-100">
            Torneos Disponibles
          </h2>

          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 text-sm text-slate-100 hover:text-slate-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5h18v2H3zm3 6h12v2H6zm3 6h6v2H9z" />
            </svg>
            Filtrar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700";

            return (
              <TournamentCard
                key={t.id}
                discipline={t.category}
                title={t.title}
                costText={costText}
                dateText={dateText}
                participantsText={participantsText}
                statusClass={statusClass}
                progress={progress}
                isDisabled={t.participants >= t.capacity}
                onRegister={() => navigate(`/torneo/${t.id}`)}
              />
            );
          })}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-100">
          <button className="hover:underline text-sm">&lt;</button>
          <span className="text-sm">{page}</span>
          <button className="hover:underline text-sm">&gt;</button>
        </div>
      </section>
    </div>
  );
};
