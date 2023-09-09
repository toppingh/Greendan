import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const BlightScreen = ({ navigation }) => {
    const [blights, setBlights] = useState([]);

    useEffect(() => {
        fetch('http://172.30.1.64:8000/home/blight/')
        .then((response) => {
            if (!response.ok) {
            throw new Error('네트워크 오류');
            }
            return response.json();
        })
        .then((data) => setBlights(data.result))
        .catch((error) => console.error('요청 에러: ', error));
    }, []);

    const getImage = (imagePath) => {
        console.log(`이미지: ${imagePath}`);
        try {
        return `http://172.30.1.64:8000${imagePath}`;
        } catch (error) {
        console.error('이미지 URL을 가져오는 중 오류 발생:', error);
        // return '기본 이미지 URL'; // 기본 이미지 URL 또는 다른 오류 처리 로직을 추가합니다.
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.header}>자주 발생하는 병해</Text>
        {blights.map((blight) => (
            <TouchableOpacity
            key={blight.id}
            onPress={() => navigation.navigate('BlightDetail', { blightId: blight.id })}
            >
            <Text style={styles.text}>{blight.name}</Text>
            <Image source={{ uri: getImage(blight.blight_img) }} style={styles.image} />
            </TouchableOpacity>
        ))}
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
        alighItems: 'center',
    },
    text: {
        color: 'black',
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default BlightScreen;
