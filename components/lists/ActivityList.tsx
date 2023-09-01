import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ActivityCard } from '../cards/ActivityCard';
import { Activity, getActivityType } from '../../types/types';
import { routes } from '../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getActivitiesThunk,
  activitiesStatusSelector,
} from '../../redux/slices/ActivitiesSlice';

import {
  getMyActivitiesThunk,
  myActivitiesStatusSelector,
} from '../../redux/slices/director/DirectorActivitiesSlice';

export const ActivityList = ({
  activities,
  navigation,
  route,
}: {
  activities: Activity[];
  navigation: any;
  route: any;
}) => {
  const dispatch = useAppDispatch();
  let status = useAppSelector(
    route === routes.MANAGE_ACTIVITY_DRAWER
      ? myActivitiesStatusSelector
      : activitiesStatusSelector
  );
  const onRefresh = () => {
    dispatch(
      route === routes.MANAGE_ACTIVITY_DRAWER
        ? getMyActivitiesThunk()
        : getActivitiesThunk()
    );
  };

  const renderActivityCard = ({ item }: { item: Activity }) => {
    return (
      <ActivityCard
        activity={item}
        handleNavigate={() => {
          navigation.navigate(route, {
            activityType: getActivityType(item),
            activityId: item?.id,
          });
        }}
      />
    );
  };

  return (
    <FlatList
      data={activities}
      renderItem={renderActivityCard}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl
          refreshing={status === 'loading'}
          onRefresh={onRefresh}
        />
      }
    />
  );
};
