import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  currentUserIdSelector,
  profileDataSelector,
  signOutThunk,
  updateProfileThunk,
  uploadProfilePictureThunk,
} from '../../redux/slices/AuthSlice';
import { RootState } from '../../redux/store';
import { styles } from '../../theme/styles/styles';
import { clearShoppingCartItemsThunk } from '../../redux/slices/ShoppingCartSlice';
import { supabase } from '../../client';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(currentUserIdSelector);
  const loading = useAppSelector(
    (state: RootState) => state.auth.profileStatus === 'loading'
  );
  const profileData = useAppSelector(profileDataSelector);
  const [firstName, setFirstName] = useState(profileData?.first_name);
  const [lastName, setLastName] = useState(profileData?.last_name);
  const [usattMemberId, setUsattMemberId] = useState(
    profileData?.usatt_member_id
  );
  const [email, setEmail] = useState(profileData?.email);
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(
    profileData?.date_of_birth?.toDateString
  );

  const [currentProfilePicture, setCurrentProfilePicture] = useState(
    profileData?.avatar_url
  );
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // useEffect(() => {
  //   if (!profileData)
  //     dispatch(getProfileDataThunk({ userId: session?.user?.id }));
  // }, [profileData]);

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.first_name);
      setLastName(profileData.last_name);
      setUsattMemberId(profileData.usatt_member_id);
      setEmail(profileData.email);
      setDateOfBirth(profileData.date_of_birth?.toDateString);
      setCurrentProfilePicture(profileData.avatar_url);
    }
  }, [profileData]);

  const handleSignOut = async () => {
    dispatch(clearShoppingCartItemsThunk({ userId }));
    dispatch(signOutThunk());
  };

  const chooseProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });
      const response =
        result && result.assets && (await fetch(result.assets[0].uri));
      if (result && result.assets && !result.canceled) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        console.log('asset,', result.assets[0]);
        console.log('blob,', blob);

        if (blob) {
          const content = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );

          const { data, error } = await supabase.storage
            .from('avatars')
            .upload(`profile-pictures/` + userId + '.jpeg', content, {
              contentType: 'image/jpeg',
              upsert: true,
            });
          setCurrentProfilePicture(result.assets[0].uri);
          if (error) throw error;
          // const { data: url, error } = await supabase.storage
          //   .from('avatars')
          //   .createSignedUploadUrl(`profile-pictures/` + userId + '.jpeg');

          // if (error) throw error;

          // const { data, error: uploadError } = await supabase.storage
          //   .from('avatars')
          //   .uploadToSignedUrl(url.path, url.token, blob, { upsert: true });

          // if (uploadError) throw uploadError;

          console.log('upload response:', data);
        }
      }
    } catch (error) {
      console.log('error uploading profile picture: ', error);
    }
  };

  async function updateProfile() {
    let profileData = {
      first_name: firstName,
      last_name: lastName,
      // avatar_url: '',
      // email: email,
      usatt_member_id: usattMemberId,
      date_of_birth: dateOfBirth,
    };
    dispatch(
      updateProfileThunk({
        userId,
        profileData,
        profilePicture: newProfilePicture,
      })
    );
  }

  return (
    <SafeAreaView style={cStyles.container}>
      <ScrollView>
        <View style={[cStyles.verticallySpaced, cStyles.mt20]}>
          <TouchableOpacity
            onPress={chooseProfilePicture}
            style={cStyles.avatarContainer}
          >
            <Image
              source={{
                uri: currentProfilePicture,
              }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />

            {/* {currentProfilePicture ? (
              <Image
                source={{
                  uri: currentProfilePicture,
                }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Icon name="user" size={100} color={COLORS.gray} />
            )} */}
          </TouchableOpacity>
          <Input
            label="Email"
            value={loading ? 'Loading...' : email || ''}
            disabled
          />
        </View>
        <View style={cStyles.verticallySpaced}>
          <Input
            label="First Name"
            value={loading ? 'Loading...' : firstName || ''}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>
        <View style={cStyles.verticallySpaced}>
          <Input
            label="Last Name"
            value={loading ? 'Loading...' : lastName || ''}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        <TouchableOpacity
          disabled={loading}
          style={styles.primaryButton}
          onPress={() => updateProfile()}
        >
          {loading ? (
            <Text style={styles.buttonText}>Loading...</Text>
          ) : (
            <Text style={styles.buttonText}>Update </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton]}
          onPress={() => handleSignOut()}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const cStyles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  dateText: {
    marginBottom: 3,
  },
});
