import { EventCard } from "../EventCard";

export interface InscriptionCardProps {
  discipline: string;
  title: string;
  status: "Público" | "Privado" | "Pǧblico"; // incluye variante codificada
  price: number; // UYU
  date: string; // ISO
  participants: number;
  capacity: number;
  onView?: () => void;
}

export const InscriptionCard = ({
  discipline,
  title,
  status,
  price,
  date,
  participants,
  capacity,
  onView,
}: InscriptionCardProps) => {
  const costText =
    price === 0
      ? "Gratis"
      : new Intl.NumberFormat("es-UY", {
          style: "currency",
          currency: "UYU",
          maximumFractionDigits: 0,
        }).format(price);

  const dateText = new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

  const participantsText = `${participants} / ${capacity}`;
  const progress = capacity > 0 ? (participants / capacity) * 100 : 0;
  const isPublic = status === "Público" || status === "Pǧblico";
  const statusClass = isPublic
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";

  return (
    <EventCard
      discipline={discipline}
      title={title}
      statusLabel={isPublic ? "Público" : "Privado"}
      statusClassName={statusClass}
      rows={[
        { label: "Costo:", value: costText },
        { label: "Fecha:", value: dateText },
        { label: "Participantes:", value: participantsText },
      ]}
      progress={progress}
      cta={{
        label: "Ver",
        onClick: onView,
        className: "bg-gradient-to-r from-[#3c0f7a] to-[#1c1d6a]",
      }}
    />
  );
};

export default InscriptionCard;

