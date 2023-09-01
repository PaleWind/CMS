import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthScreen } from '../../screens/auth/AuthScreen';
import { ForgotPasswordForm } from '../../screens/auth/ForgotPasswordForm';

export const AuthTab = () => {
  const AuthNavigator = createStackNavigator();

  return (
    <AuthNavigator.Navigator>
      <AuthNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <AuthNavigator.Screen
        name="Reset-Password"
        component={ForgotPasswordForm as any}
        options={{ headerShown: false }}
      />
    </AuthNavigator.Navigator>
  );
};
