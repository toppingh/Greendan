import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import CameraRoll from '@react-native-cameraroll/cameraroll';

const TestPhoto = ({ authToken }) => {
    const [photoData, setPhotoData] = useState(null);

    // 이미지 저장
    const saveToGallery = async (imageUri) => {
        try {
            await CameraRoll.save(imageUri, {album: '내 앨범'});
            console.log('이미지 저장 성공');
        } catch (error) {
            console.error('이미지 저장 오류: ', error);
        }
    };

    const options = {
        title: '사진 선택',
        storageOptions: {
            skipBackup: true,
            path: 'images',
            cameraroll: true,
        },
    };

    const openCamera = async () => {
        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('사용자가 취소함');
            } else if (response.error) {
                console.log(`이미지 선택 에러 : ${response.error}`);
            } else {
                setPhotoData({uri: response.assets[0].uri});
                saveToGallery(imageUri);
                console.log(`이미지 uri: ${response.assets[0].uri}`);


                const formData = new FormData();
                formData.append('user_image', {
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                    name: response.assets[0].fileName,
                });

                fetch('http://172.30.1.38:8000/photo/test/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // 'Accept': 'application/json',
                    },
                })
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log(`서버 응답: ${JSON.stringify(data)}`);
                })
                .catch((error) => {
                    console.error(`에러 : ${error}`);
                    Alert.alert('이미지 업로드 실패', '서버에서 이미지 요청에 실패했습니다.');
                });
            }
        });
    };

    const openGallery = () => {
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('사용자가 취소함');
            } else if (response.error) {
                console.log(`이미지 에러 : ${respone.error}`);
            } else {
                setPhotoData({uri: response.assets[0].uri});
                console.log(`이미지 uri: ${response.assets[0].uri}`);
            }
        });
    };

    return (
        <View>
            <Button title="카메라 촬영" onPress={openCamera} />
            <Button title="갤러리 선택" onPress={openGallery} />
            {photoData && <Image source={photoData} style={{width: 200, height: 200}} />}
        </View>
    )
};

export default TestPhoto;
