import React, {useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const route = useRoute();
    const {token} = route.params;
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            const djServer = await fetch('http://192.168.35.29:8000/accounts/dj-rest-auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (djServer.status == 200) {
                await AsyncStorage.removeItem('authToken');
                console.log('토큰이 삭제됨');
                // setIsLoggedIn(false);
                Alert.alert('로그아웃 성공!');
                navigation.navigate('Login');
            } else {
                Alert.alert('로그아웃 실패');
            }
        } catch (error) {
            console.error('로그아웃 에러 : ', error);
        }
    };

    return (
        <View style={styles.container}>
            {isLoggedIn ? (
                <>
                <Text>로그인 되었습니다.</Text>
                <Button title='로그아웃' onPress={handleLogout} />
                </>
            ) : (
                <Text>로그인되어 있지 않습니다.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LogoutScreen;