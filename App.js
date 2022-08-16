/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/Login';
import AdminHome from './screens/AdminHome';
import CreateEditEvent from './screens/CreateEditEvent';

const Stack = createNativeStackNavigator();
const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="CreateEditEvent" component={CreateEditEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
