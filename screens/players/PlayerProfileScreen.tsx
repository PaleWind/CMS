import React, { useEffect } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { ProfileData } from '../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../theme/theme';
import { profileDataSelector } from '../../redux/slices/AuthSlice';
import {
  getProfilesByIdThunk,
  profilesByIdSelector,
} from '../../redux/slices/PlayersSlice';
import { RootState } from '../../redux/store';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export const PlayerProfileScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { userId } = route.params;

  const dispatch = useAppDispatch();
  const profileData = useAppSelector(
    (state: RootState) => profilesByIdSelector(state, [userId] as string[])[0]
  );

  useEffect(() => {
    if (!profileData) {
      dispatch(getProfilesByIdThunk({ userIds: [userId] as string[] }));
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <Icon
            name="user"
            size={100}
            style={{ borderRadius: 50 }}
            color={COLORS.gray}
          />
        </View>
        {/* <Image
          source={{ uri: profileData?.avatar_url }}
          style={{ width: 200, height: 200 }}
        /> */}
        <Text>{profileData?.first_name}</Text>
        <Text>{profileData?.last_name}</Text>
        <Text>{profileData?.date_of_birth?.toString()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
