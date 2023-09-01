import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { supabase } from '../client';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  currentSessionSelector,
  getProfileDataThunk,
  profileStatusSelector,
  setCurrentSession,
  userRoleSelector,
} from '../redux/slices/AuthSlice';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/theme';
import { getShoppingCartItemsThunk } from '../redux/slices/ShoppingCartSlice';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlayTab } from './tabs/PlayTab';
import { PlayersTab } from './tabs/PlayersTab';
import { DirectTab } from './tabs/DirectTab';
import { MeTab } from './tabs/MeTab';
import { AuthTab } from './tabs/AuthTab';
import { ShoppingCartFAB } from '../components/shopping-cart/ShoppingCartFAB';
import { shoppingCartStatusSelector } from '../redux/slices/ShoppingCartSlice';
import { shallowEqual } from 'react-redux';
import {
  getMyActivitiesThunk,
  myActivitiesStatusSelector,
} from '../redux/slices/director/DirectorActivitiesSlice';
import {
  addDirectorEnrollment,
  removeDirectorEnrollment,
} from '../redux/slices/director/DirectorEnrollmentsSlice';
import { addEnrollment } from '../redux/slices/EnrollmentsSlice';

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const currentSession = useAppSelector(currentSessionSelector, shallowEqual);
  const userRole = useAppSelector(userRoleSelector);
  const profileStatus = useAppSelector(profileStatusSelector);
  const shoppingCartStatus = useAppSelector(shoppingCartStatusSelector);
  const myActivitiesStatus = useAppSelector(myActivitiesStatusSelector);
  const BottomTabs = createBottomTabNavigator();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setCurrentSession(session));
    });

    supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setCurrentSession(session));
    });

    const enrollmentsChannel = supabase
      .channel('enrollments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_enrollments',
        },
        (payload) => {
          const payloadType = payload.eventType;
          console.log('realtime event: ', payload);
          if (payloadType === 'DELETE') {
            dispatch(removeDirectorEnrollment({ item: payload.old }));
          } else if (payloadType === 'INSERT' || payloadType === 'UPDATE') {
            dispatch(addEnrollment({ item: payload.new }));
            dispatch(addDirectorEnrollment({ item: payload.new }));
          }
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    if (currentSession) {
      if (profileStatus === 'idle')
        dispatch(getProfileDataThunk({ userId: currentSession.user.id }));
      if (shoppingCartStatus === 'idle')
        dispatch(getShoppingCartItemsThunk({ userId: currentSession.user.id }));
      if (
        userRole === 'director' &&
        myActivitiesStatus !== 'succeeded' &&
        myActivitiesStatus !== 'loading'
      ) {
        dispatch(getMyActivitiesThunk());
      }
    }
  }, [currentSession, userRole]);

  const commonTabs = (
    <>
      <BottomTabs.Screen
        name="Play"
        component={PlayTab}
        options={{ headerShown: false }}
      />
      <BottomTabs.Screen
        name="Players"
        component={PlayersTab}
        options={{ headerShown: false }}
      />
    </>
  );

  const userTabs = (
    <>
      {commonTabs}
      {userRole === 'director' && (
        <BottomTabs.Screen
          name="Direct"
          component={DirectTab}
          options={{ headerShown: false }}
        />
      )}
      <BottomTabs.Screen
        name="Me"
        component={MeTab}
        options={{ headerShown: false }}
      />
    </>
  );

  const guestTabs = (
    <>
      {commonTabs}
      <BottomTabs.Screen
        name="Login"
        component={AuthTab}
        options={{ headerShown: false }}
      />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <NavigationContainer>
        <BottomTabs.Navigator>
          {currentSession ? userTabs : guestTabs}
        </BottomTabs.Navigator>
      </NavigationContainer>
      <ShoppingCartFAB />
    </SafeAreaView>
  );
};
