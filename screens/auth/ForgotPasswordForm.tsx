import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { styles } from '../../theme/styles/styles';
import { ITournament } from '../../types/types';
import { supabase } from '../../client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const sendPasswordResetLink = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com/update-password',
    });
    if (error) {
      console.error('Error sending passwaord reset link:', error);
      return error;
    }
    console.log('Password reset link sent successfully ');
  };

  const handleSendResetPasswordLink = async () => {
    sendPasswordResetLink(email).then(() => setSent(true));
  };
  let tournament = {} as ITournament;
  return (
    <>
      <Text style={styles.title}>Reset Password</Text>
      {!sent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSendResetPasswordLink}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.message}>
          A password reset email has been sent to {email}. Please check your
          email and follow the instructions to reset your password.
        </Text>
      )}
    </>
  );
}
