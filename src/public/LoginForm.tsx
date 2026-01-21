import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema, type FormValueLogin } from "../components/CustomForm/schemas";
import { useApi } from "../hooks/useApi";
import type { UserLogin, AuthData } from "../models";
import { postLogin, postLoginWithGoogle } from "../services/api.service";
import { RHFInput, Submit } from "../components/CustomForm";
import { useGlobalContext } from "../context/global.context";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { decodeJWT } from "../services/utilities/jwt.utility";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleButton } from "../components/CustomForm/GoogleButton";

export const LoginForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValueLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { fetch, 
    data: response, 
    error, 
    loading 
  } = useApi<AuthData, UserLogin>(postLogin);

  const {
    fetch: googleFetch,
    data: googleResponse,
    error: googleError,
    loading: googleLoading,
  } = useApi<AuthData, string>(postLoginWithGoogle);
  
  const { setUser, setToken } = useGlobalContext();
  const navigate = useNavigate();
  const [googleUiError, setGoogleUiError] = useState<string | null>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleAuthSuccess = (auth: AuthData) => {
    if (auth.token.length !== 0 && auth.user) {
      const decoded = decodeJWT<{ authorities?: string[] }>(auth.token);
      const isOrganizer = decoded?.authorities?.includes("ROLE_ORGANIZER") ?? false;
      
      setToken(auth.token);
      setUser(auth.user);
      localStorage.setItem("isOrganizer", JSON.stringify(isOrganizer));
      
      navigate("/perfil");
    }
  };

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
    handleAuthSuccess(response);

  }, [response]);

  useEffect(() => {
    if (!googleResponse) return;
    handleAuthSuccess(googleResponse);
  }, [googleResponse]);

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
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-5xl">
              TuTorneo
            </h1>
          </Link>
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

            {/* Google Error Alert */}
            {(googleUiError || googleError) && !googleLoading && (
              <Alert className="mb-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {googleUiError ?? "No se pudo iniciar sesion con Google"}
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
            {googleClientId && (
              <GoogleOAuthProvider clientId={googleClientId}>
                <div style={{ display: 'none' }}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      const googleIdToken = credentialResponse.credential;
                      if (!googleIdToken) {
                        setGoogleUiError("No se pudo obtener el token de Google");
                        return;
                      }
                      setGoogleUiError(null);
                      googleFetch(googleIdToken);
                    }}
                    onError={() => setGoogleUiError("No se pudo iniciar sesión con Google")}
                    theme="outline"
                    size="large"
                    text="continue_with"
                  />
                </div>
                <GoogleButton 
                  text="Continuar con Google" 
                  onClick={() => {
                    // Trigger the hidden Google Login button
                    const googleButton = document.querySelector('[role="button"][aria-labelledby]') as HTMLElement;
                    googleButton?.click();
                  }}
                />
              </GoogleOAuthProvider>
            )}
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
