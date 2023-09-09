import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const TestPhoto = ({ authToken }) => {
    const [photoData, setPhotoData] = useState(null);

    const options = {
        title: '사진 선택',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    const openCamera = () => {
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('사용자가 취소함');
            } else if (response.error) {
                console.log(`이미지 선택 에러 : ${response.error}`);
            } else {
                setPhotoData({uri: response.uri});
                console.log(`이미지 uri: ${response.uri}`);

                const formData = new FormData();
                formData.append('image', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName,
                });

                fetch('http://127.30.1.64:8000/photo/test/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log(`서버 응답: ${data}`);
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
            } 
        })
    }

    // const selectImage = () => {
    //     console.log('사진 선택 버튼 클릭');

    //     launchCamera({ mediaType: 'photo' }, async (response) => {
    //         console.log('카메라 촬영 버튼 누름');

    //     if (response.didCancel) {
    //         console.log('사용자가 촬영을 취소함');
    //     } else if (response.error) {
    //         console.log(`카메라 오류: ${response.error}`);
    //     } else if (response.uri) {
    //         console.log(`선택사진 : ${response}`);
    //         setPhotoData(response.uri);

    //         Alert.alert(
    //             '사진 확인',
    //             '이 사진으로 하시겠습니까?',
    //             [
    //                 {
    //                 text: '아니요',
    //                 style: 'cancel',
    //                 },
    //                 {
    //                 text: '예',
    //                 onPress: () => uploadImage(response),
    //                 },
    //             ],
    //             );
    //     }
    //     });
    // };

    // const uploadImage = async (imageData) => {
    //     const formData = new FormData();
    //     formData.append('user_image', {
    //         uri: imageData.uri,
    //         name: imageData.fileName,
    //         type: imageData.type,
    //     });

    // const djServer = 'http://192.168.35.29:8000/photo/test/';

    // try {
    //     const uploadResponse = await fetch(djServer, {
    //         method: 'POST',
    //         body: formData,
    //         headers: {
    //             Authorization: `Bearer ${authToken}`,
    //         },
    //     });
    //     consolelog(`응답 : ${uploadResponse}`);

    //     if (uploadResponse.status === 200) {
    //         const data = await uploadResponse.json();
    //         setPhotoData(data.result);
    //     } else {
    //         console.error('사진 업로드 실패');
    //     }
    //     } catch (error) {
    //         console.error('사진 업로드 오류: ', error);
    //     }
    // };

    return (
        <View>
        <Button title="사진 촬영" onPress={selectImage} />
        {photoData ? (
            <>
            <Image
                source={{ uri: photoData }}
                style={{ width: 200, height: 200 }}
            />
            <Text>성공적으로 처리되었습니다!</Text>
            </>
        ) : (
            <Text>아직 사진이 없습니다.</Text>
        )}
        </View>
    );
    };

export default TestPhoto;
