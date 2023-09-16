import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateQnaScreen = ({ navigation }) => {
    const [qnaTitle, setQnaTitle] = useState('');
    const [qnaContent, setQnaContent] = useState('');

    const route = useRoute();
    const { email } = route.params;

    const handleSubmit = async () => {
        if (!qnaTitle || !qnaContent) {
            Alert.alert('입력 오류', '모든 항목을 입력하세요');
            return;
        }

        const authToken = await AsyncStorage.getItem('authToken');
        console.log(`authToken 출력: ${authToken}`);
        if (!authToken) {
            console.error('authToken 없음');
            return;
        }
        console.log('토큰 가져오기 성공', authToken);

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        });
        console.log(`headers 정보: ${headers}`);

        fetch('http://172.18.80.87:8000/info/qna/', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                email: email,
                title: qnaTitle,
                content: qnaContent,
            }),
        })
        
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 201) {
                Alert.alert('문의 등록 완료~');
                navigation.navigate('UserQna', {email});
            } else {
                console.log(data);
                Alert.alert('오류', '문의 등록 중 오류 발생');
            }
        })
        .catch((error) => {
            console.error('문의 등록 오류 : ', error);
            Alert.alert('오류', '서버와 통신 중 오류');
        });
    };

    return (
        <ScrollView>
            <Text style={styles.header}>문의 작성하기</Text>
            <TextInput
                style={styles.input}
                placeholder="문의 제목"
                onChangeText={(text) => setQnaTitle(text)}
                value={qnaTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="문의 내용"
                onChangeText={(text) => setQnaContent(text)}
                value={qnaContent}
                multiline
            />
            <Button title="작성 완료" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
        color: 'black',
    },
});

export default CreateQnaScreen;
