import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const getToken = async() => {
            try {
                const accessToken = await AsyncStorage.getItem('authToken');
                if (accessToken !== null) {
                    setToken(accessToken);
                }
            } catch (error) {
                console.error('토큰 에러 : ', error);
            }
        };
        getToken();
    }, []);

    const handleLogin = async () => {
        try {
            const djServer = await axios.post(
                'http://192.168.1.13:8000/accounts/dj-rest-auth/login/',
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
                const serverToken = djServer.data.access;
                console.error(serverToken); // 서버 토큰 확인용
                console.error(token); // 로그인용 토큰
                if (token === serverToken) {
                    navigation.navigate('EditProfile');
                }

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
