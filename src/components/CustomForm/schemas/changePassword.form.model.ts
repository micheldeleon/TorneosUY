import { z } from 'zod';

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'La contraseña actual es requerida' }),
    newPassword: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    confirmNewPassword: z.string().min(8, { message: 'La confirmación de la contraseña debe tener al menos 8 caracteres' }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
});

export type FormValueChangePassword = z.infer<typeof changePasswordSchema>;
