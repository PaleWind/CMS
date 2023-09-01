import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import { styles } from '../../theme/styles/styles';
import { supabase } from '../../client';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usattMemberId, setUsattMemberId] = useState('');
  const [usattMember, setUsattMember] = useState('');
  const [showSignUpSuccess, setShowSignUpSuccess] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const checkPlayerExists = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .filter('first_name', 'ilike', firstName.toLowerCase())
      .filter('last_name', 'ilike', lastName.toLowerCase())
      .filter('member_id', 'eq', usattMemberId)
      .filter('date_of_birth', 'eq', dateOfBirth);

    if (error) {
      // console.error('Error fetching players:', error);
      return false;
    }

    console.log('existing player found: ', data);
    return data.length > 0;
  };

  const handleSignup = async () => {
    let formErrors = {} as any;
    if (!firstName) formErrors.firstName = 'First name is required';
    if (!lastName) formErrors.lastName = 'Last name is required';
    if (!email) formErrors.email = 'Email is required';
    if (!dateOfBirth) formErrors.dateOfBirth = 'Date of birth is required';
    if (usattMember === 'yes') {
      if (!usattMemberId) {
        formErrors.usattMemberId =
          'USATT Member ID is required to verify Usatt Membership';
      }
      if (Object.keys(formErrors).length === 0) {
        const playerExists = await checkPlayerExists();
        if (!playerExists) {
          formErrors.all = "We couldn't find you in our system";
        }
      }
    }
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            email: email,
            first_name: firstName,
            last_name: lastName,
            usatt_member_id: parseInt(usattMemberId) || null,
            date_of_birth: dateOfBirth,
          },
        },
      });

      setLoading(false);
      if (error) Alert.alert(error.message);
      else setShowSignUpSuccess(true);
    }
  };

  if (showSignUpSuccess) {
    return (
      <>
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.label}>
          Check your email for a confirmation link
        </Text>
      </>
    );
  }
  return (
    <>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.label}>
        Have you ever been a USATT member before?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButton
          value="yes"
          status={usattMember === 'yes' ? 'checked' : 'unchecked'}
          onPress={() => setUsattMember('yes')}
        />
        <Text>Yes</Text>
      </View>
      <View style={styles.radioContainer}>
        <RadioButton
          value="no"
          status={usattMember === 'no' ? 'checked' : 'unchecked'}
          onPress={() => setUsattMember('no')}
        />
        <Text>No</Text>
      </View>
      {usattMember !== '' && (
        <>
          {usattMember === 'yes' && (
            <>
              {errors.usattMemberId && (
                <Text style={styles.inputError}>{errors.usattMemberId}</Text>
              )}
              <TextInput
                style={[
                  styles.input,
                  errors.usattMemberId && styles.inputError,
                ]}
                placeholder="USATT Member ID"
                value={usattMemberId}
                onChangeText={(text) => setUsattMemberId(text)}
              />
            </>
          )}
          {errors.firstName && (
            <Text style={styles.inputError}>{errors.firstName}</Text>
          )}
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          {errors.lastName && (
            <Text style={styles.inputError}>{errors.lastName}</Text>
          )}
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
          {errors.dateOfBirth && (
            <Text style={styles.inputError}>{errors.dateOfBirth}</Text>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.dateText}>
                {dateOfBirth.toLocaleDateString()}
              </Text>
              <Icon
                name="calendar"
                size={30}
                color="#000"
                onPress={() => setShowDatePicker(true)}
              />
            </View>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDateOfBirth(selectedDate);
                }
              }}
            />
          )}
          {errors.email && (
            <Text style={styles.inputError}>{errors.email}</Text>
          )}
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {errors.password && (
            <Text style={styles.inputError}>{errors.password}</Text>
          )}
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          {errors.all && <Text style={styles.inputError}>{errors.all}</Text>}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
}
