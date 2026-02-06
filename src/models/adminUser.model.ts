export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  createdAt: string | null;
  deletedAt: string | null;
  deletedBy: number | null;
  deleteReason: string | null;
  tournamentsOrganizedCount: number;
  totalParticipations: number;
}
