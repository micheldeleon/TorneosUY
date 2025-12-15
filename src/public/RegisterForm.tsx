import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { schema as registerSchema, type FormValueRegister } from "../components/CustomForm/schemas";
import { Trophy, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { RHFInput } from "../components/CustomForm/RHFInput";
import { GoogleButton } from "../components/CustomForm/GoogleButton";
import { Submit } from "../components/CustomForm/Submit";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { postRegister, postLogin } from "../services/api.service";
import type { UserRegister, ApiResponse, AuthData, UserLogin } from "../models";
import { useGlobalContext } from "../context/global.context";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control
  } = useForm<FormValueRegister>({
    resolver: zodResolver(registerSchema)
  });

  const navigate = useNavigate();
  const { setUser, setToken } = useGlobalContext();

  const {
    fetch: registerFetch,
    data: registerData,
    error: registerError,
    loading: registering
  } = useApi<ApiResponse, UserRegister>(postRegister);

  const {
    fetch: loginFetch,
    data: loginData,
    error: loginError,
    loading: loggingIn
  } = useApi<AuthData, UserLogin>(postLogin);

  const [lastUser, setLastUser] = useState<UserRegister | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit: SubmitHandler<FormValueRegister> = async (formData) => {
    setUiError(null);

    const { confirmPassword, ...user } = formData;
    setLastUser(user);
    registerFetch(user);
  };

  // luego del registro → login automático
  useEffect(() => {
    if (!registerData || registerError) return;

    if (registerData._status === 200 && lastUser) {
      loginFetch({
        username: lastUser.email,
        password: lastUser.password
      });
    }
  }, [registerData, registerError, lastUser]);

  // login final → navegar y guardar contexto
  useEffect(() => {
    if (!loginData) return;

    if ((loginData as any).token) {
      setToken((loginData as any).token);
      setUser((loginData as any).user);
      navigate("/dashboard");
    }
  }, [loginData]);

  // fuerza contraseña UI
  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "Débil", color: "bg-red-500" };
    if (strength <= 3) return { strength: 66, label: "Media", color: "bg-yellow-500" };
    return { strength: 100, label: "Fuerte", color: "bg-green-500" };
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2a] to-[#0f0f0f] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Animated Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
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

          <h2 className="text-white text-3xl mb-2 drop-shadow-lg">
            Crear Cuenta
          </h2>
          <p className="text-purple-300">
            Únete a la comunidad de torneos
          </p>
        </div>

        {/* CARD */}
        <div className="bg-gradient-to-br from-[#2a1f3d]/80 via-[#1f1635]/80 to-[#2a1f3d]/80 border border-purple-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 rounded-2xl"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="relative z-10">

            {/* errores API */}
            {(registerError || loginError || uiError) && (
              <Alert className="mb-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {registerError?.message ||
                    loginError?.message ||
                    uiError ||
                    "Ocurrió un error."}
                </AlertDescription>
              </Alert>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Nombre */}
              <RHFInput
                name="name"
                control={control}
                label="Nombre"
                type="text"
                error={errors.name?.message}
                placeholder="Tu nombre"
              />

              {/* Apellido */}
              <RHFInput
                name="lastName"
                control={control}
                label="Apellido"
                type="text"
                error={errors.lastName?.message}
                placeholder="Tu apellido"
              />

              {/* Email */}
              <RHFInput
                name="email"
                control={control}
                label="Email"
                error={errors.email?.message}
                placeholder="tu@email.com"
                type="email"
              />

              {/* Pass */}
              <div className="space-y-2">
                <RHFInput
                  name="password"
                  control={control}
                  label="Contraseña"
                  type="password"
                  error={errors.password?.message}
                  placeholder="••••••••"
                />

                {/* Strength */}
                {password && (
                  <div className="mt-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Fortaleza</span>
                      <span className={
                        strength.strength >= 66 ? "text-green-400" :
                          strength.strength >= 33 ? "text-yellow-400" :
                            "text-red-400"
                      }>
                        {strength.label}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-gray-700 rounded-full">
                      <div
                        className={`${strength.color} h-full transition-all`}
                        style={{ width: `${strength.strength}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
              </div>

              {/* Confirm pass */}
              <div className="space-y-2">
                <Label className="text-purple-200">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 ${errors.confirmPassword && "border-red-500"
                      }`}
                  />

                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                  )}
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <Submit txt={registering || loggingIn ? "Registrando usuario..." : "CREAR CUENTA"} loading={registering || loggingIn} />
            </form>
            {/* Loading State */}
            {(registering || loggingIn) && (
              <div className="mt-4 flex items-center justify-center gap-2 text-purple-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{registering ? "Registrando usuario..." : "Iniciando sesión..."}</span>
              </div>
            )}

            <GoogleButton text="Continuar con Google" />
          </div>
        </div>
        {/* Link login */}
        <div className="mt-6 text-center">
          <p className="text-purple-200">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
        {/* Animaciones */}
        <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      </div>
    </div>
  );
};
