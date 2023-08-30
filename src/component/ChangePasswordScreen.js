import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleChangePassword = async () => {
        if (newPassword === confirmNewPassword) {
            try {
                const djServer = await fetch('http://192.168.35.29:8000/accounts/change/12', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                });

                if (djServer.ok) {
                    setChangeSuccess(true);
                    Alert.alert('비밀번호가 성공적으로 변경됨');
                } else {
                    const errorData = await djServer.json();
                    setErrorMessage(errorData.detail || '비밀번호 변경 실패');
                }
            } catch (error) {
                console.error(`에러발생 : ${error}`);
            }
        } else {
            setErrorMessage('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.');
        }
    };

    return (
        <View style={styles.container}>
            {changeSuccess ? (
                <Text>비밀번호가 성공적으로 재설정되었습니다.</Text>
            ) : (
                <View>
                    <TextInput 
                    placeholder='현재 비밀번호'
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    style={styles.input}
                    />
                    <TextInput 
                    placeholder='새 비밀번호'
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                    />
                    <TextInput 
                    placeholder='새 비밀번호 확인'
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry
                    style={styles.input}
                    />
                    <Button title='비밀번호 변경' onPress={handleChangePassword} />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default ChangePasswordScreen;