import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, Alert, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePictureScreen = ({route}) => {
    const [response, setResponse] = useState('');
    const [image, setImage] = useState(null);
    const navigation = useNavigation();
    const {token, pk} = route.params;

    // 갤러리
    const selectImage = async () => {
        try {
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    maxWidth: 1400,
                    maxheight: 1400,
                    includeBase64: true
                },
                (response) => {
                    // console.log(response);
                    if (response.didCancel) {
                        return;
                    } else if (response.errorCode) {
                        console.log('image Error : ' + response.errorCode);
                    }

                    setResponse(response);
                    setImage(response.assets[0].base64);
                }
            );
        } catch (error) {
            console.error('AsyncStorage 오류: ', error);
        }
    };

    const uploadImage = async () => {
        try {
            if (!response) {
                Alert.alert('이미지 선택');
                return;
            }

            const authToken = `Bearer ${token}`;
    
            const formData = new FormData();
            formData.append('profileImg', {
                uri: response.assets[0].uri,
                type: response.assets[0].type,
                name: response.assets[0].fileName,
            });

            const uploadResponse = await fetch(`http://192.168.35.29:8000/accounts/change/profile/${pk}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': authToken,
                },
                body: formData,
            });

            if (uploadResponse.status === 200) {
                Alert.alert('이미지 업로드 성공');
                navigation.navigate('Logout', {token, pk});
            } else {
                console.error('이미지 업로드 실패');
                console.log(uploadResponse);
            }
        } catch (error) {
            console.error('이미지 업로드 에러: ', error);
        }
    };

    return (
        <View style={styles.container}>
            {image && <Image source={response ? {uri: response.assets[0].uri} : 0} style={styles.image} />}
            <Button title="이미지 선택" onPress={selectImage} />
            <Button title="업로드" onPress={uploadImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default ProfilePictureScreen;