import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text} from 'react-native';
// import SignUpScreen from './src/component/SignUpScreen';
import LoginScreen from './src/component/LoginScreen';
import ChangePasswordScreen from './src/component/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;