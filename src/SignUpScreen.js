import React, { useState } from "react";
import { View, TextInput, Button, Alert } from 'react-native';

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleSignUp = () => {
        const djServer = 'http://127.0.0.1:8000/accounts/dj-rest-auth/registration/';

        fetch(djServer, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                password2: passwordConfirm, // Rename to password2 or passwordConfirm based on your Django model
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Alert.alert('회원가입 성공', '환영합니다!!');
            } else {
                Alert.alert('회원가입 실패', data.message);
            }
        })
        .catch(error => {
            console.error('API 요청 에러:', error);
        });
    };

    return (
        <View>
            <TextInput 
                placeholder="닉네임"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput 
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput 
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
            />
            <TextInput 
                placeholder="비밀번호 재확인"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
            />
            <Button title="가입하기" onPress={handleSignUp}></Button>
        </View>
    );
};

export default SignUpScreen;
