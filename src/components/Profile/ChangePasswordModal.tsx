import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Alert, AlertDescription } from "../ui/Alert";
import { changePasswordSchema, type FormValueChangePassword } from "../CustomForm/schemas";

interface ChangePasswordModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal = ({ userId, onClose, onSuccess }: ChangePasswordModalProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValueChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");

  // Función para evaluar la fortaleza de la contraseña (igual que en RegisterForm)
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

  const strength = passwordStrength(newPassword);

  const onSubmit = async (data: FormValueChangePassword) => {
    setError(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al cambiar la contraseña");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="bg-gradient-to-br from-[#2a1f3d]/95 via-[#1f1635]/95 to-[#2a1f3d]/95 border-purple-500/30 p-8 max-w-md w-full relative overflow-hidden shadow-2xl">
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 rounded-2xl"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-2xl font-semibold">Cambiar Contraseña</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={submitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="mb-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>¡Contraseña actualizada exitosamente!</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="mb-6 bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/50 text-red-300 shadow-lg shadow-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label className="text-purple-200">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  {...register("currentPassword")}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 pr-10 ${
                    errors.currentPassword && "border-red-500"
                  }`}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-400 text-sm">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-purple-200">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  {...register("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 pr-10 ${
                    errors.newPassword && "border-red-500"
                  }`}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Fortaleza</span>
                    <span
                      className={
                        strength.strength >= 66
                          ? "text-green-400"
                          : strength.strength >= 33
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`${strength.color} h-full transition-all duration-300`}
                      style={{ width: `${strength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className="text-red-400 text-sm">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label className="text-purple-200">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  {...register("confirmNewPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 pr-10 ${
                    errors.confirmNewPassword && "border-red-500"
                  }`}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>

                {confirmNewPassword && newPassword === confirmNewPassword && (
                  <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>

              {errors.confirmNewPassword && (
                <p className="text-red-400 text-sm">{errors.confirmNewPassword.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50"
                disabled={submitting || success}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cambiando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Actualizada
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
