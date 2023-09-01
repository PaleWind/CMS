import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { routes } from '../routes';
import { PlayersLanding } from '../../screens/players/PlayersLanding';
import { PlayerProfileScreen } from '../../screens/players/PlayerProfileScreen';

export const PlayersTab = () => {
  const PlayersNavigator = createStackNavigator();

  return (
    <PlayersNavigator.Navigator screenOptions={{ headerShown: true }}>
      <PlayersNavigator.Screen
        name={routes.PLAYERS_LANDING}
        component={PlayersLanding}
      />
      <PlayersNavigator.Screen
        name={routes.PLAYER_PROFILE}
        component={PlayerProfileScreen as any}
        options={{ headerShown: true }}
      />
    </PlayersNavigator.Navigator>
  );
};
