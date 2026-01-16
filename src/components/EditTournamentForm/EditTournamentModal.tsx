// src/components/EditTournamentForm/EditTournamentModal.tsx
import React from 'react';
import { EditTournamentForm } from './EditTournamentForm';
import type { TournamentDetails } from '../../models';
import { X } from 'lucide-react';

interface Props {
  tournament: TournamentDetails;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTournamentModal: React.FC<Props> = ({
  tournament,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#1a0d2e] via-[#1f1635] to-[#2a1f3d] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-900/50 hover:bg-gray-900/80 text-gray-300 hover:text-white transition-all border border-gray-700/50 hover:border-gray-600"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          <EditTournamentForm
            tournament={tournament}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
