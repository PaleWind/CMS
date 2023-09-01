import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { activityTypeLabelMap } from '../../types/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectedActivityTypesSelector,
  setSelectedActivityTypes,
} from '../../redux/slices/ActivitiesSlice';
import { ActivityType } from '../../types/types';

interface Props {
  navigation: any;
}

export function ActivitiesFilter({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const selectedActivityTypes = useAppSelector(selectedActivityTypesSelector);

  const toggleCheckbox = (activityType: string) => {
    const newSelectedActivityTypes = selectedActivityTypes.includes(
      activityType
    )
      ? selectedActivityTypes.filter((type) => type !== activityType)
      : [...selectedActivityTypes, activityType];

    dispatch(setSelectedActivityTypes(newSelectedActivityTypes));
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkBoxWrapper}>
        <Text style={styles.title}>Types:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(activityTypeLabelMap).map((typeKey) => (
            <View key={typeKey} style={styles.checkBoxContainer}>
              <CheckBox
                title={
                  activityTypeLabelMap[
                    typeKey as keyof typeof activityTypeLabelMap
                  ]
                }
                checked={selectedActivityTypes.includes(typeKey)}
                onPress={() => toggleCheckbox(typeKey)}
                containerStyle={styles.checkBox}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  checkBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 10,
    marginRight: 10,
  },
});
