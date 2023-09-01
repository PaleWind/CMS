import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppSelector } from '../../redux/hooks';

import { useAppDispatch } from '../../redux/hooks';
import { currentUserSelector } from '../../redux/slices/AuthSlice';
import { styles } from '../../theme/styles/styles';

import { CreateActivityModal } from './CreateActivityModal';
import { shallowEqual } from 'react-redux';
import { routes } from '../../navigation/routes';
import { ActivityType, getActivityType } from '../../types/types';
import { ActivityList } from '../../components/lists/ActivityList';
import {
  getMyActivitiesThunk,
  myActivitiesListSelector,
} from '../../redux/slices/director/DirectorActivitiesSlice';

interface Props {
  route: any;
  navigation: any;
}

const screenWidth = Dimensions.get('window').width;
const numColumns = screenWidth >= 768 ? 2 : 1;

export function DirectLanding({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const [isCreateActivityModalVisible, setCreateActivityModalVisible] =
    useState(false);

  const user = useAppSelector(currentUserSelector, shallowEqual);
  const myActivitiesList = useAppSelector(
    myActivitiesListSelector,
    shallowEqual
  )?.myActivitiesList;

  const openCreateActivityModal = () => {
    setCreateActivityModalVisible(true);
  };

  const closeCreateActivityModal = () => {
    setCreateActivityModalVisible(false);
  };

  // useEffect(() => {
  //   if (user && !Object.keys(myActivitiesList).length)
  //     dispatch(getMyActivitiesThunk());
  // }, [user]);

  return (
    <View style={style.container}>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={openCreateActivityModal}
      >
        <Text style={styles.buttonText}>Create an Activity</Text>
        <CreateActivityModal
          isVisible={isCreateActivityModalVisible}
          onClose={closeCreateActivityModal}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Your Activities</Text>

      <ActivityList
        activities={myActivitiesList}
        navigation={navigation}
        route={routes.MANAGE_ACTIVITY_DRAWER}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});
