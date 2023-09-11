import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QnaDetailScreen = ({ route }) => {
    const { qnId } = route.params;
    const [qnaDetail, setQnaDetail] = useState(null);
    // console.log(qnId);

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                const authToken = await AsyncStorage.getItem('authToken');
                const response = await fetch(`http://192.168.35.29:8000/info/qna/${qnId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                const data = await response.json();
                console.log(`data 확인 : ${data}`);
                setQnaDetail(data);
                console.log('qnaDetail.title', data.result.title);
                console.log('qnaDetail.content', data.result.content);
            } catch (error) {
                console.error('API 호출 오류: ', error);
            }
        };

        fetchQnaDetail();
    }, [qnId]);

    console.log('qna 디테일 :', JSON.stringify(qnaDetail));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>문의 상세 정보</Text>
            {qnaDetail ? (
                <View>
                    <Text style={styles.qnaTitle}>{qnaDetail.result.title}</Text>
                    <Text style={styles.qnaContent}>{qnaDetail.result.content}</Text>
                    <Text style={styles.qnaDate}>{qnaDetail.result.created_at}</Text>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black',
        textAlign: 'center',
        marginTop: 20,
    },
    qnaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'black',
        textAlign: 'center',
    },
    qnaContent: {
        fontSize: 16,
        marginBottom: 16,
        color: 'black',
        textAlign: 'center',
    },
    qnaDate: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    }
});

export default QnaDetailScreen;
