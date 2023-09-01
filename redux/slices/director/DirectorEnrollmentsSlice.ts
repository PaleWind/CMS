import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../../client';
import { RootState } from '../../store';
import { normalizeEnrollmentResults } from '../../../api/Enrollments';
import { signOutThunk } from '../AuthSlice';
import { getEnrollmentsByIdThunk } from '../EnrollmentsSlice';

export interface DirectorEnrollmentState {
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

const initialState: DirectorEnrollmentState = {
  data: {
    tournament_events: { byActivityId: {}, byUserId: {} },
    league_events: { byActivityId: {}, byUserId: {} },
    camp_events: { byActivityId: {}, byUserId: {} },
  },
  status: 'idle',
  error: undefined,
};

type EnrollmentDataKey = keyof DirectorEnrollmentState['data'];

export const deleteEnrollmentsByIdThunk = createAsyncThunk(
  'directorEnrollments/deleteEnrollmentsByIdThunk',
  async (
    {
      eventType,
      activityId,
      eventId,
      userId,
    }: {
      eventType: string;
      activityId: number;
      eventId: number | undefined;
      userId: string | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      let query = supabase
        .from('event_enrollments')
        .delete()
        .eq('event_type', eventType)
        .eq('activity_id', activityId);
      if (eventId) query.eq('event_id', eventId);
      if (userId) query.eq('user_id', userId);
      console.log('query', query);
      const { data, error } = await supabase
        .from('event_enrollments')
        .delete()
        .eq('event_type', eventType)
        .eq('activity_id', activityId);
      if (error) {
        console.log('error deleting enrollments: ', error);
        throw error;
      }
      console.log(`deleted enrollments`, data);
      console.log(eventType, activityId, eventId, userId);
      return { eventType, activityId, eventId, userId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getMyEnrollmentsByIdThunk = createAsyncThunk(
  'directorEnrollments/getMyEnrollmentsByIdThunk',
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

const getMyEnrollmentsThunk = createAsyncThunk(
  'directorEnrollments/getMyEnrollmentsThunk',
  async ({}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.data.currentSession?.user.id;
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      console.log('my enrollments', data);
      return data;
    } catch (error) {
      console.log('error fetching my enrollments: ', error);
      return rejectWithValue(error);
    }
  }
);

export const directorEnrollmentsSlice = createSlice({
  name: 'directorEnrollments',
  initialState,
  reducers: {
    removeDirectorEnrollment: (state, action: PayloadAction<any>) => {
      const { event_type, activity_id, event_id, user_id } =
        action.payload.item;
      console.log(
        'removeDirectorEnrollment',
        event_type,
        activity_id,
        event_id,
        user_id
      );
      const enrollmentDataKey = event_type as EnrollmentDataKey;

      if (!state.data.hasOwnProperty(enrollmentDataKey)) {
        throw new Error(`Invalid enrollmentType: ${event_type}`);
      }
      if (
        activity_id &&
        event_id &&
        user_id &&
        state.data[enrollmentDataKey].byActivityId[activity_id].byEventId[
          event_id
        ]
      ) {
        const enrollments =
          state.data[enrollmentDataKey].byActivityId[activity_id].byEventId[
            event_id
          ];
        console.log('enrollments: ', enrollments);
        state.data[enrollmentDataKey].byActivityId[activity_id].byEventId[
          event_id
        ] = enrollments.filter((id) => id !== user_id);
      } else {
        console.log('enrollment not found!');
      }
    },
    addDirectorEnrollment: (state, action: PayloadAction<any>) => {
      console.log('addDirectorEnrollment: ', action);
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
      .addCase(deleteEnrollmentsByIdThunk.pending, (state, action) => {
        state.status = 'loading';
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
      })
      .addCase(deleteEnrollmentsByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getMyEnrollmentsThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getMyEnrollmentsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('getenrollments result: ', action);
        console.log(action.payload);
      })
      .addCase(getMyEnrollmentsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getMyEnrollmentsByIdThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getMyEnrollmentsByIdThunk.fulfilled, (state, action) => {
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
      .addCase(getMyEnrollmentsByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signOutThunk.pending, (state, action) => {
        state = initialState;
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

export const myEnrollmentCountByEventIdSelector = (
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

export const { removeDirectorEnrollment, addDirectorEnrollment } =
  directorEnrollmentsSlice.actions;

export default directorEnrollmentsSlice.reducer;
