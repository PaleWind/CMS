import { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { COLORS, FONT, SIZES } from '../../theme/theme';
import { RootState } from '../../redux/store';
import { EventFooter } from '../../components/event-details/EventFooter';
import { EventType } from '../../types/types';
import {
  addShoppingCartItemThunk,
  itemExistsInCartSelector,
} from '../../redux/slices/ShoppingCartSlice';
import { currentUserIdSelector } from '../../redux/slices/AuthSlice';
import { eventByEventIdSelector } from '../../redux/slices/EventsSlice';
import PlayerList from '../../components/lists/PlayerList';
import {
  enrollmentsByEventIdSelector,
  getEnrollmentsByIdThunk,
} from '../../redux/slices/EnrollmentsSlice';

const tabs = ['Info', 'Events', 'Contact'];

interface EventDetailsProps {
  route: any;
  navigation: any;
}

const EventDetailsScreen = ({ route, navigation }: EventDetailsProps) => {
  const {
    eventType,
    activityId,
    eventId,
  }: {
    eventType: EventType;
    activityId: number;
    eventId: number;
  } = route.params;
  console.log(route.params);
  const dispatch = useAppDispatch();
  const userId = useAppSelector(currentUserIdSelector);
  const status = useAppSelector((state: RootState) => state.activities.status);
  const event = useAppSelector((state: RootState) =>
    eventByEventIdSelector(state, eventType, activityId, eventId)
  );
  const canAddToCart = !useAppSelector((state: RootState) =>
    itemExistsInCartSelector(state, event)
  );

  const handleAddToCart = () => {
    dispatch(addShoppingCartItemThunk({ userId, cartItem: event }));
  };

  const players = useAppSelector((state: RootState) =>
    enrollmentsByEventIdSelector(state, eventType, activityId, eventId)
  );

  useEffect(() => {
    if (!players || players.length === 0) {
      dispatch(getEnrollmentsByIdThunk({ eventType, activityId, eventId }));
    }
  }, [players, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : status === 'failed' ? (
        <Text>Something went wrong</Text>
      ) : (
        <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
          {/* <ActivityHero activity={activity} /> */}
          <Text>{event?.name}</Text>
          <Text>{event?.start_date} - </Text>
          <Text>${event?.price}</Text>
        </View>
      )}

      <PlayerList
        userIds={players}
        navigation={navigation}
        refresh={() => {
          dispatch(getEnrollmentsByIdThunk({ eventType, activityId, eventId }));
        }}
        editing={false}
      />

      <EventFooter
        userId={userId}
        canAddToCart={canAddToCart}
        onAddToCart={canAddToCart ? () => handleAddToCart() : () => {}}
      />
    </SafeAreaView>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
    backgroundColor: '#FFF',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontFamily: FONT.bold,
  },
  infoCintainer: {
    marginVertical: SIZES.small,
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: SIZES.small / 1.25,
  },
  infoText: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    fontFamily: FONT.regular,
    marginLeft: SIZES.small,
  },
});
