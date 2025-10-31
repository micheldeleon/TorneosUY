import React from "react";

export const Faq: React.FC = () => (
  <div className="min-h-screen p-10 bg-[#e9ebff] text-slate-800">
    <h1 className="text-3xl font-bold mb-6 text-[#1d1e6b]">Preguntas Frecuentes</h1>
    <ul className="space-y-4">
      <li>
        <strong>¿Cómo me inscribo?</strong>
        <p>Podés hacerlo desde la página del torneo que te interese, tocando “Inscribirme”.</p>
      </li>
      <li>
        <strong>¿Tiene costo participar?</strong>
        <p>Depende del torneo, algunos son gratuitos y otros tienen un costo indicado en la tarjeta.</p>
      </li>
      <li>
        <strong>¿Dónde veo mis torneos?</strong>
        <p>Luego de iniciar sesión, accedé a tu perfil y verás tus inscripciones activas.</p>
      </li>
    </ul>  
  </div>
);