import firestore from '@react-native-firebase/firestore';

export const createNewEvent = (event, addComplete) => {
  firestore()
    .collection('Events')
    .add(event)
    .then(snapshot => {
      console.log(snapshot);
      event.id = snapshot.id;
      snapshot.set(event);
    })
    .then(() => {
      addComplete();
    })
    .catch(err => {
      console.log('something went wrong', err);
    });
};
