// src/models/createTournament.model.ts
export interface CreateTournament {
  disciplineId: number;
  formatId: number;
  name: string;
  startAt: string; // ISO string
  endAt: string;   // ISO string
  registrationDeadline: string; // ISO string
  privateTournament: boolean;
  password: string | null;
  minParticipantsPerTeam: number;
  maxParticipantsPerTeam: number;
  minParticipantsPerTournament: number;
  maxParticipantsPerTournament: number;
  prize?: string;
  registrationCost: number;
}
