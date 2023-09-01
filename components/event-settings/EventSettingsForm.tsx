import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Event,
  EventType,
  ILeagueEvent,
  ITournamentEvent,
  getEventType,
} from '../../types/types';
import { styles } from '../../theme/styles/styles';
import { useAppDispatch } from '../../redux/hooks';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  deleteEventThunk,
  updateEventThunk,
} from '../../redux/slices/director/DirectorEventsSlice';

type Props = {
  eventType: EventType;
  activityId: number;
  event: Event;
};

export const EventSettingsForm = ({ activityId, eventType, event }: Props) => {
  if (!event) return null;
  const dispatch = useAppDispatch();
  const [name, setName] = useState(event?.name);
  const [price, setPrice] = useState(event?.price?.toString());
  const [maxPlayers, setMaxPlayers] = useState(event?.max_players?.toString());
  const [startDate, setStartDate] = useState(new Date(event.start_date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  //tournament specific fields
  const [format, setFormat] = useState('');

  //league specific fields
  const [clubId, setClubId] = useState('');

  useEffect(() => {
    if (eventType === 'tournament_events' && 'tournament_id' in event) {
      event = event as ITournamentEvent;
      setFormat(event.format?.toString()); //assuming level is related to tournament_id
    } else if (eventType === 'league_events' && 'league_id' in event) {
      event = event as ILeagueEvent;
      // setClubId(event.league_id.toString()); //assuming level is related to tournament_id
    }
  }, [eventType, event]);

  const handleUpdateEvent = async () => {
    dispatch(
      updateEventThunk({
        activityId: activityId,
        event: {
          ...event,
          name,
          price: Number(price),
          max_players: Number(maxPlayers),
          start_date: startDate,
          ...(format && { format: Number(format) }), // include format only if it's defined
        },
      })
    );
  };

  const handleDeleteEvent = async () => {
    dispatch(
      deleteEventThunk({
        eventType,
        activityId,
        eventId: event.id,
      })
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text>Price:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPrice}
          value={price}
          keyboardType="numeric"
        />

        <Text>Max players:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setMaxPlayers}
          value={maxPlayers}
          keyboardType="numeric"
        />

        <Text>Format:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFormat}
          value={format}
          keyboardType="numeric"
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}
        >
          <Text style={styles.label}>Start Date:</Text>
          <View style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
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
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleUpdateEvent}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteEvent} style={styles.redButton}>
          <Text style={styles.buttonText}>Delete Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
