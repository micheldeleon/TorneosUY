import { loginSchema, type FormValueLogin } from '../../components/CustomForm/schemas';
import { GoogleButton, Submit, InputForm } from '../../components/CustomForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValueLogin>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit: SubmitHandler<FormValueLogin> = (data) => {
        console.log(data);
    };

    const navigate = useNavigate();
    return (
        <>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2a0b57] to-[#13215a]">
                <div className="w-full max-w-md px-8 py-12">
                    <h1 className="text-4xl font-bold text-center text-white mb-12">
                        TORNEOS UY
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <InputForm name="email" control={control} label="Email" error={errors.email?.message} />
                        <InputForm name="password" control={control} label="Contraseña" type="password" error={errors.password?.message} />
                        <Submit txt="INGRESAR" />
                        <GoogleButton text='G' />
                    </form>

                    <div className="mt-8 text-center text-white text-sm font-semibold space-y-1">
                        <p className="hover:underline cursor-pointer">Olvide mi contraseña</p>
                        <p>
                            ¿No tienes cuenta?{" "}
                            <span
                                onClick={() => navigate("/signup")}
                                className="hover:underline cursor-pointer text-[#d9d9f3]"
                            >
                                Regístrate aquí
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default LoginForm;