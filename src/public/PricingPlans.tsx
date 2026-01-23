import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useGlobalContext } from "../context/global.context";

export const PricingPlans = () => {
  const navigate = useNavigate();
  const { token } = useGlobalContext();
  const [showDevMessage, setShowDevMessage] = useState(false);

  const isLoggedIn = !!token;

  const plans = [
    {
      name: "Plan Free",
      emoji: "",
      price: "Gratis",
      description: "Perfecto para comenzar",
      period: "",
      badge: null,
      cta: "Comenzar Gratis",
      features: [
        "3% comisión por inscripción",
        "Crear torneos ilimitados",
        "Hasta 12 equipos por torneo",
        "Soporte estándar",
      ],
    },
    {
      name: "Plan Premium",
      emoji: "",
      price: "249",
      description: "Máximo rendimiento",
      period: "UYU / mes",
      badge: "MÁS POPULAR",
      cta: "Actualizar a Premium",
      features: [
        "0% comisión por inscripción",
        "Crear torneos ilimitados",
        "Equipos sin límite",
        "Exportar PDF del torneo",
        "Soporte prioritario",
        "Sin anuncios",
      ],
    },
  ];

  return (
    <section id="planes" className="relative mx-auto max-w-6xl px-4 py-20 z-10">
      <div className="text-center mb-16">
        <h2 className="text-white text-4xl md:text-5xl mb-4 font-bold">Planes de Membresía</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Elige el plan perfecto para organizar y participar en torneos
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className="relative">
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white text-xs font-bold z-10 whitespace-nowrap">
                {plan.badge}
              </div>
            )}

            {/* Card */}
            <div
              className={`rounded-2xl p-4 md:p-8 h-full flex flex-col ${
                plan.badge
                  ? "bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-2 border-purple-500/60 shadow-lg shadow-purple-500/20"
                  : "bg-white/5 border border-gray-700/50 hover:border-gray-600 transition-colors"
              }`}
            >
              {/* Header */}
              <div className="mb-4 md:mb-6">
                <div className="text-2xl md:text-3xl mb-2">{plan.emoji}</div>
                <h3 className="text-white text-lg md:text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-4 md:mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-3xl md:text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-xs md:text-sm">{plan.period}</span>}
                </div>
              </div>

              

              {/* Features */}
              <div className="space-y-2 md:space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2 md:gap-3">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-xs md:text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {plan.cta === "Comenzar Gratis" ? (
                !isLoggedIn && (
                  <Button
                    onClick={() => navigate("/signup")}
                    className={`w-full mt-4 md:mb-8 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all bg-gray-700 hover:bg-gray-600 text-white`}
                  >
                    {plan.cta}
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => setShowDevMessage(true)}
                  className={`w-full mt-4 md:mb-8 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white`}
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Development Message Modal */}
      {showDevMessage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#2a1f3d]/95 via-[#1f1635]/95 to-[#2a1f3d]/95 border border-purple-500/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-white text-2xl font-bold text-center mb-2">En Desarrollo</h3>
            <p className="text-gray-300 text-center mb-6">
              La funcionalidad de actualización a Plan Premium está siendo desarrollada. Pronto estará disponible.
            </p>
            <Button
              onClick={() => setShowDevMessage(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg py-2 font-semibold"
            >
              Entendido
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
