import React, {useState, useEffect} from 'react';
import {View, Button, Image, Text} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const NormalPhoto = ({authToken}) => {
    const [photoData, setPhotoData] = useState(null);

        const selectImage = () => {
            console.log('사진 선택 버튼 클릭');
            launchCamera({mediaType:'photo'}, async (response) => {
                if (response.uri) {
                    console.log('선택 사진: ', response); // 사진 정보 출력 콘솔
                    const formData = new FormData();
                    formData.append('user_image_a', {
                        uri: response.uri,
                        name: response.fileName,
                        type: response.type,
                    });
                    // formData.append('user_image_a', null);

                    const djServer = 'http://192.168.35.29:8000/photo/test/';

                    try {
                        const uploadImage = await fetch(djServer, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            },
                        });

                        if (uploadResponse.status === 200) {
                            const data = await uploadResponse.json();
                            setPhotoData(data.result);
                        } else {
                            console.error('사진 업로드 실패');
                        }
                    } catch (error) {
                        console.error('사진 업로드 오류: ', error);
                    }
                }
            });
        };

        return (
            <View>
                <Button title="사진 촬영" onPress={selectImage} />
                {photoData ? (
                    <>
                    <Image
                    source={{uri: `data: image/jpg;base64, ${photoData}`}}
                    style={{width:200, height:200}}
                    />
                    <Text>성공적으로 처리되었습니다!</Text>
                    </>
                ) : (
                    <Text>아직 사진이 없습니다.</Text>
                )}
            </View>
        );
    };

export default NormalPhoto;