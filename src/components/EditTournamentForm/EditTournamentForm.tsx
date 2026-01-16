// src/components/EditTournamentForm/EditTournamentForm.tsx
import React, { useState } from 'react';
import type { TournamentDetails, UpdateTournamentRequest } from '../../models';
import { useUpdateTournament } from '../../hooks/useUpdateTournament';
import { validateBeforeUpdate } from '../../services/utilities/validateBeforeUpdate.utility';
import { FileText, Calendar, Users, DollarSign, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface Props {
  tournament: TournamentDetails;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditTournamentForm: React.FC<Props> = ({
  tournament,
  onSuccess,
  onCancel
}) => {
  const { update, loading, error: apiError, setError } = useUpdateTournament();
  const [formData, setFormData] = useState({
    name: tournament.name,
    startAt: tournament.startAt?.split('T')[0] || '',
    endAt: tournament.endAt?.split('T')[0] || '',
    registrationDeadline: tournament.registrationDeadline?.split('T')[0] || '',
    detalles: tournament.detalles || '',
    privateTournament: tournament.privateTournament,
    password: tournament.password || '',
    minParticipantsPerTournament: tournament.minParticipantsPerTournament,
    maxParticipantsPerTournament: tournament.maxParticipantsPerTournament,
    registrationCost: tournament.registrationCost,
    prize: tournament.prize || ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Verificar si hay equipos inscritos
  const hasTeams = tournament.teamsInscribed > 0;
  const canEdit = tournament.status === 'ABIERTO';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    // Preparar datos (convertir fechas a ISO)
    const updateData: UpdateTournamentRequest = {
      name: formData.name,
      startAt: formData.startAt ? new Date(formData.startAt).toISOString() : undefined,
      endAt: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
      registrationDeadline: formData.registrationDeadline
        ? new Date(formData.registrationDeadline).toISOString()
        : undefined,
      detalles: formData.detalles,
      privateTournament: formData.privateTournament,
      password: formData.privateTournament ? formData.password : undefined,
      minParticipantsPerTournament: formData.minParticipantsPerTournament,
      maxParticipantsPerTournament: formData.maxParticipantsPerTournament,
      registrationCost: formData.registrationCost,
      prize: formData.prize
    };

    // Validar antes de enviar
    const validation = validateBeforeUpdate(tournament, updateData);
    if (!validation.valid) {
      setValidationError(validation.error || 'Error de validación');
      return;
    }

    const result = await update(tournament.id, updateData);

    if (result.success) {
      onSuccess();
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!canEdit) {
    return (
      <div className="p-8">
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-semibold">No se puede editar este torneo</p>
              <p className="text-yellow-200/80 text-sm mt-1">
                Estado actual: <span className="font-semibold">{tournament.status}</span>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  const displayError = validationError || apiError;

  return (
    <div className="p-8 max-h-[85vh] overflow-y-auto bg-surface-dark">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-3xl mb-2">Editar Torneo</h2>
        <p className="text-purple-300">Actualiza la información de tu torneo</p>
      </div>

      {/* Alerts */}
      {displayError && (
        <div className="mb-6 p-4 bg-gradient-to-r from-rose-900/30 to-red-900/30 border border-rose-500/50 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
            <p className="text-rose-300">{displayError}</p>
          </div>
        </div>
      )}

      {hasTeams && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/50 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-300 font-semibold">
                Hay {tournament.teamsInscribed} equipos inscritos
              </p>
              <p className="text-blue-200/80 text-sm mt-1">
                No podrás modificar el precio ni el premio del torneo.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 mb-4">
            <FileText className="w-5 h-5" />
            <span className="font-semibold">Información Básica</span>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm text-purple-200">
              Nombre del Torneo *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
              placeholder="Ej: Copa TuTorneo 2024"
            />
          </div>
        </div>

        {/* Fechas */}
        <div className="p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 mb-4">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Fechas Importantes</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="registrationDeadline" className="block text-sm text-purple-200">
                Fecha Límite de Inscripción
              </label>
              <input
                id="registrationDeadline"
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="startAt" className="block text-sm text-purple-200">
                Fecha de Inicio
              </label>
              <input
                id="startAt"
                type="date"
                value={formData.startAt}
                onChange={(e) => handleInputChange('startAt', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endAt" className="block text-sm text-purple-200">
                Fecha de Fin
              </label>
              <input
                id="endAt"
                type="date"
                value={formData.endAt}
                onChange={(e) => handleInputChange('endAt', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20">
          <RichTextEditor
            value={formData.detalles}
            onChange={(value: string) => handleInputChange('detalles', value)}
            label="Detalles del Torneo"
          />
        </div>

        {/* Capacidad */}
        <div className="p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 mb-4">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Capacidad del Torneo</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="minParticipants" className="block text-sm text-purple-200">
                Mínimo de Participantes
              </label>
              <input
                id="minParticipants"
                type="number"
                value={formData.minParticipantsPerTournament}
                onChange={(e) =>
                  handleInputChange('minParticipantsPerTournament', parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxParticipants" className="block text-sm text-purple-200">
                Máximo de Participantes
              </label>
              <input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipantsPerTournament}
                onChange={(e) =>
                  handleInputChange('maxParticipantsPerTournament', parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
                placeholder="16"
              />
            </div>
          </div>
        </div>

        {/* Economía */}
        <div className="p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 mb-4">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Economía del Torneo</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="registrationCost" className="block text-sm text-purple-200">
                Costo de Inscripción
              </label>
              <input
                id="registrationCost"
                type="number"
                step="0.01"
                value={formData.registrationCost}
                onChange={(e) =>
                  handleInputChange('registrationCost', parseFloat(e.target.value) || 0)
                }
                disabled={hasTeams}
                className={`w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                  hasTeams ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="0.00"
              />
              {hasTeams && (
                <p className="text-xs text-yellow-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Bloqueado (hay equipos inscritos)
                </p>
              )}
            </div>

            <div className={hasTeams ? 'opacity-50 pointer-events-none' : ''}>
              <RichTextEditor
                value={formData.prize}
                onChange={(value: string) => handleInputChange('prize', value)}
                label="Premio"
                disabled={hasTeams}
              />
              {hasTeams && (
                <p className="text-xs text-yellow-400 flex items-center gap-1 mt-2">
                  <Lock className="w-3 h-3" /> Bloqueado (hay equipos inscritos)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-3">
            <input
              id="privateTournament"
              type="checkbox"
              checked={formData.privateTournament}
              onChange={(e) => handleInputChange('privateTournament', e.target.checked)}
              className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-[#1a1a1a]"
            />
            <label htmlFor="privateTournament" className="text-purple-200 cursor-pointer">
              Torneo Privado
            </label>
          </div>

          {formData.privateTournament && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <label htmlFor="password" className="block text-sm text-purple-200">
                Contraseña del Torneo *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required={formData.privateTournament}
                  className="w-full px-4 py-2.5 pr-12 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors"
                  placeholder="Ingresa una contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Guardando...' : 'Actualizar Torneo'}
          </button>
        </div>
      </form>
    </div>
  );
};
