// src/services/utilities/validateBeforeUpdate.utility.ts
import type { TournamentDetails, UpdateTournamentRequest } from '../../models';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateBeforeUpdate = (
  tournament: TournamentDetails,
  newData: UpdateTournamentRequest
): ValidationResult => {
  // 1. Verificar estado
  if (tournament.status !== 'ABIERTO') {
    return {
      valid: false,
      error: `Solo se pueden editar torneos en estado ABIERTO. Estado actual: ${tournament.status}`
    };
  }

  // 2. Verificar si intenta cambiar precio/premio con equipos inscritos
  const hasTeams = tournament.teamsInscribed > 0;
  const isPriceChanging =
    newData.registrationCost !== undefined &&
    newData.registrationCost !== tournament.registrationCost;
  const isPrizeChanging =
    newData.prize !== undefined && newData.prize !== tournament.prize;

  if (hasTeams && isPriceChanging) {
    return {
      valid: false,
      error: 'No puedes cambiar el precio de inscripción cuando hay equipos inscritos'
    };
  }

  if (hasTeams && isPrizeChanging) {
    return {
      valid: false,
      error: 'No puedes cambiar el premio cuando hay equipos inscritos'
    };
  }

  // 3. Validar fechas
  const startDate = newData.startAt ? new Date(newData.startAt) : null;
  const endDate = newData.endAt ? new Date(newData.endAt) : null;
  const regDeadline = newData.registrationDeadline
    ? new Date(newData.registrationDeadline)
    : null;

  if (startDate && endDate && endDate < startDate) {
    return {
      valid: false,
      error: 'La fecha de fin debe ser posterior a la fecha de inicio'
    };
  }

  if (regDeadline && startDate && regDeadline > startDate) {
    return {
      valid: false,
      error: 'La fecha límite de inscripción debe ser anterior al inicio del torneo'
    };
  }

  // 4. Validar participantes
  if (
    newData.minParticipantsPerTournament !== undefined &&
    newData.maxParticipantsPerTournament !== undefined &&
    newData.minParticipantsPerTournament > newData.maxParticipantsPerTournament
  ) {
    return {
      valid: false,
      error: 'El mínimo de participantes no puede ser mayor al máximo'
    };
  }

  // 5. Validar contraseña si es privado
  if (newData.privateTournament && !newData.password) {
    return {
      valid: false,
      error: 'Los torneos privados requieren contraseña'
    };
  }

  // 6. Validar nombre no vacío
  if (newData.name !== undefined && newData.name.trim() === '') {
    return {
      valid: false,
      error: 'El nombre del torneo no puede estar vacío'
    };
  }

  return { valid: true };
};
