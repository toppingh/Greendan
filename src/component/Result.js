    import React, { useState, useEffect, useRef } from 'react';
    import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    } from 'react-native';
    import Icon from 'react-native-vector-icons/MaterialIcons';
    import { useNavigation, useRoute } from '@react-navigation/native';
    import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

    const Tab = createMaterialTopTabNavigator();

    const Result = () => {
    const forceUpdate = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { email, token } = route.params;
    const [userRecords, setUserRecords] = useState([]);
    const [data, setData] = useState(userRecords);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const bookmarkedRecords = userRecords.filter((item) => item.bookmarked);

    const fetchData = async () => {
        try {
        const response = await fetch('http://192.168.35.29:8000/home/history/');
        if (!response.ok) {
            throw new Error('네트워크 오류');
        }
        const data = await response.json();
        if (data.code === 200) {
            const filteredData = data.result.filter((item) => item.email === email);
            setUserRecords(filteredData);
        } else {
            console.error('데이터 가져오기 실패:', data.message);
        }
        } catch (error) {
        console.error('요청 에러: ', error);
        }
    };

    useEffect(() => {
        forceUpdate.current = forceUpdateFunction;
    }, []);

    const forceUpdateFunction = () => {
        setUserRecords([...userRecords]);
    };

    useEffect(() => {
        fetchData();
    }, [email]);

    const getImage = (imagepath) => {
        try {
        return `http://192.168.1.101:8000${imagepath}`;
        } catch (error) {
        console.log('이미지 URL을 가져오는 오류 발생:', error);
        }
    };

    const handleBookmarkAndUpdateData = async (item) => {
        try {
        const response = await fetch(
            `http://192.168.1.101:8000/home/history/${item.id}/`,
            {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bookmarked: !item.bookmarked }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const updatedData = data.map((dataItem) => {
            if (dataItem.id === item.id) {
            const updateItem = { ...dataItem, bookmarked: !dataItem.bookmarked };
            return updateItem;
            }
            return dataItem;
        });

        setData(updatedData);

        fetchData();
        } catch (error) {
        console.error('오류 발생:', error);
        }
    };

    const handleResult = (item) => {
        navigation.navigate('Result_', {
        id: item.id,
        title: item.name,
        image: item.history_img,
        explanation: item.causation,
        date: item.created_at,
        bookmarked: item.bookmarked,
        updateBookmark: handleBookmarkAndUpdateData,
        token: token,
        email,
        });
    };

    const handleSearch = async () => {
        try {
        const response = await fetch('http://192.168.35.29:8000/home/search/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: searchQuery }),
        });

        if (!response.ok) {
            throw new Error('네트워크 오류');
        }

        const searchData = await response.json();
        if (searchData.results) {
            setFilteredData(searchData.results);
        } else {
            console.error('검색 결과 없음');
        }
        } catch (error) {
        console.error('검색 요청 에러:', error);
        }
    };

    const renderItem = ({ item }) => {
        const date = new Date(item.created_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `Date: ${year}-${month}-${day} ${hours}:${minutes}`;

        return (
        <TouchableOpacity
            style={styles.magazineItem}
            onPress={() => handleResult(item)}
        >
            <View style={styles.imageContainer}>
            <Image source={{ uri: getImage(item.history_img) }} style={styles.image} />
            <Text style={styles.smallTitle}>{item.name}</Text>
            <View style={styles.dateContainer}>
                <View style={styles.dateBackground}></View>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            <TouchableOpacity onPress={() => handleBookmarkAndUpdateData(item)}>
                <Icon
                name={item.bookmarked ? 'bookmark' : 'bookmark-border'}
                size={40}
                color={item.bookmarked ? 'blue' : 'gray'}
                />
            </TouchableOpacity>
            </View>
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
        <View style={styles.searchBar}>
            <TextInput
            style={styles.searchInput}
            placeholder="제목으로 검색"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            />
            <TouchableOpacity onPress={handleSearch}>
            <Icon name="search" size={30} color="#8CB972" />
            </TouchableOpacity>
        </View>
        <FlatList
            data={filteredData.length > 0 ? filteredData : userRecords}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    image: {
        width: '60%',
        height: 130,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    smallTitle: {
        width: '30%',
        height: 130,
        backgroundColor: '#808080',
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        left: -5,
        color: 'white',
        paddingHorizontal: 5,
    },
    dateContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    dateBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
    },
    magazineItem: {
        width: '100%',
    },
    dateText: {
        color: 'white',
    },
    });

    export default Result;