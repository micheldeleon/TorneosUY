import { z } from 'zod';

export const schema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    lastName: z.string().min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
    email: z.string().email({ message: 'El email no es valido' }).min(6, { message: 'El email debe tener al menos 6 caracteres' }),
    password: z.string().min(8, { message: 'La contraseAña debe tener al menos 8 caracteres' }),
    confirmPassword: z.string().min(8, { message: 'La confirmacion de la contraseAña debe tener al menos 8 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseAñas no coinciden',
    path: ['confirmPassword'],
});
export type FormValueRegister = z.infer<typeof schema>;
