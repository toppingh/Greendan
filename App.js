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

import BlightScreen from './src/component/BlightScreen';
import BlightDetailScreen from './src/component/BlightDetailScreen';

import TestPhoto from './src/component/TestPhoto';
import Camera from './src/component/Camera';
import Result from './src/component/Result';

import QnaScreen from './src/component/QnaScreen';
import UserQnaScreen from './src/component/UserQnaScreen';
import QnaDetailScreen from './src/component/QnaDetailScreen';
import InquiryStyle from './src/component/InquiryStyle';
import EditInquiry from './src/component/EditInquiry';

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

                <Stack.Screen name="TestPhoto" component={TestPhoto} />
                <Stack.Screen name="Camera" component={Camera} />

                <Stack.Screen name="Blight" component={BlightScreen} />
                <Stack.Screen name="BlightDetail" component={BlightDetailScreen} />
                <Stack.Screen name="Result" component={Result} />
            
                <Stack.Screen name="Qna" component={QnaScreen} />
                <Stack.Screen name="UserQna" component={UserQnaScreen} />
                <Stack.Screen name="QnaDetail" component={QnaDetailScreen} />
                <Stack.Screen name="InquiryStyle" component={InquiryStyle} options={({route}) => ({title: '문의 내역', headerBackTitleVisible: false, headerShwon: false,})} />
                <Stack.Screen name="EditInquiry" component={EditInquiry} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;