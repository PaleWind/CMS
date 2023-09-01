import { Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { routes } from '../../navigation/routes';
import { styles } from '../../theme/styles/styles';
import { Activity, ActivityType } from '../../types/types';
import { RootState } from '../../redux/store';
import { myActivityByIdSelector } from '../../redux/slices/director/DirectorActivitiesSlice';
import { shallowEqual } from 'react-redux';

interface Props {
  route: any;
  navigation: any;
}

export function ManageActivityHome({ route, navigation }: Props) {
  console.log('hi from ManageTournamentHome: ', route.params);
  const {
    activityType,
    activityId,
  }: { activityType: ActivityType; activityId: number } = route?.params;
  const dispatch = useAppDispatch();

  const activity = useAppSelector(
    (state: RootState) =>
      myActivityByIdSelector(state, activityType, activityId),
    shallowEqual
  );
  console.log('managed activity:', activity, activityType, activityId);

  useEffect(() => {
    if (!activity) {
      navigation.navigate(routes.DIRECT_LANDING);
    }
  }, [activity, navigation]);

  return (
    <View style={styles.container}>
      {/* <ScrollView>{renderedEvents}</ScrollView> */}
      <Text>{activity?.name}</Text>
    </View>
  );
}
