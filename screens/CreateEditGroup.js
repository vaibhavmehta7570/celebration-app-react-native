import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';
import {createNewGroup} from '../controller/newGroupController';

const db = firestore();

const CreateEditGroup = ({navigation, route}) => {
  const [allUsers, setAllusers] = useState('');
  const [selectedGroup, setselectedGroup] = useState(
    route?.params?.data?.groupMembers || [],
  );
  const [groupName, setGroupName] = useState(
    route?.params?.data?.groupName || '',
  );
  const MakeNewGroup = () => {
    let group = {
      groupName,
      groupMembers: selectedGroup,
    };
    createNewGroup(group, addComplete);
  };
  const addComplete = () => {
    navigation.navigate('UserGroups');
  };
  useEffect(() => {
    let temp = [];
    db.collection('Users')
      .get()
      .then(snapshot => {
        snapshot.forEach(item => {
          temp.push(item.data());
        });
      })
      .then(() => {
        temp = temp.map(item => {
          return {
            item: item.email,
            id: item.uid,
          };
        });
        setAllusers(temp);
      });
  }, []);

  function onMultiChange() {
    return item => setselectedGroup(xorBy(selectedGroup, [item], 'id'));
  }
  return (
    <View style={styles.userGroupContainer}>
      <View style={styles.headingContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View>
            <Text style={styles.backBtnText}> Back </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.selectDropDown}>
        <TextInput
          style={styles.input}
          onChangeText={text => setGroupName(text)}
          placeholder="Type Group Name"
          placeholderTextColor="grey"
          value={groupName}
        />
        {allUsers.length > 0 && (
          <SelectBox
            label="Select Email ID's"
            options={allUsers}
            selectedValues={selectedGroup}
            onMultiSelect={onMultiChange()}
            onTapClose={onMultiChange()}
            isMulti
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.createGrpBtn}
        onPress={() => {
          MakeNewGroup();
        }}>
        <Text style={styles.BtnText}> Done</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderBottomColor: '#dcdde1',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginVertical: 20,
  },
  selectDropDown: {
    margin: 10,
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
  backBtnText: {
    fontWeight: 'bold',
  },
  headingContainer: {
    flexDirection: 'row',
    backgroundColor: '#bdc3c7',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  heading: {
    padding: 20,
    flexDirection: 'row',
  },
  BtnText: {
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userGroupContainer: {
    height: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  createGrpBtn: {
    padding: 20,
    backgroundColor: '#00a8ff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
export default CreateEditGroup;
