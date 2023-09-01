import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Session } from '@supabase/supabase-js';
import {
  Activity,
  ActivityType,
  ILeague,
  ITournament,
  ITrainingCamp,
  ITrainingCampEvent,
  getActivityType,
} from '../../types/types';
import { supabase } from '../../client';
import { activityTypeLabelMap, activityTypes } from '../../types/constants';
import {
  deleteActivityThunk,
  upsertActivityThunk,
} from './director/DirectorActivitiesSlice';

export interface ActivitiesState {
  activities: {
    tournaments: Record<number, ITournament>;
    leagues: Record<number, ILeague>;
    camps: Record<number, ITrainingCamp>;
  };
  filters: {
    selectedActivityTypes: string[];
    setSelectedActivityStatus: string[];
  };
  hasMore: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const activityTables = Object.keys(activityTypeLabelMap);

const initialState: ActivitiesState = {
  activities: { tournaments: {}, leagues: {}, camps: {} },
  filters: {
    selectedActivityTypes: activityTables,
    setSelectedActivityStatus: [],
  },
  hasMore: true,
  status: 'idle',
  error: undefined,
};

export const getActivitiesThunk = createAsyncThunk(
  'activities/getActivitiesThunk',
  async () => {
    const activities = {} as any;
    for (const table of activityTypes) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('registration_open', true)
        .order('start_date', { ascending: true });
      //.range(rangeStart, rangeStart + offset);

      if (error) {
        console.error('Error fetching data:', error);
      }
      const map = data?.reduce((activityMap, activity) => {
        activityMap[activity.id] = activity;
        return activityMap;
      }, {} as any);
      // console.log(`${table} map: `, map);
      activities[table] = map;
    }
    return activities;
  }
);

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setSelectedActivityTypes: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedActivityTypes =
        action.payload.length > 0 ? action.payload : activityTables;
    },
    setSelectedActivityStatus: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedActivityTypes = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getActivitiesThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getActivitiesThunk.fulfilled, (state, action: any) => {
        console.log('action: ', action);
        state.status = 'succeeded';
        state.activities.tournaments = action.payload.tournaments;
        state.activities.leagues = action.payload.leagues;
        state.activities.camps = action.payload.camps;
      })
      .addCase(getActivitiesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(upsertActivityThunk.fulfilled, (state, action: any) => {
        const { activity }: { activity: Activity } = action.payload;
        console.log('activity: ', activity);
        const activityType = getActivityType(activity);
        state.status = 'succeeded';
        if (activity.registration_open && activityType)
          state.activities[activityType][activity?.id] = activity;
      })
      .addCase(deleteActivityThunk.fulfilled, (state, action: any) => {
        const {
          activityType,
          activityId,
        }: { activityId: number; activityType: ActivityType } = action.payload;
        state.status = 'succeeded';
        activityType && delete state.activities[activityType][activityId];
      });
  },
});

export const { setSelectedActivityTypes, setSelectedActivityStatus } =
  activitiesSlice.actions;

export default activitiesSlice.reducer;

export const allActivitiesSelector = (state: RootState) => {
  const { tournaments, leagues, camps } = state.activities.activities;

  return {
    activities: {
      tournaments: Object.values(tournaments),
      leagues: Object.values(leagues),
      camps: Object.values(camps),
    },
  };
};

export const activityByIdSelector = (
  state: RootState,
  activityType: ActivityType,
  activityId: number
) => state.activities.activities[activityType][activityId];

// filters
export const allFiltersSelector = (state: RootState) =>
  state.activities.filters;

export const selectedActivityTypesSelector = (state: RootState) =>
  state.activities.filters.selectedActivityTypes;

export const activitiesStatusSelector = (state: RootState) =>
  state.activities.status;
