import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import {userNavigation, useRoute} from '@react-navigation/native';

const ChangePwScreen = () => {
    const navigation = useNavigation();
    const route = userRoute();

    const userPk = route.params?.userPk || null;

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const handleChangePassword = async () => {
        if (newPassword === confirmNewPassword) {
            try {
                const djServer = await fetch('http://172.30.1.62:8000/accounts/dj-rest-auth/password/change/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        newPassword: newPassword,
                        user_pk: userPk,
                    }),
                });
                if (djServer.ok) {
                    setChangeSuccess(true);
                } else {
                    const errorData = await djServer.json();
                    setErrorMessage(errorData.detail || '비밀번호 재설정 실패');
                }
            } catch (error) {
                console.error(`에러발생 : ${error}`);
            }
        } else {
            console.error('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.')
        }
    };

    return (
        <View style={styles.container}>
            {changeSuccess ? (
                <Text>비밀번호가 성공적으로 재설정되었습니다.</Text>
            ) : (
                <View>
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
                    <Button title='비밀번호 재설정' onPress={handleChangePassword} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },

    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default ChangePwScreen;