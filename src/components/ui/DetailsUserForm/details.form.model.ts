import { z } from "zod";

export const schema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  lastName: z.string().min(3, { message: "El apellido debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "El email no es válido" }),
  dateOfBirth: z.string().min(1, { message: "La fecha de nacimiento es obligatoria" }),
  nationalId: z.string().min(7, { message: "La cédula debe tener al menos 7 dígitos" }),
  phoneNumber: z.string().min(6, { message: "El número de teléfono es obligatorio" }),
  address: z.string().min(3, { message: "La dirección debe tener al menos 3 caracteres" }),
  departmentId: z.number().int().nonnegative({ message: "El departamento debe ser válido" }),
});

export type FormValueDetails = z.infer<typeof schema>;

