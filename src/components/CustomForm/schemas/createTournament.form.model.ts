import { z } from "zod";

export const createTournamentSchema = z.object({
  discipline: z.string().min(1, "Debes seleccionar una disciplina"),
  format: z.string().min(1, "Debes seleccionar un formato"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  registrationDeadline: z.string().min(1, "Debes seleccionar una fecha"),
  startAt: z.string().min(1, "Debes seleccionar una fecha"),
  endAt: z.string().min(1, "Debes seleccionar una fecha"),
  minParticipantsPerTeam: z.number().min(1, "Debe ser al menos 1"),
  maxParticipantsPerTeam: z.number().min(1, "Debe ser al menos 1"),
  minParticipantsPerTournament: z.number().min(1, "Debe ser al menos 1"),
  maxParticipantsPerTournament: z.number().min(1, "Debe ser al menos 1"),
  registrationCost: z.number().min(0, "El costo no puede ser negativo"),
  prize: z.string().optional(),
  detalles: z.string().optional(),
  isPrivate: z.boolean(),
  password: z.string().optional(),
  isDoubleRound: z.boolean().optional(),
  acceptTerms: z.boolean(),
}).refine((data) => data.maxParticipantsPerTeam >= data.minParticipantsPerTeam, {
  message: "El máximo debe ser mayor o igual al mínimo",
  path: ["maxParticipantsPerTeam"],
}).refine((data) => data.maxParticipantsPerTournament >= data.minParticipantsPerTournament, {
  message: "El máximo debe ser mayor o igual al mínimo",
  path: ["maxParticipantsPerTournament"],
}).refine((data) => {
  const reg = new Date(data.registrationDeadline);
  const start = new Date(data.startAt);
  return reg <= start;
}, {
  message: "La fecha límite debe ser antes o el mismo día del inicio",
  path: ["registrationDeadline"],
}).refine((data) => {
  const start = new Date(data.startAt);
  const end = new Date(data.endAt);
  return start <= end;
}, {
  message: "La fecha de inicio debe ser antes del fin",
  path: ["endAt"],
}).refine((data) => !data.isPrivate || (data.isPrivate && data.password && data.password.length >= 4), {
  message: "Debes ingresar una contraseña de al menos 4 caracteres",
  path: ["password"],
}).refine((data) => data.acceptTerms === true, {
  message: "Debes aceptar los términos y condiciones",
  path: ["acceptTerms"],
});

export type FormValueCreateTournament = z.infer<typeof createTournamentSchema>;