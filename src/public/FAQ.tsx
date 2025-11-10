import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/Accordion";

export function Faq() {
  const faqs = [
    {
      pregunta: "¿Cómo puedo inscribirme en un torneo?",
      respuesta: "Para inscribirte en un torneo, simplemente navega por los torneos disponibles, selecciona el que te interese y haz clic en el botón 'Inscribirme'. Deberás completar tus datos y realizar el pago si el torneo tiene un costo asociado."
    },
    {
      pregunta: "¿Puedo cancelar mi inscripción?",
      respuesta: "Sí, puedes cancelar tu inscripción hasta 48 horas antes del inicio del torneo. El reembolso será procesado en un plazo de 5-7 días hábiles."
    },
    {
      pregunta: "¿Qué pasa si el torneo se cancela?",
      respuesta: "Si el organizador cancela el torneo, recibirás un reembolso completo de forma automática. Te notificaremos por email y en la plataforma."
    },
    {
      pregunta: "¿Puedo organizar mi propio torneo?",
      respuesta: "¡Por supuesto! TuTorneo te permite organizar torneos de forma sencilla. Contáctanos para conocer más sobre las opciones disponibles y cómo empezar."
    },
    {
      pregunta: "¿Hay límite de participantes?",
      respuesta: "Cada torneo tiene su propio límite de participantes establecido por el organizador. Puedes ver el número de plazas disponibles en la información de cada torneo."
    },
    {
      pregunta: "¿Cómo funcionan los pagos?",
      respuesta: "Los pagos se procesan de forma segura a través de nuestra plataforma. Aceptamos tarjetas de crédito, débito y otros métodos de pago locales. Todos los datos están encriptados y protegidos."
    },
    {
      pregunta: "¿Necesito experiencia previa para participar?",
      respuesta: "No necesariamente. Cada torneo indica su nivel de dificultad y requisitos. Hay torneos para principiantes, intermedios y avanzados. Lee la descripción de cada torneo para encontrar el que mejor se adapte a tu nivel."
    },
    {
      pregunta: "¿Qué deportes están disponibles?",
      respuesta: "Ofrecemos torneos de múltiples deportes: fútbol, básquet, running, ciclismo, eSports (CS2, FIFA, League of Legends), y más. Constantemente añadimos nuevas categorías según la demanda de nuestra comunidad."
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-4xl mb-4 text-center">Preguntas Frecuentes</h1>
          <p className="text-gray-400 text-center mb-12">
            Encuentra respuestas a las preguntas más comunes sobre TuTorneo
          </p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-[#2a2a2a] border-gray-800 rounded-lg px-6 data-[state=open]:border-purple-600/50"
              >
                <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
                  {faq.pregunta}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.respuesta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
