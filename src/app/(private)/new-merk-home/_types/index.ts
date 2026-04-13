export type MeetingSource = "google" | "teams" | "juridia";

export type MeetingStatus = "scheduled" | "live" | "processed" | "unprocessed";

export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  source: MeetingSource;
  status: MeetingStatus;
  participants: Participant[];
  recordingId?: string;
  hasTranscription?: boolean;
  clientId?: string;
}

export interface ClientRegistryEntry {
  id: string;
  name: string;
  avatarUrl?: string;
  company?: string;
}

export interface MeetingBriefing {
  meetingId: string;
  bullets: string[];
  lastMeetingSummary?: {
    title: string;
    date: string;
    mediaType: "audio" | "video";
    durationSeconds: number;
  };
}

export type CommitmentDirection = "outgoing" | "incoming";

export type CommitmentStatus = "pending" | "done" | "overdue";

export type CommitmentPriority = "low" | "medium" | "high";

export interface Commitment {
  id: string;
  title: string;
  description?: string;
  direction: CommitmentDirection;
  counterpart: { name: string; avatarUrl?: string };
  dueDate: string;
  status: CommitmentStatus;
  priority: CommitmentPriority;
  sourceMeetingId?: string;
  sourceMeetingTitle?: string;
  createdAt: string;
}

export interface ProcessedRecording {
  id: string;
  title: string;
  clientName: string;
  processedAt: string;
  durationSeconds: number;
  participantsCount: number;
}

export type SearchResultCategory =
  | "meeting"
  | "commitment"
  | "recording"
  | "client";

export interface SearchResult {
  id: string;
  category: SearchResultCategory;
  title: string;
  subtitle?: string;
  meta?: string;
  href?: string;
}
