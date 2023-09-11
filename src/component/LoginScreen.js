import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    
    const navigation = useNavigation();

    useEffect(() => {
        const getToken = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('authToken');
                console.log(`accessToken 출력 : ${accessToken}`);
                if (accessToken !== null) {
                    console.log('토큰을 성공적으로 가져옴', accessToken);
                    setToken(accessToken);
                } else {
                    console.error('authToken이 없음!');
                }
            } catch (error) {
                console.error('토큰 에러: ', error);
            }
        };
        getToken();
    }, []);

    const handleLogin = async () => {
        try {
            const csrfResponse = await fetch('http://192.168.35.29:8000/accounts/get-csrf-token/');
            const csrfToken = await csrfResponse.json();

            const headers = new Headers({
                'Content-Type': 'application/json',
                // 'X-CSRFToken': csrfToken.csrf_token,
                'Authorization': `Bearer ${token}`,
            });
            console.log(`headers 정보: ${headers}`);

            const response = await fetch('http://192.168.35.29:8000/accounts/dj-rest-auth/login/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            console.log(`response정보 : ${response}`);

            if (response.status === 200) {
                const responseData = await response.json();
                const accessToken = responseData.access;
                const pk = responseData.user.pk;

                if (accessToken) {
                    // onLogin(token);
                    await AsyncStorage.setItem('authToken', accessToken);
                    console.log('로그인 화면에서 토큰:', token, pk, email);
                    Alert.alert('로그인 성공!');
                    navigation.navigate('UserQna', {token:accessToken, pk, email});
                } else {
                    Alert.alert('로그인 실패');
                    console.log(`로그인 토큰 : ${token}`);
                    // console.log(token);
                }
            } else {
                Alert.alert('로그인 실패');
            }
        } catch (error) {
            console.error('api 요청 실패 : ', error);
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