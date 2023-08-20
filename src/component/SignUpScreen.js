import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSignUp = async () => {
        const djServer = 'http://172.30.1.3:8000/accounts/dj-rest-auth/registration/';

        try {
            const response = await fetch(djServer, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    username:username,
                    email: email,
                    password1: password1,
                    password2: password2,
                }),
            });

            const data = await response.json();
            Alert.alert('회원가입 성공!!');
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
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default SignUpScreen;
