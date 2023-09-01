import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../theme/theme';
import { Event, getEventType } from '../../types/types';
import { useAppSelector } from '../../redux/hooks';
import { enrollmentCountByEventIdSelector } from '../../redux/slices/EnrollmentsSlice';
import { eventParentIdFields } from '../../types/constants';
import Icon from 'react-native-vector-icons/FontAwesome';

export const EventCard = ({
  event,
  handleNavigate,
  myEvent = false,
}: {
  event: Event;
  handleNavigate: any;
  myEvent: boolean;
}) => {
  const eventType = getEventType(event);
  const idField = eventType && eventParentIdFields[eventType];
  const activityId =
    idField && (event[idField as keyof typeof event] as number);
  const enrollmentCount = useAppSelector((state) =>
    eventType && activityId && myEvent
      ? enrollmentCountByEventIdSelector(state, eventType, activityId, event.id)
      : eventType &&
        activityId &&
        enrollmentCountByEventIdSelector(state, eventType, activityId, event.id)
  );
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {event?.name}
          </Text>
          <Text style={styles.info}>${event?.price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.info}>
            {event?.start_date.toString().slice(0, 10)}
          </Text>
          <Text style={styles.info}>
            {enrollmentCount}/{event?.max_players}{' '}
            <Icon name="user" size={20} color={COLORS.gray} />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.small,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: '#FFF',
    ...SHADOWS.medium,
    shadowColor: COLORS.gray2,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },

  logImage: {
    width: '70%',
    height: '70%',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  title: {
    fontSize: SIZES.medium,
    fontFamily: 'DMBold',
    color: COLORS.tertiary,
  },
  info: {
    fontSize: SIZES.small + 2,
    fontFamily: 'DMRegular',
    color: COLORS.gray,
    marginTop: 3,
    textTransform: 'capitalize',
  },
});
