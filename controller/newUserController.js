import firestore from '@react-native-firebase/firestore';

export const createNewUser = (user, addComplete) => {
  firestore()
    .collection('Users')
    .doc(user.uid)
    .set(user)
    .catch(err => {
      console.log('something went wrong', err);
    });
};
