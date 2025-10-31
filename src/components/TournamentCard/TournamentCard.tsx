import { EventCard } from "../EventCard";

interface TournamentCardProps {
  discipline: string;
  title: string;
  costText: string;
  dateText: string;
  statusClass: string;
  participantsText: string;
  progress: number;
  isDisabled?: boolean;
  onRegister?: () => void;
}

export function TournamentCard({
  discipline,
  title,
  costText,
  dateText,
  statusClass,
  participantsText,
  progress,
  isDisabled = false,
  onRegister,
}: TournamentCardProps) {
  return (
    <EventCard
      discipline={discipline}
      title={title}
      statusLabel="Estado"
      statusClassName={statusClass}
      rows={[
        { label: "Costo:", value: costText },
        { label: "Fecha:", value: dateText },
        { label: "Participantes:", value: participantsText },
      ]}
      progress={progress}
      cta={{ label: "Inscribirme", onClick: onRegister, disabled: isDisabled }}
    />
  );
}

