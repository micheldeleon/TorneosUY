
export interface TournamentCardProps {
    discipline: string;
    title: string;
    cost: number;
    status: "Público" | "Privado";
    date: string;
    participants: number;
    capacity: number;
}

export const TournamentCard = ({
  discipline,
  title,
  cost,
  status,
  date,
  participants,
  capacity,
}: TournamentCardProps) => {
  const isFree = cost === 0;
  const progress = Math.min(100, Math.max(0, (participants / capacity) * 100));

  return (
    <article
      className="rounded-2xl bg-white p-4 border border-black/5 shadow-[0_6px_20px_rgba(0,0,0,0.1)]
                 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">
            🏅
          </span>
          <span className="text-xs">{discipline}</span>
        </div>
        <span
          className={`text-[10px] rounded-full px-2 py-0.5 font-semibold ${
            status === "Público"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {status}
        </span>
      </div>

      <h4 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-800">
        {title}
      </h4>

      <dl className="mt-4 space-y-2 text-xs text-slate-700">
        <div className="flex items-center justify-between">
          <dt className="opacity-70">Costo:</dt>
          <dd className="font-semibold">{isFree ? "Gratis" : `$ ${cost}`}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="opacity-70">Fecha:</dt>
          <dd className="font-semibold">{date}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="opacity-70">Participantes:</dt>
          <dd className="font-semibold">
            {participants} / {capacity}
          </dd>
        </div>

        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-[#1c1d6a]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </dl>

      <button
        type="button"
        className="mt-4 w-full rounded-full bg-[#27266e] py-2 text-xs font-semibold text-white hover:bg-[#1e1e5a] transition-colors"
      >
        Inscribirme
      </button>
    </article>
  );
};

