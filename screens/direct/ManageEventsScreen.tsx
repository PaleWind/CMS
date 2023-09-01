import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { styles } from '../../theme/styles/styles';

import { eventTableNames } from '../../types/constants';
import { ActivityType, EventType } from '../../types/types';
import { RootState } from '../../redux/store';
import { EventList } from '../../components/lists/EventList';
import { routes } from '../../navigation/routes';
import {
  createEventThunk,
  myEventsByActivityIdSelector,
  myEventsStatusSelector,
} from '../../redux/slices/director/DirectorEventsSlice';

interface Props {
  route: any;
  navigation: any;
}

const ManageEventsScreen = ({ route, navigation }: Props) => {
  console.log('hi from ManageEventsScreen');
  const dispatch = useAppDispatch();
  const {
    activityType,
    activityId,
  }: { activityType: ActivityType; activityId: number } = route?.params;
  const eventType = eventTableNames[activityType] as EventType;
  const status = useAppSelector(myEventsStatusSelector, shallowEqual);
  // const events = useAppSelector(
  //   (state: RootState) =>
  //     myEventsByActivityIdSelector(state, eventType, activityId),
  //   shallowEqual
  // );

  // useEffect(() => {
  //   if (!events) {
  //     dispatch(getMyActivityEventsThunk({ activityType, activityId }));
  //   }
  // }, []);

  const handleCreateEvent = async () => {
    dispatch(createEventThunk({ eventType, activityId }));
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          handleCreateEvent();
        }}
      >
        <Text style={styles.buttonText}>+ New event</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Events</Text>
      {status === 'loading' ? (
        <Text>Loading events...</Text>
      ) : status === 'failed' ? (
        <Text>Error</Text>
      ) : (
        <EventList
          activityType={activityType}
          activityId={activityId}
          navigation={navigation}
          route={routes.EVENT_SETTINGS}
        />
      )}
    </View>
  );
};

export default ManageEventsScreen;
