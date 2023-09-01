import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  ActivityType,
  EventType,
  Event,
  ILeagueEvent,
  ITournamentEvent,
  ITrainingCampEvent,
} from '../../types/types';
import { supabase } from '../../client';
import { eventParentIdFields, eventTableNames } from '../../types/constants';
import { updateEventThunk } from './director/DirectorEventsSlice';

export interface EventsState {
  data: {
    tournament_events: Record<number, ITournamentEvent[]>;
    league_events: Record<number, ILeagueEvent[]>;
    camp_events: Record<number, ITrainingCampEvent[]>;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'updating' | 'failed';
  error: string | undefined;
}

const initialState: EventsState = {
  data: { tournament_events: {}, league_events: {}, camp_events: {} },
  status: 'idle',
  error: undefined,
};

export const getEventsbyActivityIdThunk = createAsyncThunk(
  'events/getEventsbyActivityIdThunk',
  async (
    {
      activityType,
      activityId,
    }: { activityType: ActivityType; activityId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const tableName = eventTableNames[activityType];
      const field = eventParentIdFields[tableName];
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq(field, activityId)
        .order('start_date', { ascending: true });
      if (error) throw error;
      const map = data?.reduce((eventMap, event) => {
        eventMap[event.id] = event;
        return eventMap;
      }, {} as any);

      return { tableName, activityId, map };
    } catch (error) {
      console.log('Error fetching activities: ', error);
      return rejectWithValue(error);
    }
  }
);

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getEventsbyActivityIdThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getEventsbyActivityIdThunk.fulfilled, (state, action: any) => {
        console.log('action: ', action);
        state.status = 'succeeded';
        const { tableName, activityId, map } = action.payload;
        state.data[tableName as keyof typeof state.data][activityId] = map;
      })
      .addCase(getEventsbyActivityIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEventThunk.fulfilled, (state, action: any) => {
        const {
          eventType,
          activityId,
          newEvent,
        }: { eventType: EventType; activityId: number; newEvent: Event } =
          action.payload;
        state.status = 'succeeded';
        if (
          !eventType ||
          !activityId ||
          !newEvent.id ||
          !state.data[eventType][activityId as any][newEvent.id]
        )
          return;
        state.data[eventType][activityId as any][newEvent.id] = newEvent as any;
      });
  },
});

export const {} = eventsSlice.actions;

export default eventsSlice.reducer;

export const allEventsSelector = (state: RootState) => {
  const { tournament_events, league_events, camp_events } = state.events.data;

  return {
    events: {
      tournaments: Object.values(tournament_events),
      leagues: Object.values(league_events),
      camps: Object.values(camp_events),
    },
  };
};

export const eventsByActivityIdSelector = (
  state: RootState,
  eventType: EventType,
  activityId: number
) =>
  state.events.data[eventType as keyof typeof state.events.data][activityId] ||
  null;

export const eventByEventIdSelector = (
  state: RootState,
  eventType: EventType,
  activityId: number,
  eventId: number
) => {
  if (
    eventType &&
    activityId !== undefined &&
    eventId !== undefined &&
    state.events.data[eventType] &&
    state.events.data[eventType][activityId] &&
    state.events.data[eventType][activityId][eventId]
  ) {
    return state.events.data[eventType][activityId][eventId];
  }
  return {} as any;
};

export const eventsStatusSelector = (state: RootState) => state.events.status;
