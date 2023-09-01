import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from '../../theme/styles/styles';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface Props {
  navigation?: any;
  showNavigation?: any;
}

export function AuthScreen({ showNavigation = true }: Props) {
  const [currentForm, setCurrentForm] = useState('login');

  const LoginScreen = () => {
    return (
      <>
        <LoginForm />
        {showNavigation && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setCurrentForm('signup')}
            >
              <Text style={styles.buttonText}>Sign Up Instead</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setCurrentForm('forgotPassword')}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };

  const SignUpScreen = () => {
    return (
      <>
        <SignUpForm />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCurrentForm('login')}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </>
    );
  };

  const ForgotPasswordScreen = () => {
    return (
      <>
        <ForgotPasswordForm />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCurrentForm('login')}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {currentForm === 'login' ? (
        <LoginScreen />
      ) : currentForm === 'signup' ? (
        <SignUpScreen />
      ) : (
        <ForgotPasswordScreen />
      )}
    </View>
  );
}
