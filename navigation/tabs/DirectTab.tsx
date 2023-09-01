import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { routes } from '../routes';
import { DirectLanding } from '../../screens/direct/DirectLanding';
import { EventSettingsScreen } from '../../screens/direct/EventSettingsScreen';
import { ActivityManagementDrawer } from '../ActivityManagementDrawer';
import { PlayerProfileScreen } from '../../screens/players/PlayerProfileScreen';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { currentSessionSelector } from '../../redux/slices/AuthSlice';
import { shallowEqual } from 'react-redux';
import { getMyActivitiesThunk } from '../../redux/slices/director/DirectorActivitiesSlice';

const DirectorNavigator = createStackNavigator();

export const DirectTab = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('direct tab');
    // dispatch(getMyActivitiesThunk());
  }, []);

  return (
    <DirectorNavigator.Navigator>
      <DirectorNavigator.Screen
        name={routes.DIRECT_LANDING}
        component={DirectLanding}
        options={{ headerShown: false }}
      />
      <DirectorNavigator.Screen
        name={routes.MANAGE_ACTIVITY_DRAWER}
        component={ActivityManagementDrawer}
        options={{ headerShown: false }}
      />
      <DirectorNavigator.Screen
        name={routes.EVENT_SETTINGS}
        component={EventSettingsScreen}
        options={{ headerShown: true }}
      />
      <DirectorNavigator.Screen
        name={routes.PLAYER_PROFILE}
        component={PlayerProfileScreen as any}
        options={{ headerShown: true }}
      />
    </DirectorNavigator.Navigator>
  );
};
