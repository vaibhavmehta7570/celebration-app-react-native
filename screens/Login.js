import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, Text, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import {createNewUser} from '../controller/newUserController';
import {useAppContext} from '../App.provider';

const Login: () => Node = ({navigation}) => {
  const appContext = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupSucessfull, setSignUpsucessfull] = useState(false);
  const [showInvalidUserError, setShowInvalidUserError] = useState(false);

  const disapperTostMessage = () => {
    setTimeout(() => {
      setSignUpsucessfull(false);
    }, 700);
  };
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('AdminHome');
      }
    });
    return unsubscribe;
  }, []);

  const addNewUser = data => {
    const {uid, email} = data?.user;
    console.log(uid, email);
    let newUser = {
      uid,
      email,
      isAdmin: false,
    };
    createNewUser(newUser);
  };

  const handelSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        console.log('User account created & signed in!', data.user.email);
        setEmail('');
        setPassword('');
        setSignUpsucessfull('true');
        disapperTostMessage();
        addNewUser(data);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const AuthenticateUser = async () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredentials => {
        const user = userCredentials.user;
        console.log(user, 'signedin sucessfully');
        appContext.handleUserIdChange(user?.uid);
        navigation.navigate('AdminHome', {
          user,
        });
      })
      .catch(err => {
        console.log('something went wrong', err);
        setShowInvalidUserError(true);
        setEmail('');
        setPassword('');
        disapperTostMessage();
      });
  };
  return (
    <View style={styles.container}>
      {signupSucessfull && (
        <View style={styles.primaryMessage}>
          <Text>! User Acount created sucessfully.</Text>
        </View>
      )}
      <View style={styles.EmailHeading}>
        <Text>Email</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <View style={styles.EmailHeading}>
        <Text>Password</Text>
      </View>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
      />

      {showInvalidUserError && (
        <View style={styles.error}>
          <Text>! Invalid Email or password please try again</Text>
        </View>
      )}
      <Pressable onPress={() => AuthenticateUser()} style={styles.btnBox}>
        <Text style={styles.btnText}>Login In</Text>
      </Pressable>
      <Pressable onPress={() => handelSignUp()} style={styles.btnBox}>
        <Text style={styles.btnText}>SignUp</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  btnText: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  btnBox: {
    paddingHorizontal: 10,
    backgroundColor: 'coral',
    paddingVertical: 10,
    borderRadius: 10,
    width: '90%',
    marginLeft: 10,
    marginTop: 20,
  },
  EmailHeading: {
    marginLeft: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%',
  },
  error: {
    padding: 5,
    paddingLeft: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '80%',
    marginLeft: 10,
  },
  primaryMessage: {
    padding: 5,
    paddingLeft: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    width: '70%',
    marginLeft: 10,
    color: '#ffff',
  },
});

export default Login;
