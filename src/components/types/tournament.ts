export interface Participante {
  id: number;
  nombre: string;
  email: string;
  estado: string;
  posicion?: number;
  avatar?: string;
  equipo?: string;
}
