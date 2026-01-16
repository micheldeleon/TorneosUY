// src/models/updateTournament.model.ts
export interface UpdateTournamentRequest {
  // ✅ SIEMPRE MODIFICABLES (si el torneo está ABIERTO)
  name?: string;
  startAt?: string;
  endAt?: string;
  registrationDeadline?: string;
  detalles?: string;
  imageUrl?: string;
  privateTournament?: boolean;
  password?: string;
  minParticipantsPerTournament?: number;
  maxParticipantsPerTournament?: number;
  
  // ⚠️ SOLO MODIFICABLES SI NO HAY EQUIPOS INSCRITOS
  registrationCost?: number;
  prize?: string;
}

export interface UpdateTournamentResponse {
  success: boolean;
  data?: any;
  error?: string;
}
