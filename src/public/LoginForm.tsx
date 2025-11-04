
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginSchema, type FormValueLogin } from "../components/CustomForm/schemas";
import { useApi } from "../hooks/useApi";
import type { UserLogin, AuthData } from "../models";
import { postLogin } from "../services/api.service";
import { GoogleButton, RHFInput, Submit } from "../components/CustomForm";
import { useGlobalContext } from "../context/global.context";
import { useEffect } from "react";


export const LoginForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValueLogin>({
    resolver: zodResolver(loginSchema)
  });
  const { fetch, data: response, error, loading } = useApi<AuthData, UserLogin>(postLogin);
  const { setUser, setToken } = useGlobalContext()
  const onSubmit: SubmitHandler<FormValueLogin> = async (data) => {
    const userLogin: UserLogin = { username: data.email, password: data.password };
    await fetch(userLogin);

  };
  useEffect(() => {
    if (!response) return;
    console.log('response', response)
    if (response.token.length != 0 && response.user) {
      console.log('hola')
      setToken(response.token);
      setUser(response.user);
      navigate("/dashboard");
    }
  }, [response, setToken, setUser]);

  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-login-from to-login-to">
        <div className="w-full max-w-md px-8 py-12">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            TORNEOS UY
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <RHFInput name="email" control={control} label="Email" error={errors.email?.message} />
            <RHFInput name="password" control={control} label="Contraseña" type="password" error={errors.password?.message} />
            <Submit txt="INGRESAR" />
          </form>
          {loading && <span className="text-blue-200 text-sm">Iniciando sesión...</span>}
          {error && <span className="text-red-300 text-sm">email y/o contraseña</span>}


          <GoogleButton text="G" />
          <div className="mt-8 text-center text-white text-sm font-semibold space-y-1">
            <p className="hover:underline cursor-pointer">Olvidé mi contraseña</p>
            <p>
              ¿No tienes cuenta?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="hover:underline cursor-pointer text-muted"
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


