import React from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {dummydata} from './utils';
const AdminHome = ({navigation}) => {
  const renderItems = item => {
    return (
      <TouchableOpacity
        style={styles.eventList}
        key={item.eventID}
        onPress={() =>
          navigation.navigate('CreateEditEvent', {
            data: item,
          })
        }>
        <View>
          <Text>{item.item.eventName}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const handelSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Login');
        console.log('user sucessfully signed out');
      })
      .catch(err => console.log(err));
  };
  return (
    <View style={{height: '100%', flex: 1, justifyContent: 'space-between'}}>
      <View>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Existing Events</Text>
        </View>

        <FlatList
          data={dummydata.existingEents}
          renderItem={renderItems}
          style={styles.flatlist}
          keyExtractor={item => {
            item.eventID;
          }}
        />
        <View style={styles.heading}>
          <Text style={styles.headingText}>Upcoming Events</Text>
        </View>
        <FlatList
          data={dummydata.completedEvents}
          renderItem={renderItems}
          style={styles.flatlist}
          keyExtractor={item => {
            item.eventID;
          }}
        />
      </View>
      <View>
        <Pressable
          style={styles.createEventBtn}
          onPress={() => {
            navigation.navigate('CreateEditEvent');
          }}>
          <View style={styles.btnBottom}>
            <Text style={styles.createBtnText}> Create New Event </Text>
          </View>
        </Pressable>
        <Pressable style={styles.logoutBtn} onPress={handelSignOut}>
          <View style={styles.btnBottom}>
            <Text style={styles.createBtnText}> Logout </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  heading: {
    padding: 10,
    backgroundColor: '#dcdde1',
  },
  eventList: {
    padding: 10,
    borderWidth: 1,
    margin: 1,
    borderRadius: 5,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  outerContainer: {
    flex: 1,
  },

  createEventBtn: {
    padding: 20,
    backgroundColor: '#00a8ff',
    width: '100%',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: '#c23616',
    padding: 20,
  },
  btnBottom: {
    alignItems: 'center',
  },
  createBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default AdminHome;
