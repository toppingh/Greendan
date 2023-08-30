import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkzNDIwMDY0LCJpYXQiOjE2OTM0MTI4MzEsImp0aSI6ImMxOWJiZjA1NGI1YjQwNmQ4MjExMGU2ZGUwNmFlMWIxIiwidXNlcl9pZCI6MTJ9.sloHL72HrPci3N01FYm91pAiba_7pUfZCvt_XEmbwd4';

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://192.168.35.29:8000/accounts/dj-rest-auth/login/',
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Alert.alert('로그인 성공!!');
                navigation.navigate('ChangePassword', {email, token});

            } else {
                console.error('API 요청 실패:', response.data);
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
