import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkzNDcyNDU3LCJpYXQiOjE2OTM0NjUyNTcsImp0aSI6ImExZjBmY2UxY2Q3OTQyNzU4MjJhYzMyZTg0YzY1ZjA2IiwidXNlcl9pZCI6MTJ9.Affpgfup9GIhbIxuzel61HXvK3Vusjk0YyUS69t7xl8";

    const handleLogin = async () => {
        try {
            const djServer = await axios.post(
                'http://192.168.35.29:8000/accounts/dj-rest-auth/login/',
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (djServer.status === 200) {
                Alert.alert('로그인 성공!!');
                navigation.navigate('ChangePassword', {email, token});

            } else {
                console.error('API 요청 실패:', djServer.data);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="로그인" onPress={handleLogin} />
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

export default LoginScreen;
