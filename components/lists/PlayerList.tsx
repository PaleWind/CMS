import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { shallowEqual } from 'react-redux';
import {
  getProfilesByIdThunk,
  profilesByIdSelector,
} from '../../redux/slices/PlayersSlice';
import { ProfileData } from '../../types/types';
import { COLORS, SHADOWS, SIZES } from '../../theme/theme';
import { routes } from '../../navigation/routes';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayerList = ({
  userIds,
  refresh,
  navigation,
  editing,
}: {
  userIds: string[];
  refresh: any;
  navigation: any;
  editing: boolean;
}) => {
  console.log('userIds: ', userIds);
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const profiles = useAppSelector(
    (state: RootState) => profilesByIdSelector(state, userIds),
    shallowEqual
  );

  useEffect(() => {
    if (userIds && (!profiles || userIds.length > profiles.length)) {
      dispatch(getProfilesByIdThunk({ userIds: userIds }));
    }
  }, [userIds, profiles, dispatch]);

  const onRefresh = useCallback(() => {
    console.log('refreshing');
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  }, []);

  const renderPlayerCard = ({ item }: { item: ProfileData }) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          navigation.navigate(routes.PLAYER_PROFILE, { userId: item?.id });
        }}
      >
        <Text>{item?.first_name}</Text>
        <Text>{item?.last_name}</Text>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.first_name} {item?.last_name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.info}></Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={profiles}
      renderItem={renderPlayerCard}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default PlayerList;

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
