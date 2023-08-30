import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';

const ChangePasswordScreen = () => {
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    const route = useRoute();
    const {email, token} = route.params;

    const handleChangePassword = async () => {
        try {
            if (newPassword1 !== newPassword2) {
                Alert.alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            const response = await axios.post(
                'http://192.168.35.29:8000/accounts/dj-rest-auth/password/change/', // Django 서버의 비밀번호 변경 엔드포인트로 변경
                {
                    newPassword1,
                    newPassword2,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Alert.alert('비밀번호 변경 성공');
                // 비밀번호 변경 성공 후 로그아웃 페이지 이동
            } else {
                console.error('API 요청 실패:', response.data);
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
                value={newPassword1}
                onChangeText={setNewPassword1}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                placeholder="새 비밀번호 확인"
                value={newPassword2}
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
