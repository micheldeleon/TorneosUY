import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema, type FormValueLogin } from "../components/CustomForm/schemas";
import { useApi } from "../hooks/useApi";
import type { UserLogin, AuthData } from "../models";
import { postLogin } from "../services/api.service";
import { GoogleButton, RHFInput, Submit } from "../components/CustomForm";
import { useGlobalContext } from "../context/global.context";
import { useEffect } from "react";
import { Trophy, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/Alert";

export const LoginForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValueLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { fetch, data: response, error, loading } = useApi<AuthData, UserLogin>(postLogin);
  const { setUser, setToken } = useGlobalContext();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValueLogin> = async (data) => {
    const userLogin: UserLogin = {
      username: data.email,
      password: data.password
    };
    await fetch(userLogin);
  };

  useEffect(() => {
    if (!response) return;
    console.log('response', response);
    if (response.token.length !== 0 && response.user) {
      setToken(response.token);
      setUser(response.user);
      navigate("/perfil");
    }

  }, [response]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1232] to-[#1a0d2e] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-violet-500 to-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 transform hover:scale-110 hover:rotate-3 transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-transparent opacity-50 rounded-2xl"></div>
              <Trophy className="w-9 h-9 text-purple-900 relative z-10" />
            </div>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-5xl">
              TuTorneo
            </h1>
          </div>
          <h2 className="text-white text-3xl mb-2 drop-shadow-lg">Iniciar Sesión</h2>
          <p className="text-purple-300">Bienvenido de vuelta a la comunidad</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#2a1f3d]/80 via-[#1f1635]/80 to-[#2a1f3d]/80 border border-purple-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 rounded-2xl"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>

          <div className="relative z-10">
            {/* Error Alert */}
            {error && !loading && (
              <Alert className="mb-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Email y/o contraseña incorrectos
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <RHFInput
                name="email"
                control={control}
                label="Email"
                error={errors.email?.message}
                placeholder="tu@email.com"
                type="email"
              />

              <RHFInput
                name="password"
                control={control}
                label="Contraseña"
                type="password"
                error={errors.password?.message}
                placeholder="••••••••"
              />

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    className="rounded border-gray-700 bg-[#1a1a1a] text-purple-600 focus:ring-purple-600 focus:ring-offset-0"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <Submit txt={loading ? "Iniciando sesión..." : "INGRESAR"} />
            </form>

            {/* Loading State */}
            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-purple-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Iniciando sesión...</span>
              </div>
            )}

            {/* Google Button */}
            <GoogleButton text="Continuar con Google" />
          </div>
        </div>

        {/* Sign up link */}
        <div className="mt-6 text-center">
          <p className="text-purple-200">
            ¿No tienes cuenta?{" "}
            <Link
              to="/signup"
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
