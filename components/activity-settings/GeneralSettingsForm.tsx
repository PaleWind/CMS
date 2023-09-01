import { Button, StyleSheet, Text, View } from 'react-native';

import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { shallowEqual } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import {
  Activity,
  ILeague,
  ITournament,
  getActivityType,
} from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { currentUserSelector } from '../../redux/slices/AuthSlice';
import { supabase } from '../../client';
import { styles } from '../../theme/styles/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { upsertActivityThunk } from '../../redux/slices/director/DirectorActivitiesSlice';
import { COLORS, SIZES } from '../../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  activity: Activity;
}

export function GeneralSettingsForm({ activity }: Props) {
  const activityType = getActivityType(activity);
  if (!activityType) {
    return <Text>Nothing here</Text>;
  }
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(currentUserSelector, shallowEqual);

  const [name, setName] = useState(activity.name);
  const [venue, setVenue] = useState(activity.venue);
  const [startDate, setStartDate] = useState(new Date(activity.start_date));
  const [endDate, setEndDate] = useState(new Date(activity.end_date));
  const [description, setDescription] = useState('');

  //tournament specific fields
  const [level, setLevel] = useState('');

  const [errors, setErrors] = useState({} as any);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (
      activityType === 'tournaments' &&
      'tournament_description' in activity
    ) {
      activity = activity as ITournament;
      setLevel(activity.level?.toString());
      setDescription(activity.tournament_description);
    } else if (activityType === 'leagues' && 'league_description' in activity) {
      activity = activity as ILeague;
      setDescription(activity.league_description);
    }
  }, [activityType, activity]);

  const handleUpdateActivity = async () => {
    const commonData = {
      id: activity.id,
      owner_id: currentUser?.id,
      name: name,
      venue: venue,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };

    let specificData = {};

    if (activityType === 'tournaments') {
      specificData = {
        tournament_description: description,
        level: level,
      };
    } else if (activityType === 'leagues') {
      specificData = {
        league_description: description,
      };
    } else if (activityType === 'camps') {
      // Set fields specific to camps
    }

    const activityData = {
      ...commonData,
      ...specificData,
    };

    dispatch(upsertActivityThunk({ activity: activityData, activityType }));
  };

  async function uploadPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.type === 'success') {
      const fileUri = result.uri;
      const fileName = result.name;

      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { error } = await supabase.storage
        .from('event-blanks')
        .upload(`pdfs/${activity?.name}${activity?.id}.pdf`, content, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) {
        console.error('Error uploading file:', error.message);
      } else {
        console.log('File uploaded successfully');
      }
    }
  }

  const handleViewPdf = async () => {
    listFiles();
    const url = await fetchPdfUrl('entry-blank-sample');
    if (url) {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  async function listFiles() {
    const { data, error } = await supabase.storage
      .from('entry-blanks')
      .list('pdfs', {
        limit: 100,
        offset: 0,
      });
    if (error) {
      console.error('Error listing files:', error.message);
      return null;
    }
    console.log('fules: ', data);
    return data;
  }

  async function fetchPdfUrl(fileName: string) {
    try {
      const { data } = supabase.storage
        .from('entry-blanks')
        .getPublicUrl('pdfs/entry-blank-sample.pdf');
      // .getPublicUrl(`${fileName}.pdf`);
      console.log('url: ', data);
      return data?.publicUrl;
    } catch (error) {
      console.error('Error fetching file URL:', error);
    }
  }

  return (
    <ScrollView>
      <View style={style.container}>
        {errors.name && <Text style={styles.inputError}>{errors.name}</Text>}
        <Text style={styles.label}>Name: </Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        {errors.venue && <Text style={styles.inputError}>{errors.venue}</Text>}
        <Text style={styles.label}>Venue: </Text>
        <TextInput
          style={[styles.input, errors.venue && styles.inputError]}
          value={venue}
          onChangeText={(text) => setVenue(text)}
        />
        {errors.description && (
          <Text style={styles.inputError}>{errors.description}</Text>
        )}
        <Text style={styles.label}>Description: </Text>
        <TextInput
          style={[styles.input, errors.description && styles.inputError]}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        {activityType === 'tournaments' ? (
          <>
            <Text style={styles.label}>Level:</Text>
            <TextInput
              style={styles.input}
              value={level}
              onChangeText={setLevel}
            />
          </>
        ) : activityType === 'leagues' ? (
          <>{/* fields specific to leagues */}</>
        ) : activityType === 'camps' ? (
          <>{/* fields specific to camps */}</>
        ) : (
          <></>
        )}
        {errors.startDate && (
          <Text style={styles.inputError}>{errors.startDate}</Text>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Start date:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.dateText}>
              {startDate?.toLocaleDateString()}
            </Text>
            <Icon
              name="calendar"
              size={30}
              color="#000"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}
        {errors.endDate && (
          <Text style={styles.inputError}>{errors.endDate}</Text>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>End date:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.dateText}>{endDate?.toLocaleDateString()}</Text>
            <Icon
              name="calendar"
              size={30}
              color="#000"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Entry Blank:</Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewPdf}
          >
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => uploadPdf()}
          >
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleUpdateActivity}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'flex-start',
    // flex: 1,
    marginTop: SIZES.large,
    backgroundColor: '#FFF',
    borderRadius: SIZES.medium,
    // padding: SIZES.medium,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: 'grey',
  },
});
