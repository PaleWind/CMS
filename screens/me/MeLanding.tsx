import React, { useState, createContext, useContext } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../theme/styles/styles';
import { routes } from '../../navigation/routes';

interface Props {
  navigation: any;
}

export function MeLanding({ navigation }: Props) {
  return (
    <View style={[styles.container, { padding: 20 }]}>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate(routes.PROFILE)}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(routes.LEAGUES_HOME)}
      >
        <Text style={styles.buttonText}>Leagues</Text>
      </TouchableOpacity> */}
    </View>
  );
}
