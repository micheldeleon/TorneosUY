import { z } from 'zod';

export const schema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    lastName: z.string().min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
    email: z.string().email({ message: 'El email no es valido' }).min(6, { message: 'El email debe tener al menos 6 caracteres' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'La confirmacion de la contraseña debe tener al menos 6 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});
export type FormValue = z.infer<typeof schema>;