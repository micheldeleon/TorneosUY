export type OrganizerRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OrganizerRequest {
  id: number;
  userId: number;
  message: string | null;
  status: OrganizerRequestStatus;
  createdAt: string;
  approvedBy: number | null;
  approvedAt: string | null;
  approvalNote: string | null;
  rejectedBy: number | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
}
