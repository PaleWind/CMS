import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/AuthSlice';
import activitiesReducer from './slices/ActivitiesSlice';
import eventsReducer from './slices/EventsSlice';
import shoppingCartReducer from './slices/ShoppingCartSlice';
import directorActivitiesReducer from './slices/director/DirectorActivitiesSlice';
import directorEventsReducer from './slices/director/DirectorEventsSlice';
import enrollmentsReducer from './slices/EnrollmentsSlice';
import playersReducer from './slices/PlayersSlice';
import DirectorEnrollmentsReducer from './slices/director/DirectorEnrollmentsSlice';

const directorReducer = combineReducers({
  myActivities: directorActivitiesReducer,
  myEvents: directorEventsReducer,
  myEventEnrollments: DirectorEnrollmentsReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activitiesReducer,
    events: eventsReducer,
    enrollments: enrollmentsReducer,
    players: playersReducer,
    shoppingCart: shoppingCartReducer,
    director: directorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
