export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  relatedEntityId: number | null;
  createdAt: string;
  readAt: string | null;
  read: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}
