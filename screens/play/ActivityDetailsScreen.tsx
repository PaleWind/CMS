import { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { Info } from '../../components/activity-details/Info';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { COLORS, SIZES } from '../../theme/theme';
import { ActivityHero } from '../../components/activity-details/ActivityHero';
import { Tabs } from '../../components/theme/Tabs';
import { ActivityFooter } from '../../components/activity-details/ActivityFooter';
import {
  activitiesStatusSelector,
  activityByIdSelector,
} from '../../redux/slices/ActivitiesSlice';
import { Activity, ActivityType, getEventType } from '../../types/types';
import { currentUserIdSelector } from '../../redux/slices/AuthSlice';
import { EventList } from '../../components/lists/EventList';
import { routes } from '../../navigation/routes';
import { RootState } from '../../redux/store';

const tabs = ['Info', 'Events', 'Contact'];

interface ActivityDetailsProps {
  route: any;
  navigation: any;
}

const ActivityDetails = ({ route, navigation }: ActivityDetailsProps) => {
  const {
    activityType,
    activityId,
  }: { activityType: ActivityType; activityId: number; navigation: any } =
    route.params;
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);
  const activity = useAppSelector((state: RootState) =>
    activityByIdSelector(state, activityType, activityId)
  );
  const userId = useAppSelector(currentUserIdSelector);
  const status = useAppSelector(activitiesStatusSelector);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'Info':
        return <Info item={activity} />;

      case 'Events':
        return (
          <EventList
            activityType={activityType}
            activityId={activity?.id}
            navigation={navigation}
            route={routes.EVENT_DETAILS}
          />
        );

      case 'Contact':
        return <></>;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : status === 'failed' ? (
        <Text>Something went wrong</Text>
      ) : (
        <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
          <ActivityHero
            name={activity?.name}
            location={activity?.location}
            venue={activity?.venue}
            startDate={activity?.start_date}
            endDate={activity?.end_date}
          />

          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          {displayTabContent()}
        </View>
      )}

      <ActivityFooter />
    </SafeAreaView>
  );
};

export default ActivityDetails;
