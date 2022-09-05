import React, {useState, useEffect} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';
import firestore from '@react-native-firebase/firestore';

import DatePicker from 'react-native-date-picker';
import {createNewEvent} from '../controller/eventController';
const db = firestore();

const CreateEditEvent = ({route, navigation}) => {
  const [GroupNames, setGroupNames] = useState([]);
  useEffect(() => {
    let temp = [];
    db.collection('Groups')
      .get()
      .then(snapshot => {
        snapshot.forEach(item => {
          temp.push(item.data());
        });
      })
      .then(() => {
        temp = temp.map(item => {
          return {item: item?.groupName, id: item?.id};
        });
        setGroupNames(temp);
      });
  }, []);
  const {data} = route.params || {};
  console.log('===', data);
  const [description, setDescription] = useState(data?.description || '');
  const [upi, setUpi] = useState(data?.upiId || '');
  const [title, setTitle] = useState(data?.eventName || '');
  const [date, setDate] = useState(data.date.toDate() || new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedGroup, setselectedGroup] = useState([]);

  function onMultiChange() {
    return item => setselectedGroup(xorBy(selectedGroup, [item], 'id'));
  }
  const createEvent = () => {
    let newEvent = {
      eventName: title,
      description: description,
      eventOpen: true,
      upiId: upi,
      date: date,
      selectedGroup,
    };
    createNewEvent(newEvent, addComplete);
  };
  const addComplete = () => {
    navigation.navigate('AdminHome');
  };

  return (
    <ScrollView>
      <View style={styles.heading}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View>
            <Text style={{fontWeight: 'bold'}}> Back </Text>
          </View>
        </Pressable>
        <Text style={styles.headingText}>
          {data?.id ? 'Edit Event' : 'Create Event'}
        </Text>
      </View>
      <View>
        <View>
          <Text style={styles.subTittles}>Select Group/s</Text>
        </View>
        <SafeAreaView style={{flex: 1, margin: 10}}>
          <SelectBox
            label="Select Email ID's"
            options={GroupNames}
            selectedValues={selectedGroup}
            onMultiSelect={onMultiChange()}
            onTapClose={onMultiChange()}
            isMulti
          />
        </SafeAreaView>
      </View>
      <View>
        <View>
          <Text style={styles.subTittles}>Event Title</Text>
        </View>
        <TextInput
          style={[styles.descriptionInput, styles.upiInput, styles.input]}
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
        style={[styles.descriptionInput, styles.input]}
        multiline={true}
        numberOfLines={4}
        onChangeText={text => {
          setDescription(text);
        }}
        placeholder="Type Description of the event"
        placeholderTextColor="grey"
        value={description}
      />
      <View>
        <View>
          <Text style={styles.subTittles}>UPI ID</Text>
        </View>
        <TextInput
          style={[styles.descriptionInput, styles.upiInput, styles.input]}
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

      <TouchableOpacity
        style={styles.EventBtn}
        onPress={() => {
          data?.id ? editEvent() : createEvent();
        }}>
        <View>
          <Text style={styles.BtnText}>
            {data?.id ? 'Edit Event' : 'Create Event'}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
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
  dropdown: {
    margin: 10,
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  descriptionInput: {
    margin: 10,
    height: 50,
  },
  upiInput: {
    height: 50,
  },
  subTittles: {
    margin: 10,
    fontWeight: 'bold',
  },
  input: {
    borderBottomColor: '#dcdde1',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginVertical: 20,
  },
  EventBtn: {
    padding: 10,
    height: 50,
    backgroundColor: '#00a8ff',
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 10,
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
