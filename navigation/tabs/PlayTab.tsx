import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { routes } from '../routes';
import { PlayLanding } from '../../screens/play/PlayLanding';
import { ActivitiesFilter } from '../../screens/play/ActivitiesFilterScreen';
import ActivityDetails from '../../screens/play/ActivityDetailsScreen';
import EventDetailsScreen from '../../screens/play/EventDetailsScreen';
import { PlayerProfileScreen } from '../../screens/players/PlayerProfileScreen';

export const PlayTab = () => {
  const PlayNavigator = createStackNavigator();

  return (
    <PlayNavigator.Navigator screenOptions={{ headerShown: false }}>
      <PlayNavigator.Screen
        name={routes.PLAY_LANDING}
        component={PlayLanding}
      />
      <PlayNavigator.Screen
        name={routes.ACTIVITIES_FILTER}
        component={ActivitiesFilter}
        options={{ headerShown: true, title: 'Filters' }}
      />
      <PlayNavigator.Screen
        name={routes.ACTIVITY_DETAILS}
        component={ActivityDetails}
        options={{ headerShown: true }}
      />
      <PlayNavigator.Screen
        name={routes.EVENT_DETAILS}
        component={EventDetailsScreen}
        options={{ headerShown: true }}
      />
      <PlayNavigator.Screen
        name={routes.PLAYER_PROFILE}
        component={PlayerProfileScreen as any}
        options={{ headerShown: true }}
      />
    </PlayNavigator.Navigator>
  );
};
