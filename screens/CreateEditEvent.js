import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

const CreateEditEvent = ({route, navigation}) => {
  const {data} = route.params || {};
  const [description, setDescription] = useState(data?.item.description || '');
  const [upi, setUpi] = useState(data?.item.upiId || '');
  const [title, setTitle] = useState(data?.item.eventName || '');
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const createEvent = () => {
    let newEvent = {
      eventName: title,
      description: description,
      eventOpen: true,
      upiId: '1234567890@upi',
      date: date,
    };
  };
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View>
            <Text> Back </Text>
          </View>
        </Pressable>
        <Text style={styles.headingText}>
          {data?.item.eventID ? 'Edit Event' : 'Create Event'}
        </Text>
      </View>
      <View>
        <View>
          <View>
            <Text style={styles.subTittles}>Event Title</Text>
          </View>
          <TextInput
            style={[styles.descriptionInput, styles.upiInput]}
            multiline={true}
            numberOfLines={1}
            onChangeText={text => {
              setTitle(text);
            }}
            placeholder="Type Event Title"
            placeholderTextColor="grey"
            value={title}
          />
        </View>
        <View>
          <Text style={styles.subTittles}>Description</Text>
        </View>
        <TextInput
          style={styles.descriptionInput}
          multiline={true}
          numberOfLines={4}
          onChangeText={text => {
            setDescription(text);
          }}
          placeholder="Type Description of the event"
          placeholderTextColor="grey"
          value={description}
        />
      </View>
      <View>
        <View>
          <Text style={styles.subTittles}>UPI ID</Text>
        </View>
        <TextInput
          style={[styles.descriptionInput, styles.upiInput]}
          multiline={true}
          numberOfLines={1}
          onChangeText={text => {
            setUpi(text);
          }}
          placeholder="Type UPI ID"
          placeholderTextColor="grey"
          value={upi}
        />
      </View>

      <View>
        <View>
          <Text style={styles.subTittles}>Last Date to submit Event</Text>
        </View>
        <View style={styles.dateContainer}>
          <Pressable
            style={styles.dateBtn}
            onPress={() => setOpenDatePicker(true)}>
            <Text style={styles.BtnText}>Select the Date</Text>
          </Pressable>
          <Text style={styles.subTittles}>
            {date.toLocaleString('en-GB', {timeZone: 'UTC'})}
          </Text>
        </View>
        <DatePicker
          modal
          open={openDatePicker}
          date={date}
          value={date}
          onConfirm={date => {
            setOpenDatePicker(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
          style={styles.dateBtn}
        />
      </View>
      <Pressable
        style={styles.EventBtn}
        onPress={() => {
          data?.item.eventID ? createEvent() : () => {};
        }}>
        <View>
          <Text style={styles.BtnText}>
            {data?.item.eventID ? 'Edit Event' : 'Create Event'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#bdc3c7',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#dcdde1',
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    borderRadius: 5,
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    height: 150,
  },
  upiInput: {
    height: 50,
  },
  subTittles: {
    margin: 10,
    fontWeight: 'bold',
  },
  EventBtn: {
    padding: 20,
    backgroundColor: '#00a8ff',
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  BtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateBtn: {
    marginTop: 10,
    backgroundColor: '#00a8ff',
    padding: 15,
    width: 130,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
export default CreateEditEvent;
