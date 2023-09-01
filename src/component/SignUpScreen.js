import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const navigation = useNavigation();

    const handleSignUp = async () => {
        const djServer = 'http://192.168.1.13:8000/accounts/dj-rest-auth/registration/';

        try {
            if (password1 !== password2) {
                Alert.alert('비밀번호가 일치하지 않습니다.');
                return;
            }


            const csrfResponse = await axios.get('http://192.168.1.13:8000/accounts/get-csrf-token/');
            const csrfToken = csrfResponse.data.csrf_token;
            // console.error(csrfToken);

            const response = await axios.post(djServer, {
                    username: username,
                    email: email,
                    password1: password1,
                    password2: password2,
            }, 
            {
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
            });

            // console.error(response);

            if (response.status === 201) {
                const data = response.data;
                if (data.access) {
                    await AsyncStorage.setItem('authToken', data.access);
                    Alert.alert('회원가입 성공!!');
                    navigation.navigate('Login');
                } else {
                    console.error('토큰 없음');
                }
            } else {
                const errorData = response.data;
                if (errorData) {
                    const errorMessage = errorData.non_field_errors ? errorData.non_field_errors[0] : '회원가입 실패';
                    Alert.alert('오류 : ' + errorMessage);
                }
            }
        } catch (error) {
            console.error('API 요청 에러 : ', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                placeholder="닉네임"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput 
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput 
                style={styles.input}
                placeholder="비밀번호"
                value={password1}
                onChangeText={setPassword1}
                secureTextEntry={true}
            />
            <TextInput 
                style={styles.input}
                placeholder="비밀번호 재확인"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry={true}
            />
            <Button title="가입하기" onPress={handleSignUp}></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default SignUpScreen;
