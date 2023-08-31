import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';

const ChangePasswordScreen = () => {
    const [new_password1, setNewPassword1] = useState('');
    const [new_password2, setNewPassword2] = useState('');

    const route = useRoute();
    const {email, token} = route.params;
    const navigation = useNavigation();

    const handleChangePassword = async () => {
        try {
            if (new_password1 !== new_password2) {
                Alert.alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            const djServer = await axios.post(
                'http://192.168.35.29:8000/accounts/dj-rest-auth/password/change/', // Django 서버의 비밀번호 변경 엔드포인트로 변경
                {
                    new_password1,
                    new_password2,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            if (djServer.status === 200) {
                Alert.alert('비밀번호 변경 성공');
                navigation.navigate('Logout', {email, token});
            } else {
                console.error('API 요청 실패:', djServer.data);
            }
        } catch (error) {
            console.error('API 요청 오류:', error);
            console.error('토큰 값:', token);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="새 비밀번호"
                value={new_password1}
                onChangeText={setNewPassword1}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                placeholder="새 비밀번호 확인"
                value={new_password2}
                onChangeText={setNewPassword2}
                secureTextEntry
                style={styles.input}
            />
            <Button title="비밀번호 변경" onPress={handleChangePassword} />
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

export default ChangePasswordScreen;
