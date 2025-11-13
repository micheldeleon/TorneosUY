import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { schema, type FormValueRegister } from "../components/CustomForm/schemas";
import { useApi } from "../hooks/useApi";
import { postRegister, postLogin } from "../services/api.service";
import type { UserRegister, ApiResponse, AuthData, UserLogin } from "../models";
import { GoogleButton, RHFInput, Submit } from "../components/CustomForm";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/global.context";

export const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValueRegister>({
    resolver: zodResolver(schema)
  });

  const { fetch: registerFetch, data: registerData, error: registerError, loading: registering } = useApi<ApiResponse, UserRegister>(postRegister);
  const { fetch: loginFetch, data: loginData, error: loginError, loading: loggingIn } = useApi<AuthData, UserLogin>(postLogin);

  const [lastUser, setLastUser] = useState<UserRegister | null>(null);
  const { setUser, setToken } = useGlobalContext();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValueRegister> = async (formData) => {
    const { confirmPassword, ...user } = formData;
    setLastUser(user);

    registerFetch(user); 
  };

  // cuando register responde con éxito intentamos loguear automáticamente
  useEffect(() => {
    if (!registerData || registerError) return;

    // registro OK si tiene status 200
    if (registerData._status === 200 && lastUser) {
      loginFetch({
        username: lastUser.email,
        password: lastUser.password
      });
    }
  }, [registerData, registerError, lastUser]);

  // cuando login responde guardamos token/user y navegamos
  useEffect(() => {
    if (!loginData) return;
    if ((loginData as any).token) {
      setToken((loginData as any).token);
      setUser((loginData as any).user);
      navigate("/dashboard");
    }
  }, [loginData]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-login-from to-login-to">
        <div className="w-full max-w-md px-8 py-12">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            TuTorneo
          </h1>
          <h2 className="text-2xl text-center text-white mb-8">
            Crear Cuenta
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <RHFInput name="name" control={control} label="Nombre" error={errors.name?.message} />
            <RHFInput name="lastName" control={control} label="Apellido" type="text" error={errors.lastName?.message} />
            <RHFInput name="email" control={control} label="Email" error={errors.email?.message} />
            <RHFInput name="password" control={control} label="Contraseña" type="password" error={errors.password?.message} />
            <RHFInput name="confirmPassword" control={control} label="Confirmar contraseña" type="password" error={errors.confirmPassword?.message} />
            <Submit txt={registering || loggingIn ? "Procesando..." : "REGISTRARSE"} />
          </form>

          {/* mensajes */}
          {registerData?.message && <p className="text-sm text-green-300 mt-3">{registerData.message}</p>}
          {registerError?.message && <p className="text-sm text-rose-400 mt-3">{registerError.message}</p>}
          {loginError?.message && <p className="text-sm text-rose-400 mt-3">Login automático falló: {loginError.message}</p>}

          <GoogleButton text="G" />

          <div className="mt-8 text-center text-white text-sm font-semibold space-y-1">
            <p>
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={() => navigate("/login")}
                className="hover:underline cursor-pointer text-muted"
              >
                Inicia sesión aquí
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

