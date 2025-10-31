import { useParams } from "react-router-dom";
import { Badge, Button, Card, Checkbox, Progress } from "../../components/ui";

type Status = "Público" | "Privado";
type Tournament = {
  id: number;
  title: string;
  category: string;
  status: Status;
  price: number;
  date: string; // ISO
  participants: number;
  capacity: number;
};

const MOCK: Tournament[] = [
  { id: 1, title: "Campeonato Fútbol 5 x Campomar", category: "Fútbol", status: "Público", price: 500, date: "2025-10-21", participants: 5, capacity: 16 },
  { id: 3, title: "Torneo CS2 x XUruguay", category: "eSports - CS2", status: "Público", price: 1000, date: "2025-11-29", participants: 5, capacity: 8 },
];

function formatCurrency(value: number) {
  return value === 0
    ? "Gratis"
    : new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(value);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export default function TournamentDetails() {
  const params = useParams();
  const id = Number(params.id);
  const t = MOCK.find((x) => x.id === id) ?? MOCK[0];
  const progress = t.capacity > 0 ? (t.participants / t.capacity) * 100 : 0;
  const statusClass = t.status === "Público" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

  return (
    <div className="min-h-screen w-full bg-[#e9ebff] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: summary + inscription */}
        <Card className="lg:col-span-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-sm">⚽</span>
              <span className="text-xs">{t.category}</span>
            </div>
            <Badge className={statusClass}>{t.status}</Badge>
          </div>
          <h2 className="mt-2 text-base font-semibold text-slate-800">{t.title}</h2>

          <dl className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <dt className="opacity-70">Costo:</dt>
              <dd className="font-semibold">{formatCurrency(t.price)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="opacity-70">Fecha:</dt>
              <dd className="font-semibold">{formatDate(t.date)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="opacity-70">Participantes:</dt>
              <dd className="font-semibold">{`${t.participants} / ${t.capacity}`}</dd>
            </div>
            <Progress value={progress} />
          </dl>

          <div className="mt-4">
            <Checkbox label="Acepto Términos y Condiciones" />
          </div>

          <Button className="mt-4 w-full rounded-full bg-gradient-to-r from-[#3c0f7a] to-[#1c1d6a]">
            Inscribirme
          </Button>
        </Card>

        {/* Right: organizer + details */}
        <div className="lg:col-span-2 grid gap-6">
          <Card className="bg-gradient-to-br from-[#3c0f7a] to-[#1c1d6a] text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 grid place-items-center border border-white/20">
                <span className="text-2xl font-bold">N</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Nicolas Ramirez</div>
                <div className="text-[12px] opacity-80">Organizador</div>
                <div className="mt-1 text-[12px]">⭐⭐⭐⭐⭐ <span className="opacity-80">4.5/5</span></div>
              </div>
              <div className="text-lg">📞</div>
            </div>
          </Card>

          <Card>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="opacity-70">Formato:</div>
              <div>Eliminatoria</div>
              <div className="opacity-70">Lugar:</div>
              <div>Campomar fútbol 5</div>
              <div className="opacity-70">Premio:</div>
              <div>$3000</div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold mb-1">Detalles:</div>
              <p className="text-sm text-slate-700">
                Se juega en 1 sola jornada, partidos de 30 min, en caso de empate se define por penales.
                Se juega solo 1 partido por llave, no es ida y vuelta.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

