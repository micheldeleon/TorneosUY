// src/components/EditTournamentForm/EditTournamentButton.tsx
// Ejemplo de uso del componente en un dashboard o página de detalles
import React, { useState } from 'react';
import { EditTournamentModal } from './EditTournamentModal';
import type { TournamentDetails } from '../../models';

interface Props {
  tournament: TournamentDetails;
  onTournamentUpdated: () => void;
  userIsOrganizer: boolean;
}

export const EditTournamentButton: React.FC<Props> = ({
  tournament,
  onTournamentUpdated,
  userIsOrganizer
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Solo mostrar botón si el usuario es organizador y el torneo está ABIERTO
  if (!userIsOrganizer || tournament.status !== 'ABIERTO') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-edit"
        title="Editar torneo"
      >
        ✏️ Editar Torneo
      </button>

      <EditTournamentModal
        tournament={tournament}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onTournamentUpdated}
      />
    </>
  );
};
