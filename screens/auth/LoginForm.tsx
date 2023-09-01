import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../theme/styles/styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { supabase } from '../../client';
// import { signInThunk } from '../../redux/slices/AuthSlice';
import { shallowEqual } from 'react-redux';
import { RootState } from '../../redux/store';
import { ActivityIndicator } from 'react-native-paper';

export const LoginForm: any = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const status = useAppSelector(
    (state: RootState) => state.auth.sessionStatus,
    shallowEqual
  );
  async function signInWithEmail() {
    // dispatch(signInThunk({ email, password }));
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.title}>Log In</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => signInWithEmail()}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};
