export interface Mission {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "special";
  status: "active" | "inactive";
  participants: number;
  maxParticipants?: number;
  reward: string;
  createdAt: string;
}
