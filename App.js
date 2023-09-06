import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Button } from 'react-native';
// import {View, Text} from 'react-native';
import SignUpScreen from './src/component/SignUpScreen';
import LoginScreen from './src/component/LoginScreen';
import ChangePasswordScreen from './src/component/ChangePasswordScreen';
import LogoutScreen from './src/component/LogoutScreen';
import EditProfileScreen from './src/component/EditProfileScreen';
import ProfileImgScreen from './src/component/ProfileImgScreen';

import NormalPhoto from './src/component/NormalPhoto';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const checkAuthToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                setAuthToken(token);
            }
        };
        checkAuthToken();
    }, []);

    const handleLogin = async (token) => {
        await AsyncStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    const handleLogout = async() => {
        await AsyncStorage.removeItem('authToken');
        setAuthToken(null);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Signup" component={SignUpScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="ProfileImg" component={ProfileImgScreen} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                <Stack.Screen name="Logout" component={LogoutScreen} />

                <Stack.Screen name="NormalPhoto" component={NormalPhoto} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;