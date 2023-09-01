import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import {
  ActivityType,
  Event,
  EventType,
  getEventType,
} from '../../types/types';
import { routes } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { EventCard } from '../cards/EventCard';
import {
  eventsByActivityIdSelector,
  eventsStatusSelector,
  getEventsbyActivityIdThunk,
} from '../../redux/slices/EventsSlice';
import { eventTableNames } from '../../types/constants';
import {
  getMyEventsbyActivityIdThunk,
  myEventsByActivityIdSelector,
  myEventsStatusSelector,
} from '../../redux/slices/director/DirectorEventsSlice';
import { getEnrollmentsByIdThunk } from '../../redux/slices/EnrollmentsSlice';
import { getMyEnrollmentsByIdThunk } from '../../redux/slices/director/DirectorEnrollmentsSlice';

export const EventList = ({
  activityType,
  activityId,
  navigation,
  route,
}: {
  activityType: ActivityType;
  activityId: number;
  navigation: any;
  route: string;
}) => {
  if (!activityType || !activityId) return <Text>Nothing here...</Text>;
  const dispatch = useAppDispatch();
  const eventTable = eventTableNames[activityType] as EventType;
  let status = useAppSelector(
    route === routes.EVENT_SETTINGS
      ? myEventsStatusSelector
      : eventsStatusSelector
  );

  let events = useAppSelector((state) =>
    route === routes.EVENT_SETTINGS
      ? myEventsByActivityIdSelector(
          state,
          eventTableNames[activityType] as EventType,
          activityId
        )
      : eventsByActivityIdSelector(
          state,
          eventTableNames[activityType] as EventType,
          activityId
        )
  );

  let getEvents = useCallback(async () => {
    route === routes.EVENT_SETTINGS
      ? dispatch(
          getMyEventsbyActivityIdThunk({
            activityType,
            activityId,
          })
        )
      : dispatch(
          getEventsbyActivityIdThunk({
            activityType,
            activityId,
          })
        );
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('refreshing');
    setRefreshing(true);
    getEvents();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (events) {
      dispatch(
        route === routes.EVENT_SETTINGS
          ? getMyEnrollmentsByIdThunk({
              eventType: eventTable,
              activityId,
              eventId: undefined,
            })
          : getEnrollmentsByIdThunk({
              eventType: eventTable,
              activityId,
              eventId: undefined,
            })
      );
    }
  }, [events]);

  useEffect(() => {
    if (!events) {
      getEvents();
    }
  }, [getEvents]);

  const renderEventCard = ({ item }: { item: Event }) => {
    const eventType = getEventType(item);
    if (!eventType) {
      return null;
    }

    return (
      <EventCard
        event={item}
        myEvent={false}
        handleNavigate={() => {
          navigation.navigate(route, {
            eventType,
            activityId,
            eventId: item?.id,
          });
        }}
      />
    );
  };

  return status === 'loading' ? (
    <Text>Loading...</Text>
  ) : (
    <FlatList
      data={events && Object.values(events)}
      renderItem={renderEventCard}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};
