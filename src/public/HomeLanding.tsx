import { Hero } from "../components/Hero/Hero";
import { TournamentCard } from "../components/TournamentCard/TournamentCard";


type Tournament = {
  id: number;
  title: string;
  category: string;
  status: "Público" | "Privado";
  price: number;
  date: string;
  participants: number;
  capacity: number;
};

const TOURNAMENTS: Readonly<Tournament[]> = [
  {
    id: 1,
    title: "Campeonato Fútbol 5 x Campomar",
    category: "Fútbol",
    status: "Público",
    price: 500,
    date: "21 - 10 - 2025",
    participants: 5,
    capacity: 16,
  },
  {
    id: 2,
    title: "Carrera running",
    category: "Running",
    status: "Público",
    price: 0,
    date: "2 - 11 - 2025",
    participants: 23,
    capacity: 25,
  },
  {
    id: 3,
    title: "Torneo CS2 x XUruguay",
    category: "eSports - CS2",
    status: "Público",
    price: 1000,
    date: "29 - 11 - 2025",
    participants: 5,
    capacity: 8,
  },
  {
    id: 4,
    title: "Campeonato Fútbol 11 x Alcobendas",
    category: "Fútbol",
    status: "Privado",
    price: 700,
    date: "1 - 12 - 2025",
    participants: 14,
    capacity: 16,
  },
];

export const HomeLanding: React.FC = () => {
  const page = 2;

  return (
    <div className="min-h-screen w-full bg-[#e9ebff] text-slate-900">
  
      <Hero />
      {/* TORNEOS */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-center mx-auto md:mx-0 text-lg font-semibold text-slate-700">
            Torneos Disponibles
          </h2>

          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
            aria-label="Filtrar torneos"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5h18v2H3zm3 6h12v2H6zm3 6h6v2H9z" />
            </svg>
            Filtrar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOURNAMENTS.map(t => (
            <TournamentCard
              key={t.id}
              discipline={t.category}
              title={t.title}
              cost={t.price}
              status={t.status}
              date={t.date}
              participants={t.participants}
              capacity={t.capacity}
            />
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-700">
          <button className="hover:underline text-sm">&lt;</button>
          <span className="text-sm">{page}</span>
          <button className="hover:underline text-sm">&gt;</button>
        </div>
      </section>

     
    </div>
  );
};
