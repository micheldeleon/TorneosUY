import { Badge, Button, Card, Progress } from "../ui";
import React from "react";

export interface EventRow {
  label: string;
  value: string;
}

export interface EventCardProps {
  icon?: React.ReactNode;
  discipline: string;
  title: string;
  statusLabel?: string;
  statusClassName?: string;
  rows: EventRow[];
  progress?: number;
  cta?: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  };
}

export const EventCard: React.FC<EventCardProps> = ({
  icon = "★",
  discipline,
  title,
  statusLabel,
  statusClassName,
  rows,
  progress,
  cta,
}) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">
            {icon as any}
          </span>
          <span className="text-xs">{discipline}</span>
        </div>
        {statusLabel && (
          <Badge className={statusClassName}>{statusLabel}</Badge>
        )}
      </div>

      <h4 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-100">{title}</h4>

      <dl className="mt-4 space-y-2 text-xs text-slate-300">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <dt className="opacity-70">{r.label}</dt>
            <dd className="font-semibold">{r.value}</dd>
          </div>
        ))}

        {typeof progress === "number" && <Progress value={progress} />}
      </dl>

      {cta && (
        <Button
          onClick={cta.onClick}
          disabled={cta.disabled}
          size="sm"
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
        >
          {cta.label}
        </Button>
      )}
    </Card>
  );
};

export default EventCard;

