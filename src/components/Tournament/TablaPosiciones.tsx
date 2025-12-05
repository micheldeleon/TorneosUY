import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface PosicionEquipo {
  posicion: number;
  equipo: string;
  pj: number; // Partidos jugados
  pg: number; // Partidos ganados
  pe: number; // Partidos empatados
  pp: number; // Partidos perdidos
  gf: number; // Goles a favor
  gc: number; // Goles en contra
  pts: number; // Puntos
}

interface TablaPosicionesProps {
  posiciones: PosicionEquipo[];
}

export function TablaPosiciones({ posiciones }: TablaPosicionesProps) {
  const getPosicionBadge = (pos: number) => {
    if (pos === 1) return { color: "bg-yellow-600/20 text-yellow-300 border-yellow-600/50", icon: Trophy };
    if (pos <= 3) return { color: "bg-green-600/20 text-green-300 border-green-600/50", icon: TrendingUp };
    if (pos >= posiciones.length - 2) return { color: "bg-rose-600/20 text-rose-300 border-rose-600/50", icon: TrendingDown };
    return { color: "bg-gray-600/20 text-gray-300 border-gray-600/50", icon: Minus };
  };

  return (
    <Card className="bg-[#2a2a2a] border-gray-800 overflow-hidden">
      <div className="p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          Tabla de Posiciones
        </h3>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Pos</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">Equipo</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">PJ</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">PG</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">PE</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">PP</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">GF</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">GC</th>
                <th className="text-center py-3 px-2 text-gray-400 text-sm">DIF</th>
                <th className="text-center py-3 px-4 text-gray-400 text-sm">PTS</th>
              </tr>
            </thead>
            <tbody>
              {posiciones.map((equipo) => {
                const badge = getPosicionBadge(equipo.posicion);
                const IconComponent = badge.icon;
                const diferencia = equipo.gf - equipo.gc;

                return (
                  <tr 
                    key={equipo.posicion}
                    className="border-b border-gray-800/50 hover:bg-purple-600/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`${badge.color} w-8 h-8 rounded-lg flex items-center justify-center p-0`}>
                          {equipo.posicion}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">
                            {equipo.equipo.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white">{equipo.equipo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center text-gray-300">{equipo.pj}</td>
                    <td className="py-4 px-2 text-center text-green-400">{equipo.pg}</td>
                    <td className="py-4 px-2 text-center text-gray-400">{equipo.pe}</td>
                    <td className="py-4 px-2 text-center text-rose-400">{equipo.pp}</td>
                    <td className="py-4 px-2 text-center text-gray-300">{equipo.gf}</td>
                    <td className="py-4 px-2 text-center text-gray-300">{equipo.gc}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={diferencia > 0 ? "text-green-400" : diferencia < 0 ? "text-rose-400" : "text-gray-400"}>
                        {diferencia > 0 ? "+" : ""}{diferencia}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <span className="text-white px-3 py-1 bg-purple-600/20 rounded-lg">{equipo.pts}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {posiciones.map((equipo) => {
            const badge = getPosicionBadge(equipo.posicion);
            const diferencia = equipo.gf - equipo.gc;

            return (
              <div 
                key={equipo.posicion}
                className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${badge.color} w-10 h-10 rounded-lg flex items-center justify-center text-lg`}>
                      {equipo.posicion}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">
                          {equipo.equipo.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white">{equipo.equipo}</span>
                    </div>
                  </div>
                  <span className="text-white text-xl px-3 py-1 bg-purple-600/20 rounded-lg">{equipo.pts}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">PJ</p>
                    <p className="text-white">{equipo.pj}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">PG</p>
                    <p className="text-green-400">{equipo.pg}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">PE</p>
                    <p className="text-gray-400">{equipo.pe}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">PP</p>
                    <p className="text-rose-400">{equipo.pp}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm mt-2 pt-2 border-t border-gray-800">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">GF</p>
                    <p className="text-white">{equipo.gf}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">GC</p>
                    <p className="text-white">{equipo.gc}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">DIF</p>
                    <p className={diferencia > 0 ? "text-green-400" : diferencia < 0 ? "text-rose-400" : "text-gray-400"}>
                      {diferencia > 0 ? "+" : ""}{diferencia}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
