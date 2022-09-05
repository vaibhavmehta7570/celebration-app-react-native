import firestore from '@react-native-firebase/firestore';

export const createNewGroup = (group, addComplete) => {
  firestore()
    .collection('Groups')
    .add(group)
    .then(snapshot => {
      group.id = snapshot.id;
      snapshot.set(group);
    })
    .then(() => {
      addComplete();
    })
    .catch(err => {
      console.log('something went wrong', err);
    });
};
