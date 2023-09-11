import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const BlightScreen = ({ route }) => {
    const {blightId} = route.params;
    const [blight, setBlight] = useState([]);

    useEffect(() => {
        fetch(`http://172.30.1.38/home/blight/${blightId}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('네트워크 오류');
                }
                return response.json();
            })
            .then((data) => setBlight(data.result))
            .catch((error) => console.error('요청 에러: ', error));
    }, [blightId]);

    if (!blight) {
        return <Text>Loading...</Text>;
    }

    const getImage = (imagePath) => {
        try {
            return `http://172.30.1.38:8000${imagePath}`;
        } catch (error) {
            console.error('이미지 URL을 가져오는 중 오류 발생:', error);
            // return '기본 이미지 URL'; // 기본 이미지 URL 또는 다른 오류 처리 로직을 추가합니다.
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{blight.name}</Text>
            <Image source={{ uri: getImage(blight.blight_img) }} style={styles.image} />
            <Text style={styles.description}>{blight.causation}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    item: {
        alignItems: 'center', // alighItems 대신 alignItems
    },
    text: {
        color: 'black',
        textAlign: 'center', // 텍스트 가운데 정렬
        marginBottom: 10, // 텍스트 아래 여백 추가
    },
    description: {
        color: 'black',
        textAlign: 'center', // 텍스트 가운데 정렬
        marginBottom: 10, // 텍스트 아래 여백 추가
    },
    image: {
        width: 200, // 이미지 너비 조정
        height: 200, // 이미지 높이 조정
        marginBottom: 20,
    },
});

export default BlightScreen;
