import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const csrfResponse = await fetch('http://172.30.1.7:8000/accounts/get-csrf-token/');
            const csrfToken = await csrfResponse.json();

            const headers = new Headers({
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken.csrf_token,
            });

            const response = await fetch('http://172.30.1.7:8000/accounts/dj-rest-auth/login/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            // console.log(response);

            if (response.status === 200) {
                const data = await response.json();
                // const token = data.key;

                if (data.token) {
                    await AsyncStorage.setItem('authToken', data.token);
                    console.log('로그인 화면에서 토큰:', data.token);
                    Alert.alert('로그인 성공!');
                    navigation.navigate('ProfileImg');
                } else {
                    Alert.alert('로그인 실패');
                    console.log(`로그인 토큰 : ${data}`);
                    // console.log(token);
                }
            } else {
                Alert.alert('로그인 실패');
                console.error('HTTP 오류: ', response.status);
            }
        } catch (error) {
            console.error('로그인 오류 : ', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput 
            placeholder="아이디"
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
        color: 'black',
    },
});

export default LoginScreen;