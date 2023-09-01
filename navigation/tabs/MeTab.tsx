import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MeLanding } from '../../screens/me/MeLanding';
import { ProfileScreen } from '../../screens/me/MyProfileScreen';

export const MeTab = () => {
  const MeNavigator = createStackNavigator();

  return (
    <MeNavigator.Navigator>
      <MeNavigator.Screen
        name="MeHome"
        component={MeLanding as any}
        options={{ headerShown: false }}
      />
      <MeNavigator.Screen
        name="Profile"
        component={ProfileScreen as any}
        options={{ headerShown: false }}
      />
      {/* <AuthNavigator.Screen
        name="Cart"
        component={ShoppingCartScreen as any}
        options={{ headerShown: false }}
      /> */}
    </MeNavigator.Navigator>
  );
};
