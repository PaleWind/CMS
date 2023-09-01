import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  ActivityType,
  Event,
  EventType,
  ILeagueEvent,
  ITournamentEvent,
  ITrainingCampEvent,
  getEventType,
} from '../../../types/types';
import { supabase } from '../../../client';
import { eventParentIdFields, eventTableNames } from '../../../types/constants';
import { signOutThunk } from '../AuthSlice';

export interface DirectorEventsState {
  data: {
    tournament_events: {
      byActivityId: {
        [activityId: number]: {
          [eventId: number]: ITournamentEvent[];
        };
      };
    };
    league_events: {
      byActivityId: {
        [activityId: number]: {
          [eventId: number]: ILeagueEvent[];
        };
      };
    };
    camp_events: {
      byActivityId: {
        [activityId: number]: {
          [eventId: number]: ITrainingCampEvent[];
        };
      };
    };
  };
  status: 'idle' | 'loading' | 'updating' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: DirectorEventsState = {
  data: {
    tournament_events: { byActivityId: {} },
    league_events: { byActivityId: {} },
    camp_events: { byActivityId: {} },
  },
  status: 'idle',
  error: undefined,
};

export const getMyEventsbyActivityIdThunk = createAsyncThunk(
  'directorEvents/getMyEventsbyActivityIdThunk',
  async (
    {
      activityType,
      activityId,
    }: { activityType: ActivityType; activityId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const eventType = eventTableNames[activityType];
      const field = eventParentIdFields[eventType];

      const { data, error } = await supabase
        .from(eventType)
        .select('*')
        .eq(field, activityId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      // console.log(`getMyActivityEventsThunk, `, data);
      const byEventId = data?.reduce((eventMap, event) => {
        eventMap[event.id] = event;
        return eventMap;
      }, {} as any);
      return { eventType, activityId, byEventId };
    } catch (error) {
      console.error('Error fetching events:', error);
      return rejectWithValue({ error });
    }
  }
);

export const createEventThunk = createAsyncThunk(
  'directorEvents/createEventThunk',
  async ({
    eventType,
    activityId,
  }: {
    eventType: EventType;
    activityId: number;
  }) => {
    try {
      const idField = eventParentIdFields[eventType];
      const fields: { [k: string]: any } = {
        name: 'untitled',
        price: 0,
        start_date: new Date(),
      };
      fields[idField] = activityId;
      const { data: newEvent, error } = await supabase
        .from(eventType)
        .insert(fields)
        .select();
      if (error) throw error;
      console.log('new event added:', newEvent[0]);
      return { eventType, activityId, newEvent: newEvent[0] };
    } catch (error) {
      return error;
    }
  }
);

export const updateEventThunk = createAsyncThunk(
  'directorEvents/updateEventThunk',
  async (
    { activityId, event }: { activityId: number; event: Event },
    { rejectWithValue }
  ) => {
    try {
      const eventType = getEventType(event);
      if (!eventType) throw 'Invalid event:' + event;
      console.log(eventType, event);
      const { data: newEvent, error } = await supabase
        .from(eventType)
        .update(event)
        .eq('id', event?.id)
        .select();
      if (error) throw error;
      console.log('event updated:', newEvent[0], eventType);
      return { eventType, activityId, newEvent: newEvent[0] };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteEventThunk = createAsyncThunk(
  'directorEvents/deleteEventThunk',
  async (
    {
      eventType,
      activityId,
      eventId,
    }: { eventType: EventType; activityId: number; eventId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from(eventType)
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return { eventType, activityId, eventId };
    } catch (error) {
      return error;
    }
  }
);

export const directorEventsSlice = createSlice({
  name: 'directorEvents',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(getMyEventsbyActivityIdThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getMyEventsbyActivityIdThunk.fulfilled, (state, action: any) => {
        console.log('action: ', action);
        state.status = 'succeeded';
        const {
          eventType,
          activityId,
          byEventId,
        }: { eventType: EventType; activityId: number; byEventId: any } =
          action.payload;

        console.log(state.data[eventType].byActivityId[activityId], byEventId);
        if (!state.data[eventType].byActivityId[activityId]) {
          state.data[eventType].byActivityId[activityId] = {};
        }
        state.data[eventType].byActivityId[activityId] = byEventId as any;
      })
      .addCase(getMyEventsbyActivityIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEventThunk.pending, (state, action) => {
        state.status = 'updating';
      })
      .addCase(createEventThunk.fulfilled, (state, action: any) => {
        const {
          eventType,
          activityId,
          newEvent,
        }: { eventType: EventType; activityId: number; newEvent: Event } =
          action.payload;
        state.status = 'succeeded';
        if (!eventType || !activityId || !newEvent.id) return;
        state.data[eventType].byActivityId[activityId][newEvent.id] =
          newEvent as any;
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEventThunk.pending, (state, action) => {
        state.status = 'updating';
      })
      .addCase(updateEventThunk.fulfilled, (state, action: any) => {
        try {
          const {
            eventType,
            activityId,
            newEvent,
          }: { eventType: EventType; activityId: number; newEvent: Event } =
            action.payload;
          state.status = 'succeeded';
          if (!eventType || !activityId || !newEvent) return;
          state.data[eventType].byActivityId[activityId][newEvent?.id] =
            newEvent as any;
        } catch (error) {
          state.error = error as any;
          console.log('error updating event state: ', error);
        }
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteEventThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteEventThunk.fulfilled, (state, action: any) => {
        const {
          eventType,
          activityId,
          eventId,
        }: { eventType: EventType; activityId: number; eventId: number } =
          action.payload;
        state.status = 'succeeded';
        if (!eventType || !eventId) return;
        delete state.data[eventType].byActivityId[activityId][eventId];
      })
      .addCase(deleteEventThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signOutThunk.pending, (state, action) => {
        state = initialState;
      });
  },
});

export const {} = directorEventsSlice.actions;

export default directorEventsSlice.reducer;

export const myEventsByActivityIdSelector = (
  state: RootState,
  eventType: EventType,
  eventId: number
) => state.director.myEvents.data[eventType].byActivityId[eventId];

export const myEventByEventIdSelector = (
  state: RootState,
  eventType: EventType,
  activityId: number,
  eventId: number
) => {
  if (
    eventType &&
    activityId !== undefined &&
    eventId !== undefined &&
    state.director.myEvents.data[eventType] &&
    state.director.myEvents.data[eventType].byActivityId[activityId] &&
    state.director.myEvents.data[eventType].byActivityId[activityId][eventId]
  ) {
    return state.director.myEvents.data[eventType].byActivityId[activityId][
      eventId
    ];
  }
  return {} as any;
};
// status

export const myEventsStatusSelector = (state: RootState) =>
  state.director.myEvents.status;
