import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../client';
import { RootState } from '../store';
import { normalizeEnrollmentResults } from '../../api/Enrollments';
import { deleteEnrollmentsByIdThunk } from './director/DirectorEnrollmentsSlice';

export interface EnrollmentState {
  data: {
    tournament_events: {
      byActivityId: {
        [activityId: number]: { byEventId: { [eventId: number]: string[] } };
      };
      byUserId: { [userId: string]: number[] };
    };
    league_events: {
      byActivityId: {
        [activityId: number]: { byEventId: { [eventId: number]: string[] } };
      };
      byUserId: { [userId: string]: number[] };
    };
    camp_events: {
      byActivityId: {
        [activityId: number]: { byEventId: { [eventId: number]: string[] } };
      };
      byUserId: { [userId: string]: number[] };
    };
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: EnrollmentState = {
  data: {
    tournament_events: { byActivityId: {}, byUserId: {} },
    league_events: { byActivityId: {}, byUserId: {} },
    camp_events: { byActivityId: {}, byUserId: {} },
  },
  status: 'idle',
  error: undefined,
};

type EnrollmentDataKey = keyof EnrollmentState['data'];

export const getEnrollmentsByIdThunk = createAsyncThunk(
  'enrollments/getEnrollmentsByIdThunk',
  async (
    {
      eventType,
      activityId,
      eventId,
    }: {
      eventType: string;
      activityId: number;
      eventId: number | undefined;
    },
    { rejectWithValue }
  ) => {
    let query = supabase
      .from('event_enrollments')
      .select(`*`)
      .eq('event_type', eventType)
      .eq('activity_id', activityId);
    if (eventId) query.eq('event_id', eventId);

    const { data, error } = await query;
    if (error) {
      console.log('error fetching enrollments: ', error);
    }
    console.log(`event_enrollments`, data);
    const { byEventId, byUserId } = normalizeEnrollmentResults(data);
    console.log(eventType, activityId, eventId, byEventId, byUserId);
    return { eventType, activityId, eventId, byEventId, byUserId };
  }
);

export const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    addEnrollment: (state, action: PayloadAction<any>) => {
      console.log('addEnrollment: ', action);
      const { event_type, activity_id, event_id, user_id } =
        action.payload.item;
      const enrollmentDataKey = event_type as EnrollmentDataKey;

      if (!state.data.hasOwnProperty(enrollmentDataKey)) {
        throw new Error(`Invalid enrollmentType: ${event_type}`);
      }
      console.log(state.data[enrollmentDataKey]);
      if (
        !state.data[enrollmentDataKey].byActivityId[activity_id] ||
        !state.data[enrollmentDataKey].byActivityId[activity_id].byEventId
      ) {
        console.log('nothing to update');
        return;
      }

      if (
        !state.data[enrollmentDataKey].byActivityId[activity_id].byEventId[
          event_id
        ]
      ) {
        state.data[enrollmentDataKey].byActivityId[activity_id].byEventId[
          event_id
        ] = [];
      }
      state.data[enrollmentDataKey].byActivityId[activity_id].byEventId[
        event_id
      ].push(user_id);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEnrollmentsByIdThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getEnrollmentsByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('getenrollments result: ', action);
        const { eventType, activityId, eventId, byEventId, byUserId } =
          action.payload;
        const enrollmentDataKey = eventType as EnrollmentDataKey;
        if (!state.data.hasOwnProperty(enrollmentDataKey)) {
          throw new Error(`Invalid enrollmentType: ${eventType}`);
        }
        state.data[enrollmentDataKey].byActivityId[activityId] = {
          byEventId: byEventId,
        };
        state.data[enrollmentDataKey].byUserId = {
          ...state.data[enrollmentDataKey].byUserId,
          ...byUserId,
        };
      })
      .addCase(getEnrollmentsByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteEnrollmentsByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('getenrollments result: ', action);
        const { eventType, activityId, eventId, userId } = action.payload;
        const enrollmentDataKey = eventType as EnrollmentDataKey;
        // Validate that enrollmentDataKey is a valid key in the state
        if (!state.data.hasOwnProperty(enrollmentDataKey)) {
          throw new Error(`Invalid enrollmentType: ${eventType}`);
        }
        if (activityId && eventId && userId) {
          const enrollments =
            state.data[enrollmentDataKey].byActivityId[activityId].byEventId[
              eventId
            ];
          state.data[enrollmentDataKey].byActivityId[activityId].byEventId[
            eventId
          ] = enrollments.filter((id) => id !== userId);
        } else if (activityId && eventId && !userId) {
          delete state.data[enrollmentDataKey].byActivityId[activityId]
            .byEventId[eventId];
        } else if (activityId && !eventId && !userId) {
          delete state.data[enrollmentDataKey].byActivityId[activityId];
        }
      });
  },
});

export const enrollmentsAllSelector = (state: RootState) => {
  //   return state.enrollments.data;
};

export const enrollmentsByUserIdSelector = (
  state: RootState,
  userId: string
) => {
  return [];
};

export const enrollmentsByEventIdSelector = (
  state: RootState,
  eventType: string,
  activityId: number,
  eventId: number
): any => {
  const enrollmentDataKey = eventType as EnrollmentDataKey;
  const byActivityId =
    state.enrollments.data[enrollmentDataKey]?.byActivityId[activityId];

  // If there's no data for this activityId or eventId, return an null
  if (!byActivityId || !byActivityId.byEventId[eventId]) {
    return null;
  }

  // Return the array of user IDs enrolled for this event
  return byActivityId.byEventId[eventId];
};

export const enrollmentCountByEventIdSelector = (
  state: RootState,
  eventType: string,
  activityId: number,
  eventId: number
): any => {
  const enrollmentDataKey = eventType as EnrollmentDataKey;
  const byActivityId =
    state.enrollments.data[enrollmentDataKey]?.byActivityId[activityId];

  // If there's no data for this activityId or eventId, return 0
  if (!byActivityId || !byActivityId.byEventId[eventId]) {
    return 0;
  }

  // Return the array of user IDs enrolled for this event
  return byActivityId.byEventId[eventId].length;
};

export const { addEnrollment } = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
