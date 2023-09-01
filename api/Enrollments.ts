import { EventEnrollment } from '../types/types';

export const normalizeEnrollmentResults = (enrollments: any) => {
  const byEventId: { [eventId: number]: string[] } = {};
  const byUserId: { [userId: string]: number[] } = {};

  enrollments?.forEach((enrollment: any) => {
    const { user_id, event_id } = enrollment;

    if (!byEventId[event_id]) {
      byEventId[event_id] = [];
    }
    if (!byUserId[user_id]) {
      byUserId[user_id] = [];
    }
    byEventId[event_id].push(user_id);
    byUserId[user_id].push(event_id);
  });
  return { byEventId, byUserId };
};
