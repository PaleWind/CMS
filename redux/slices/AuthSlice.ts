import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../client';
import { ProfileData } from '../../types/types';

export interface AuthState {
  data: {
    currentSession: Session | null;
    profileData: ProfileData | null;
  };
  sessionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  profileStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: AuthState = {
  data: {
    currentSession: null,
    profileData: null,
  },
  sessionStatus: 'idle',
  profileStatus: 'idle',
  error: undefined,
};

export const signInThunk = createAsyncThunk(
  'auth/signInThunk',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      return { currentUser: data?.user, currentSession: data?.session };
    } catch (error) {
      console.log('Error fetching profile data:', error);
      return rejectWithValue(error);
    }
  }
);

export const signOutThunk = createAsyncThunk(
  'auth/signOutThunk',
  async ({}, { rejectWithValue }) => {
    try {
      await supabase.auth.signOut();
      return;
    } catch (error) {
      console.log('Error fetching profile data:', error);
      return rejectWithValue(error);
    }
  }
);

export const getProfileDataThunk = createAsyncThunk(
  'auth/getProfileDataThunk',
  async ({ userId }: { userId: string | undefined }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      // const { data: avatarUrl } = supabase.storage
      //   .from('avatars')
      //   .getPublicUrl(`profile-pictures/${userId}.jpeg`);

      const { data: avatarUrl, error: urlError } = await supabase.storage
        .from('avatars')
        .createSignedUrl('profile-pictures/' + userId + '.jpeg', 60);

      if (urlError) throw urlError;
      data.avatar_url = avatarUrl.signedUrl;
      console.log('auth/getProfileDataThunk', data);
      return data;
    } catch (error) {
      console.log('Error fetching profile data:', error);
      return rejectWithValue(error);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfileThunk',
  async (
    {
      userId,
      profileData,
      profilePicture,
    }: { userId: any; profileData: any; profilePicture: any },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error updating profile data:', error);
      return rejectWithValue(error);
    }
  }
);

export const uploadProfilePictureThunk = createAsyncThunk(
  'auth/uploadProfilePictureThunk',
  async (
    { userId, token, blob }: { userId: any; token: any; blob: any },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .uploadToSignedUrl(`profile-pictures/` + userId + '.jpeg', token, blob);
      if (error) throw error;
      console.log('auth/uploadProfilePictureThunk', data);
      return data;
    } catch (error) {
      console.log('Error uploading profile picture:', error);
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<Session | null>) => {
      state.data.currentSession = action.payload;
    },
    setProfileData: (state, action: any) => {
      state.data.profileData = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signInThunk.pending, (state, action) => {
        state.sessionStatus = 'loading';
      })
      .addCase(signInThunk.fulfilled, (state, action: any) => {
        state.sessionStatus = 'succeeded';
        state.data.currentSession = action.payload;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.sessionStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(signOutThunk.pending, (state, action) => {
        state.sessionStatus = 'loading';
      })
      .addCase(signOutThunk.fulfilled, (state, action: any) => {
        state = initialState;
        state.sessionStatus = 'succeeded';
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state = initialState;
        state.sessionStatus = 'failed';
      })
      .addCase(getProfileDataThunk.pending, (state, action) => {
        state.profileStatus = 'loading';
      })
      .addCase(getProfileDataThunk.fulfilled, (state, action: any) => {
        state.profileStatus = 'succeeded';
        state.data.profileData = action.payload;
      })
      .addCase(getProfileDataThunk.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfileThunk.pending, (state, action) => {
        state.profileStatus = 'loading';
      })
      .addCase(updateProfileThunk.fulfilled, (state, action: any) => {
        state.profileStatus = 'succeeded';
        state.data.profileData = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const currentUserSelector = (state: RootState) =>
  state.auth.data.currentSession?.user;

export const currentUserIdSelector = (state: RootState) =>
  state.auth.data.currentSession?.user?.id;

export const currentSessionSelector = (state: RootState) =>
  state.auth.data.currentSession;

export const profileDataSelector = (state: RootState) =>
  state.auth.data.profileData;

export const userRoleSelector = (state: RootState) =>
  state.auth.data.profileData?.role || 'anon';

export const profileStatusSelector = (state: RootState) =>
  state.auth.profileStatus;

export const sessionStatusSelector = (state: RootState) =>
  state.auth.sessionStatus;

export const isSignedInSelector = (state: RootState) =>
  state.auth.data.currentSession?.user;

export default authSlice.reducer;

export const { setCurrentSession, setProfileData } = authSlice.actions;
