import { EventCard } from "../EventCard";

interface TournamentCardProps {
  discipline: string;
  title: string;
  costText: string;
  dateText: string;
  statusClass: string;
  statusLabel: string;
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
  statusLabel,
  participantsText,
  progress,
  isDisabled = false,
  onRegister,
}: TournamentCardProps) {
  return (
    <EventCard
      discipline={discipline}
      title={title}
      statusLabel={statusLabel}
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

