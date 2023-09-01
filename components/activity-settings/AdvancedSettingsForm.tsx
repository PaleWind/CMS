import React from 'react';
import { Text } from 'react-native-paper';
// import { useAppDispatch, deleteTournamentThunk } from '@pongportal/redux';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Activity, getActivityType } from '../../types/types';
import { useAppDispatch } from '../../redux/hooks';
import { styles } from '../../theme/styles/styles';

import { routes } from '../../navigation/routes';
import { deleteActivityThunk } from '../../redux/slices/director/DirectorActivitiesSlice';

type props = {
  activity: Activity;
  navigateHome: any;
};

const AdvancedSettingsForm = ({ activity, navigateHome }: props) => {
  if (!activity?.id) {
    navigateHome();
    return <Text>Nothing Here...</Text>;
  }
  const activityType = activity && getActivityType(activity);

  const dispatch = useAppDispatch();

  const handleDeleteTournament = () => {
    activityType &&
      dispatch(deleteActivityThunk({ activityId: activity?.id, activityType }));
    navigateHome();
  };

  return (
    <View>
      <Text>Advanced Settings</Text>
      <TouchableOpacity
        onPress={handleDeleteTournament}
        style={styles.primaryButton}
      >
        <Text style={styles.buttonText}>Delete {activity?.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdvancedSettingsForm;
