import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  Activity,
  ActivityType,
  ILeague,
  ITournament,
  ITrainingCamp,
} from '../../../types/types';
import { supabase } from '../../../client';
import { activityTypes } from '../../../types/constants';
import { getActivityType } from '../../../types/types';
import { signOutThunk } from '../AuthSlice';

export interface DirectorActivitiesState {
  data: {
    tournaments: Record<number, ITournament>;
    leagues: Record<number, ILeague>;
    camps: Record<number, ITrainingCamp>;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: DirectorActivitiesState = {
  data: { tournaments: {}, leagues: {}, camps: {} },
  status: 'idle',
  error: undefined,
};

export const getMyActivitiesThunk = createAsyncThunk(
  'directorActivities/getMyActivitiesThunk',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.auth.data.currentSession?.user.id;
      const myActivities = {} as any;
      for (const tableName of activityTypes) {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('start_date', { ascending: true })
          .eq('owner_id', currentUser);

        if (error) throw error;
        const map = data?.reduce((activityMap, activity) => {
          activityMap[activity.id] = activity;
          return activityMap;
        }, {} as any);

        // console.log(`${tableName} map: `, map);
        myActivities[tableName] = map;
      }
      return myActivities;
    } catch (error) {
      console.error('Error fetching data:', error);
      return rejectWithValue({});
    }
  }
);

export const upsertActivityThunk = createAsyncThunk(
  'directorActivities/upsertActivityThunk',
  async (
    { activity, activityType }: { activity: any; activityType: ActivityType },
    { rejectWithValue }
  ) => {
    try {
      console.log(activity);
      const { data, error } = await supabase
        .from(activityType)
        .upsert({ ...activity })
        .select();

      if (error) throw error;
      return { activity: data[0] };
    } catch (error) {
      console.log(error);
      return rejectWithValue({});
    }
  }
);

export const deleteActivityThunk = createAsyncThunk(
  'directorActivities/deleteActivityThunk',
  async (
    {
      activityType,
      activityId,
    }: { activityType: ActivityType; activityId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.auth.data.currentSession?.user.id;
      const { data, error } = await supabase
        .from(activityType)
        .delete()
        .eq('id', activityId)
        .eq('owner_id', currentUser);

      if (error) throw error;
      return { activityType, activityId };
    } catch (error) {
      console.log(error);
      return rejectWithValue({});
    }
  }
);

export const directorActivitiesSlice = createSlice({
  name: 'directorActivities',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMyActivitiesThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getMyActivitiesThunk.fulfilled, (state, action: any) => {
        console.log('action: ', action);
        state.status = 'succeeded';
        state.data.tournaments = action.payload.tournaments;
        state.data.leagues = action.payload.leagues;
        state.data.camps = action.payload.camps;
      })
      .addCase(getMyActivitiesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(upsertActivityThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(upsertActivityThunk.fulfilled, (state, action: any) => {
        const { activity }: { activity: Activity } = action.payload;
        console.log('activity: ', activity);
        const activityType = getActivityType(activity);
        state.status = 'succeeded';
        state.data[activityType as keyof typeof state.data][activity?.id] =
          activity;
      })
      .addCase(upsertActivityThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteActivityThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(deleteActivityThunk.fulfilled, (state, action: any) => {
        const {
          activityType,
          activityId,
        }: { activityId: number; activityType: ActivityType } = action.payload;
        state.status = 'succeeded';
        activityType && delete state.data[activityType][activityId];
      })
      .addCase(deleteActivityThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signOutThunk.pending, (state, action) => {
        state = initialState;
      });
  },
});

export const {} = directorActivitiesSlice.actions;

export default directorActivitiesSlice.reducer;

export const myActivitiesListSelector = (state: RootState) => {
  const { tournaments, leagues, camps } = state.director.myActivities.data;

  return {
    myActivitiesList: [
      ...Object.values(tournaments || []),
      ...Object.values(leagues || []),
      ...Object.values(camps || []),
    ] as Activity[],
  };
};

export const myActivitiesSelector = (state: RootState) => {
  const { tournaments, leagues, camps } = state.director.myActivities.data;

  return {
    myActivities: {
      tournaments: Object.values(tournaments || []),
      leagues: Object.values(leagues || []),
      camps: Object.values(camps || []),
    },
  };
};

export const myActivityByIdSelector = (
  state: RootState,
  activityType: ActivityType,
  activityId: number
) => state.director.myActivities.data[activityType][activityId];

export const myActivitiesStatusSelector = (state: RootState) =>
  state.director.myActivities.status;
