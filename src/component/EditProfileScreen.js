import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const [newUsername, setNewUserName] = useState('');

    const route = useRoute();
    const { token, currentUsername } = route.params;
    const navigation = useNavigation();

    const handleEditProfile = async () => {
        try {
            if (!newUsername) {
                Alert.alert('새 이름을 입력하세요.');
                return;
            }

            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            });

            const response = await fetch('http://172.18.77.126:8000/accounts/change/username/', {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    newUsername,
                }),
            });

            if (response.status === 200) {
                Alert.alert(`${newUsername}으로 유저네임 수정 성공`);
                navigation.navigate('ProfileImg', {token});
            } else {
                console.error('API 요청 실패 : ', await response.json());
            }
        } catch (error) {
            console.error('API 요청 오류 : ', error);
            // 토큰 확인용 에러
            console.error('토큰 값 : ', token);
        }
    };

    return (
        <View style={styles.container}>
            <Text>프로필 수정</Text>
            <TextInput 
                placeholder="새 이름"
                value={newUsername}
                onChangeText={setNewUserName}
                style={styles.input}
            />
            <Button title="이름 수정" onPress={handleEditProfile} />
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

export default EditProfileScreen;
