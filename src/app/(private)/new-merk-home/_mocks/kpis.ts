export interface KpiMock {
  meetingsToday: number;
  commitmentsDueToday: number;
  overdueFollowups: number;
  unprocessedRecordings: number;
  meetingsTodayTrend: { value: number; isPositive: boolean };
  commitmentsDueTodayTrend: { value: number; isPositive: boolean };
  overdueFollowupsTrend: { value: number; isPositive: boolean };
  unprocessedRecordingsTrend: { value: number; isPositive: boolean };
}

export const kpisMock: KpiMock = {
  meetingsToday: 4,
  commitmentsDueToday: 7,
  overdueFollowups: 3,
  unprocessedRecordings: 2,
  meetingsTodayTrend: { value: 12, isPositive: true },
  commitmentsDueTodayTrend: { value: 5, isPositive: false },
  overdueFollowupsTrend: { value: 20, isPositive: false },
  unprocessedRecordingsTrend: { value: 33, isPositive: true },
};
