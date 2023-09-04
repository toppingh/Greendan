import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS, RESULTS, check, reqeust as requestPermission } from 'react-native-permissions';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfilePictureScreen = () => {
    const [image, setImage] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { token, currentUsername } = route.params;

    const requestGalleryPermission = async () => {
        try {
            const result = await requestPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

            if (result === RESULTS.GRANTED) {
                console.log('저장소 권한이 허용되었습니다.');
            } else {
                console.log('저장소 권한이 거부되었습니다.');
                showPermissionAlert();
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const showPermissionAlert = () => {
        Alert.alert(
            '권한 요청',
            '앱 사용을 위해 저장소 권한이 필요!',
            [
                {
                    text: '취소',
                    onPress: () => console.log('권한 요청 취소'),
                    style: 'cancel',
                },
                {
                    text: '설정으로 이동',
                    onPress: () => openAppSettings(),
                },
            ],
        );
    };

    const openAppSettings = async () => {
        try {
            const status = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            
            if (status === RESULTS.DENIED) {
                const statusAgain = await requestPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                if (statusAgain === RESULTS.GRANTED) {
                    console.log('저장소 권한이 허용됨');
                } else {
                    console.log('저장소 권한이 거부됨');
                }
            }
        } catch (err) {
            console.error('앱 설정 화면 이동 실패 : ', err);
        }
    };
    

    const selectImage = () => {
        // 이미지 라이브러리에서 이미지 선택
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.5,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('프로필 사진 변경을 취소했습니다.');
                } else if (response.error) {
                    console.log('이미지 선택 에러 : ', response.error);
                } else {
                    // 이미지 선택 후, 서버에 업로드
                    uploadImage(response);
                }
            }
        );
    };

    const uploadImage = (imageData) => {
        const formData = new FormData();
        formData.append('newprofileImg', {
            uri: imageData.uri,
            type: imageData.type,
            name: imageData.fileName,
        });

        fetch('http://172.18.77.126:8000/accounts/change/profile/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
            .then((response) => {
                if (response.status === 200) {
                    Alert.alert('프로필 이미지 변경 성공!!');
                    navigation.navigate('Logout', { token });
                } else {
                    console.error('이미지 변경 실패ㅠㅠ');
                }
            })
            .catch((error) => {
                console.error('이미지 변경 에러 :', error);
            });
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 갤러리 권한 요청
        requestGalleryPermission();
    }, []);

    return (
        <View style={styles.container}>
            {image && <Image source={{ uri: image.uri }} style={styles.image} />}
            <Button title="이미지 선택" onPress={selectImage} />
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
