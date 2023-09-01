import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { currentUserSelector } from '../../redux/slices/AuthSlice';
import { upsertActivityThunk } from '../../redux/slices/director/DirectorActivitiesSlice';

interface Props {
  isVisible: boolean;
  onClose: any;
}

export const CreateActivityModal = ({ isVisible, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [activityType, setActivityType] = useState(
    'tournaments' as keyof typeof labelMap
  );
  const currentUser = useAppSelector(currentUserSelector, shallowEqual);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  //tournament specific fields
  const [level, setLevel] = useState('');

  const labelMap = {
    tournaments: 'Tournament',
    leagues: 'League',
    camps: 'Camp',
  };

  const handleSubmit = async () => {
    // console.log('userid: ', currentUser?.id);
    const commonData = {
      owner_id: currentUser?.id,
      name: name,
      location: location,
      venue: venue,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };

    let specificData = {};

    if (activityType === 'tournaments') {
      specificData = {
        level: level,
      };
    } else if (activityType === 'leagues') {
      // Set fields specific to leagues
    } else if (activityType === 'camps') {
      // Set fields specific to camps
    }

    const activityData = {
      ...commonData,
      ...specificData,
    };

    dispatch(
      upsertActivityThunk({
        activity: activityData,
        activityType: activityType,
      })
    ).then(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Checkout Modal</Text>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
              >
                <ScrollView>
                  <View>
                    <Picker
                      selectedValue={activityType}
                      onValueChange={(itemValue, itemIndex) =>
                        setActivityType(itemValue)
                      }
                    >
                      <Picker.Item
                        label={labelMap['tournaments']}
                        value="tournaments"
                      />
                      <Picker.Item
                        label={labelMap['leagues']}
                        value="leagues"
                      />
                      <Picker.Item label={labelMap['camps']} value="camps" />
                    </Picker>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                    />

                    <Text style={styles.label}>Address</Text>
                    <TextInput
                      style={styles.input}
                      value={location}
                      onChangeText={setLocation}
                    />

                    <Text style={styles.label}>Venue name:</Text>
                    <TextInput
                      style={styles.input}
                      value={venue}
                      onChangeText={setVenue}
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

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}
                    >
                      <View style={styles.row}>
                        <Text style={styles.label}>Start Date:</Text>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
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

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}
                    >
                      <View style={styles.row}>
                        <Text style={styles.label}>End Date:</Text>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Text style={styles.dateText}>
                            {endDate.toLocaleDateString()}
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
                              setEndDate(selectedDate);
                            }
                          }}
                        />
                      )}
                    </View>

                    <Button
                      title={`Create ${labelMap[activityType]}`}
                      onPress={handleSubmit}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    height: '80%',
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // You can set a specific width if needed
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  dateText: {
    marginBottom: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
