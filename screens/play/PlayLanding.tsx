import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
// import { TournamentCard } from './TournamentCard';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { COLORS, FONT, SIZES } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import icons from '../../theme/icons';
import { routes } from '../../navigation/routes';
import { shallowEqual } from 'react-redux';
import {
  allActivitiesSelector,
  allFiltersSelector,
  getActivitiesThunk,
} from '../../redux/slices/ActivitiesSlice';
import { Activity } from '../../types/types';
import { ActivityList } from '../../components/lists/ActivityList';

interface Props {
  navigation: any;
}

export function PlayLanding({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state: RootState) => state.activities.status);
  const activities = useAppSelector(allActivitiesSelector, shallowEqual);
  const filters = useAppSelector(allFiltersSelector, shallowEqual);
  const { selectedActivityTypes } = filters;
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(getActivitiesThunk());
  }, [dispatch]);

  const handleSearchInput = (text: any) => {
    setSearchText(text);
  };

  const filterActivities = (activityArray: Activity[], term: string) => {
    return activityArray.filter((activity) =>
      activity.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredResults = useMemo(() => {
    let filteredTournaments = [] as Activity[];
    let filteredLeagues = [] as Activity[];
    let filteredCamps = [] as Activity[];

    if (selectedActivityTypes.includes('tournaments'))
      filteredTournaments = filterActivities(
        activities.activities.tournaments,
        searchText
      );

    if (selectedActivityTypes.includes('leagues'))
      filteredLeagues = filterActivities(
        activities.activities.leagues,
        searchText
      );

    if (selectedActivityTypes.includes('camps'))
      filteredCamps = filterActivities(activities.activities.camps, searchText);

    return [
      ...filteredTournaments,
      ...filteredLeagues,
      ...filteredCamps,
    ] as Activity[];
  }, [activities, searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Searchbar
            placeholder="Search..."
            onChangeText={handleSearchInput}
            value={searchText}
          />
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate(routes.ACTIVITIES_FILTER)}
        >
          <Image
            source={icons.filter}
            resizeMode="contain"
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <ActivityList
          activities={filteredResults}
          navigation={navigation}
          route={routes.ACTIVITY_DETAILS}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  activity: {
    width: 250,
    padding: SIZES.xLarge,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: SIZES.large,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: SIZES.medium,
    height: '100%',
  },
  searchInput: {
    fontFamily: FONT.regular,
    width: '100%',
    height: '100%',
    paddingHorizontal: SIZES.medium,
  },
  searchBtn: {
    width: 50,
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnImage: {
    width: '50%',
    height: '50%',
    tintColor: COLORS.white,
  },
});
