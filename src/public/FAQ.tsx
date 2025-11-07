import React from "react";

export const Faq: React.FC = () => (
  <div className="min-h-screen p-10 bg-surface text-slate-400 px-6 py-12 flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-6 text-brand-title">Preguntas Frecuentes</h1>
    <ul className="space-y-4 text-center">
      <li>
        <strong className="text-slate-300">¿Cómo me inscribo?</strong>
        <p>Podés hacerlo desde la página del torneo que te interese, tocando “Inscribirme”.</p>
      </li>
      <li>
        <strong className="text-slate-300">¿Tiene costo participar?</strong>
        <p>Depende del torneo, algunos son gratuitos y otros tienen un costo indicado en la tarjeta.</p>
      </li>
      <li>
        <strong className="text-slate-300">¿Dónde veo mis torneos?</strong>
        <p>Luego de iniciar sesión, accedé a tu perfil y verás tus inscripciones activas.</p>
      </li>
    </ul>  
  </div>
);
