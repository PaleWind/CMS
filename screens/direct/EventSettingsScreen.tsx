import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { shallowEqual } from 'react-redux';
import { EventSettingsForm } from '../../components/event-settings/EventSettingsForm';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { EventType } from '../../types/types';
import { myEventByEventIdSelector } from '../../redux/slices/director/DirectorEventsSlice';
import { styles } from '../../theme/styles/styles';
import { Tabs } from '../../components/theme/Tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../theme/theme';
import PlayerList from '../../components/lists/PlayerList';
import {
  enrollmentsByEventIdSelector,
  getEnrollmentsByIdThunk,
} from '../../redux/slices/EnrollmentsSlice';
import { footerStyles } from '../../theme/styles/footer';
import { EventHero } from '../../components/event-details/EventHero';
import { RootState } from '../../redux/store';
import { activityByIdSelector } from '../../redux/slices/ActivitiesSlice';
import { activityTypesByEventType } from '../../types/constants';
import { EditEnrollmentsList } from '../../components/lists/editEnrollmentsList';

const tabs = ['Players', 'Draw', 'Settings'];

interface Props {
  route: any;
  navigation: any;
}

export function EventSettingsScreen({ route, navigation }: Props) {
  const {
    eventType,
    activityId,
    eventId,
  }: { eventType: EventType; activityId: number; eventId: number } =
    route.params;
  const dispatch = useAppDispatch();
  const activityType = activityTypesByEventType[eventType];
  const activity =
    activityType &&
    useAppSelector(
      (state) => activityByIdSelector(state, activityType, activityId),
      shallowEqual
    );

  const event = useAppSelector(
    (state) => myEventByEventIdSelector(state, eventType, activityId, eventId),
    shallowEqual
  );

  const players = useAppSelector((state: RootState) =>
    enrollmentsByEventIdSelector(state, eventType, activityId, eventId)
  );

  useEffect(() => {
    if (!players || players.length === 0) {
      dispatch(getEnrollmentsByIdThunk({ eventType, activityId, eventId }));
    }
  }, [players, dispatch]);

  useEffect(() => {
    if (!event?.id) {
      // navigation.navigate(routes.MANAGE_EVENTS, {});
      navigation.goBack();
    }
  }, [event, navigation]);

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'Players':
        return (
          <EditEnrollmentsList
            userIds={players}
            navigation={navigation}
            refresh={() => {
              dispatch(
                getEnrollmentsByIdThunk({ eventType, activityId, eventId })
              );
            }}
            eventIds={{ eventType, activityId, eventId }}
          />
        );

      case 'Draw':
        return <Text>Platers</Text>;

      case 'Settings':
        return (
          <EventSettingsForm
            eventType={eventType}
            activityId={activityId}
            event={event}
          />
        );

      default:
        return null;
    }
  };

  return (
    // <View style={styles.scrollContainer}>
    <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View
        style={{
          paddingHorizontal: SIZES.medium,
          flex: 1,
          // paddingBottom: 130,
        }}
      >
        <EventHero
          name={event?.name}
          parentName={activity?.name}
          startDate={event?.start_date}
          price={event?.price}
          enrollmentCount={players?.length || 0}
          maxPlayers={event.max_players}
        />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        {displayTabContent()}
      </View>
      {/* <View style={footerStyles.container}></View> */}
    </View>
    // </View>
  );
}
