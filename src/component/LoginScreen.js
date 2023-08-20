import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);

    const handleLogin = async () => {
        try{
            const response = await fetch ('http://172.30.1.3:8000/accounts/dj-rest-auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();
            Alert.alert('로그인 성공!!');
            
        } catch (error) {
            console.error('API 요청 data : ', JSON.stringify(data, null, 2));
            // console.error(`에러 발생 : ${error}`);
        }
    };

return (
    <View style={styles.container}>
        {isLoggedIn ? (
            <Text>환영합니다!</Text>
        ) : (
            <View>
                <TextInput
                    placeholder='이메일'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput 
                    placeholder='비밀번호'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}    
                />
                <Button title='로그인' onPress={handleLogin} />
            </View>
        )}
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

export default LoginScreen;
