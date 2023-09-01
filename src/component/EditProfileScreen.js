import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text} from 'react-native';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const EditProfileScreen = () => {
    const [newUsername, setNewUserName] = useState('');

    const route = useRoute();
    const {token, currentUsername} = route.params;
    const navigation = useNavigation();

    const handleEditProfile = async () => {
        try {
            if (!newUsername) {
                Alert.alert('새 이름을 입력하세요.');
                return;
            }

            const djServer = await axios.patch('http://192.168.1.13:800/accounts/change/username/',
                {
                    newUsername,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            
            if (djServer.status === 200) {
                Alert.alert(`${newUsername}으로 유저네임 수정 성공`);
                navigation.navigate('ChangePassword');
            } else {
                console.error('API 요청 실패 : ', djServer.data);
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