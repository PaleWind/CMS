import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../client';
import { RootState } from '../store';
import { ProfileData } from '../../types/types';

export interface PlayersState {
  data: {
    profiles: {
      [userId: string]: ProfileData;
    };
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: PlayersState = {
  data: { profiles: {} },
  status: 'idle',
  error: undefined,
};

export const getProfilesByIdThunk = createAsyncThunk(
  'players/getProfilesByIdThunk',
  async (
    {
      userIds,
    }: {
      userIds: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`*`)
        .in('id', userIds);
      if (error) throw error;
      return { data };
    } catch (error) {
      console.log('error fetcing players: ', error);
      return rejectWithValue(error);
    }
  }
);

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getProfilesByIdThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getProfilesByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data } = action.payload;
        data.forEach((profile: ProfileData) => {
          if (profile && profile.id) state.data.profiles[profile.id] = profile;
        });
      })
      .addCase(getProfilesByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const profilesByIdSelector = (
  state: RootState,
  userIds: string[]
): ProfileData[] => {
  const profiles = [] as any;
  if (!userIds) return profiles;
  for (let id of userIds as any) {
    if (state.players.data.profiles[id]) {
      profiles.push(state.players.data.profiles[id]);
    }
  }
  return profiles;
};

export const {} = playersSlice.actions;

export default playersSlice.reducer;
