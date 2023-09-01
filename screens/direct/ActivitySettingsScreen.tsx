import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { GeneralSettingsForm } from '../../components/activity-settings/GeneralSettingsForm';
import AdvancedSettingsForm from '../../components/activity-settings/AdvancedSettingsForm';
import { useAppSelector } from '../../redux/hooks';

import { styles } from '../../theme/styles/styles';
import { Activity, ActivityType } from '../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../theme/theme';
import { ActivityIndicator } from 'react-native-paper';
import { Tabs } from '../../components/theme/Tabs';
import { ActivityHero } from '../../components/activity-details/ActivityHero';
import { activitiesStatusSelector } from '../../redux/slices/ActivitiesSlice';
import { routes } from '../../navigation/routes';
import { footerStyles } from '../../theme/styles/footer';
import { TouchableOpacity } from 'react-native';
import { RootState } from '../../redux/store';
import { myActivityByIdSelector } from '../../redux/slices/director/DirectorActivitiesSlice';
import { shallowEqual } from 'react-redux';

const tabs = ['General', 'Contact', 'Advanced'];

interface Props {
  route: any;
  navigation: any;
}

export function ActivitySettingsScreen({ route, navigation }: Props) {
  console.log('hi from ActivitySettingsScreen: ', route.params);
  const {
    activityType,
    activityId,
  }: { activityType: ActivityType; activityId: number } = route?.params;
  const activity = useAppSelector(
    (state: RootState) =>
      myActivityByIdSelector(state, activityType, activityId),
    shallowEqual
  );
  const status = useAppSelector(activitiesStatusSelector);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {}, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralSettingsForm activity={activity} />;

      case 'Contact':
        return (
          <View style={styles.tabContent}>
            <Text>hey</Text>
          </View>
        );

      case 'Advanced':
        return (
          <AdvancedSettingsForm
            activity={activity}
            navigateHome={() => {
              navigation.navigate(routes.DIRECT_LANDING);
            }}
          />
        );

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
        <View
          style={{
            padding: SIZES.medium,
            paddingBottom: 130,
          }}
        >
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
    </SafeAreaView>
  );
}
