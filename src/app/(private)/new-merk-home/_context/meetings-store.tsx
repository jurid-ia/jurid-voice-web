"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { meetingsMock } from "../_mocks/meetings";
import { Meeting } from "../_types";

interface MeetingsStoreValue {
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  findLastMeetingWithClient: (
    clientId: string | undefined | null,
    excludeMeetingId?: string,
  ) => Meeting | null;
}

const MeetingsStoreContext = createContext<MeetingsStoreValue | null>(null);

export function MeetingsStoreProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(meetingsMock);

  const addMeeting = useCallback((meeting: Meeting) => {
    setMeetings((prev) => {
      const next = [...prev, meeting];
      next.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
      return next;
    });
  }, []);

  const findLastMeetingWithClient = useCallback(
    (clientId: string | undefined | null, excludeMeetingId?: string) => {
      if (!clientId) return null;
      const now = Date.now();
      const past = meetings
        .filter(
          (m) =>
            m.clientId === clientId &&
            new Date(m.start).getTime() < now &&
            m.id !== excludeMeetingId,
        )
        .sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
        );
      return past[0] ?? null;
    },
    [meetings],
  );

  const value = useMemo<MeetingsStoreValue>(
    () => ({ meetings, addMeeting, findLastMeetingWithClient }),
    [meetings, addMeeting, findLastMeetingWithClient],
  );

  return (
    <MeetingsStoreContext.Provider value={value}>
      {children}
    </MeetingsStoreContext.Provider>
  );
}

export function useMeetingsStore(): MeetingsStoreValue {
  const ctx = useContext(MeetingsStoreContext);
  if (!ctx) {
    throw new Error(
      "useMeetingsStore precisa estar dentro de <MeetingsStoreProvider>",
    );
  }
  return ctx;
}
