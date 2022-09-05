import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppContext} from '../App.provider';
const db = firestore();

const AdminHome = ({navigation, route}) => {
  const appContext = useAppContext();
  const [existingEvents, setExistingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  useEffect(() => {
    let existing_events = [];
    let past_events = [];
    db.collection('Users')
      .doc(appContext.user_Id)
      .get()
      .then(snap => {
        if (snap.data().isAdmin === true) {
          console.log('i am admin');
          db.collection('Events')
            .get()
            .then(snapshot => {
              snapshot.forEach(item => {
                if (item.data().date.toDate() > new Date()) {
                  existing_events.push(item.data());
                } else {
                  past_events.push(item.data());
                }
              });
              setExistingEvents(existing_events);
              setPastEvents(past_events);
            });
        } else {
          console.log('i am not admin');
          db.collection('Events')
            .get()
            .then(snapshot => {
              snapshot.forEach(item => {
                const groupData = item.data().selectedGroup;
                groupData.forEach(data => {
                  const groupId = data.id;
                  db.collection('Groups')
                    .doc(groupId)
                    .get()
                    .then(snapshot1 => {
                      snapshot1.data().groupMembers.forEach(user => {
                        if (user.id === appContext.user_Id) {
                          if (item.data().date.toDate() > new Date()) {
                            existing_events.push(item.data());
                          } else {
                            past_events.push(item.data());
                          }
                        }
                      });
                      setExistingEvents(existing_events);
                      setPastEvents(past_events);
                    });
                });
              });
            })
            .catch(e => {
              console.log('something went wrong', e);
            });
        }
      });
  }, []);
  const renderItems = item => {
    console.log('item', item);
    return (
      <TouchableOpacity
        style={styles.eventList}
        key={item.index}
        onPress={() =>
          navigation.navigate('CreateEditEvent', {
            data: item.item,
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
          <Pressable
            style={styles.createGrpBtn}
            onPress={() => navigation.navigate('UserGroups')}>
            <View>
              <Text style={{fontWeight: 'bold'}}> Manage Groups </Text>
            </View>
          </Pressable>
        </View>
        {existingEvents.length === 0 && (
          <View style={styles.noEvents}>
            <Text> No Existing Events</Text>
          </View>
        )}
        <FlatList
          data={existingEvents}
          renderItem={renderItems}
          style={styles.flatlist}
          keyExtractor={item => {
            return item.id;
          }}
        />
        <View style={styles.heading}>
          <Text style={styles.headingText}>Past Events</Text>
        </View>
        {pastEvents.length === 0 && (
          <View style={styles.noEvents}>
            <Text> No Past Events</Text>
          </View>
        )}
        <FlatList
          data={pastEvents}
          renderItem={renderItems}
          style={styles.flatlist}
          keyExtractor={item => {
            return item.id;
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
    backgroundColor: '#bdc3c7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noEvents: {
    margin: 10,
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
  createGrpBtn: {
    backgroundColor: '#dcdde1',
    width: 110,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    borderRadius: 5,
  },
});
export default AdminHome;
