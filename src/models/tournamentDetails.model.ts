export type TournamentDetails = {
  id: number;
  disciplineId?: number;
  teamsInscribed: number;
  name: string;
  createdAt: string;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  privateTournament: boolean;
  prize: string;
  registrationCost: number;
  minParticipantsPerTeam: number;
  maxParticipantsPerTeam: number;
  minParticipantsPerTournament: number;
  maxParticipantsPerTournament: number;
  organizerId?: number;
  status: string;
  isDoubleRound?: boolean;
  _status?: number;
  format: {
    winPoints?: number;
    drawPoints?: number;
    lossPoints?: number;
    id: number;
    name: string;
    generaFixture: boolean;
  };
  discipline: {
    id: number;
    name: string | null;
    collective: boolean;
    formats?: null;
  };
  password: string | null;
  detalles: string | null;
  teams?: {
    id: number;
    name: string;
    participants: {
      id: number;
      nationalId: string;
      fullName: string;
    }[];
    creator: any;
    createdAt: string;
  }[];
};
