import React from "react";
import { Card } from "../ui/Card";

export interface ProfileCardProps {
  name: string;
  role?: string;
  onEdit?: () => void;
}

function initialFrom(name: string) {
  const n = name?.trim();
  if (!n) return "?";
  return n[0]?.toUpperCase() ?? "?";
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, role = "Jugador", onEdit }) => {
  return (
    <Card className="bg-gradient-to-br from-brand-start to-brand-end text-white w-full max-w-xs h-72 relative overflow-hidden">
      <button
        onClick={onEdit}
        className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs opacity-80 hover:opacity-100"
      >
        <span>✎</span>
        <span>Editar</span>
      </button>

      <div className="mt-6 mx-auto grid place-items-center">
        <div className="w-28 h-28 rounded-full bg-white/10 grid place-items-center border border-white/20">
          <span className="text-4xl font-bold">{initialFrom(name)}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-[12px] opacity-80">{role}</div>
      </div>
    </Card>
  );
};

export default ProfileCard;
