import React, {useEffect, useState} from 'react';
import {
  Modal,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const db = firestore();
const UserGroups = ({navigation}) => {
  const [groupData, setGroupData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
        setGroupData(temp);
      });
  }, [groupData]);
  const deleteGroup = async item => {
    console.log(item);
    const res = await db.collection('Groups').doc(item.id).delete();
    setModalVisible(!modalVisible);
  };
  return (
    <View style={styles.userGroupContainer}>
      <View>
        <View style={styles.headingContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <View>
              <Text style={styles.backBtnText}> Back </Text>
            </View>
          </Pressable>
          <View style={styles.heading}>
            <Text style={styles.headingText}>Manage User Groups</Text>
          </View>
        </View>

        {groupData.map(item => {
          return (
            <View style={styles.Itemwrapper} key={item.id}>
              <Pressable
                style={styles.groupContainer}
                onPress={() =>
                  navigation.navigate('CreateEditGroup', {
                    data: item,
                  })
                }>
                <Text>{item.groupName}</Text>
                <Text>{item.groupMembers.length}</Text>
              </Pressable>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      Are You sure you want to Delete?
                    </Text>
                    <View style={styles.modalBtnContainer}>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => deleteGroup(item)}>
                        <Text style={styles.textStyle}>Yes</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>No</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Image
                  style={styles.stretch}
                  source={require('../assets/delete.png')}
                />
              </Pressable>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.createGrpBtn}
        onPress={() => navigation.navigate('CreateEditGroup')}>
        <Text style={styles.BtnText}> Create New Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '55%',
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
  headingContainer: {
    flexDirection: 'row',
    backgroundColor: '#bdc3c7',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  Itemwrapper: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: '#dcdde1',
    borderBottomWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  heading: {
    padding: 20,
    flexDirection: 'row',
  },
  headingText: {
    fontWeight: 'bold',
  },
  createGrpBtn: {
    padding: 20,
    backgroundColor: '#00a8ff',
  },
  BtnText: {
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backBtnText: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userGroupContainer: {
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    margin: 20,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBtnContainer: {
    flexDirection: 'row',
  },
});
export default UserGroups;
