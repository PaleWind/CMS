import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../theme/theme';
import { Activity, ActivityType, getActivityType } from '../../types/types';
import { routes } from '../../navigation/routes';

export const ActivityCard = ({
  activity,
  handleNavigate,
}: {
  activity: Activity;
  handleNavigate: any;
}) => {
  const activityType = getActivityType(activity);
  if (!activityType) {
    return null;
  }
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {activity?.name}
        </Text>

        <Text style={styles.info}>{activity?.start_date?.toString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: SIZES.xSmall,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    backgroundColor: '#FFF',
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
