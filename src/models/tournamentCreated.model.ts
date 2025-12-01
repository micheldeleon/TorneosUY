export interface TournamentCreated {
  id: number;
  name: string;
  createdAt: string;
  startAt: string;
  endAt: string;
  privateTournament: boolean;
  prize: string;
  registrationCost: number;
  registrationDeadline: string;
  minParticipantsPerTeam: number;
  maxParticipantsPerTeam: number;
  minParticipantsPerTournament: number;
  maxParticipantsPerTournament: number;
  format: {
    id: number;
    name: string;
    generaFixture: boolean;
  };
  discipline: {
    id: number;
    name: string | null;
    collective: boolean;
  };
  _status: number;
}
