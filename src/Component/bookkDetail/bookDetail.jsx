import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import SimilarBooks from "./similarBooks";
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

const fetchBookData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "books"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.log(error);
        return [];
    }
};

const BookDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bookId } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [similarBooks, setSimilarBooks] = useState([]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const booksData = await fetchBookData();
                const selectedBook = booksData.find(b => b.id === bookId);
                setBook(selectedBook);

                // Fetch similar books with the same type
                const filteredBooks = booksData.filter(b => b.type === selectedBook.type && b.id !== bookId);
                setSimilarBooks(filteredBooks);

                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    useEffect(() => {
        const checkBookStatus = async () => {
            try {
                const likedBooks = JSON.parse(await AsyncStorage.getItem('likedBooks')) || [];
                const addedBooks = JSON.parse(await AsyncStorage.getItem('addedBooks')) || [];
                const downloadedBooks = JSON.parse(await AsyncStorage.getItem('downloadedBooks')) || [];

                setLiked(likedBooks.includes(bookId));
                setAdded(addedBooks.includes(bookId));
                setDownloaded(downloadedBooks.some(b => b.id === bookId));
            } catch (error) {
                console.log(error);
            }
        };

        checkBookStatus();
    }, [bookId]);

    const handleLikePress = async () => {
        try {
            const likedBooks = JSON.parse(await AsyncStorage.getItem('likedBooks')) || [];
            if (liked) {
                const newLikedBooks = likedBooks.filter(id => id !== bookId);
                await AsyncStorage.setItem('likedBooks', JSON.stringify(newLikedBooks));
            } else {
                likedBooks.push(bookId);
                await AsyncStorage.setItem('likedBooks', JSON.stringify(likedBooks));
            }
            setLiked(!liked);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddPress = async () => {
        try {
            const addedBooks = JSON.parse(await AsyncStorage.getItem('addedBooks')) || [];
            if (added) {
                const newAddedBooks = addedBooks.filter(id => id !== bookId);
                await AsyncStorage.setItem('addedBooks', JSON.stringify(newAddedBooks));
            } else {
                addedBooks.push(bookId);
                await AsyncStorage.setItem('addedBooks', JSON.stringify(addedBooks));
            }
            setAdded(!added);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDownloadPress = async () => {
        try {
            const downloadedBooks = JSON.parse(await AsyncStorage.getItem('downloadedBooks')) || [];
            if (downloaded) {
                const newDownloadedBooks = downloadedBooks.filter(b => b.id !== bookId);
                await AsyncStorage.setItem('downloadedBooks', JSON.stringify(newDownloadedBooks));
                setDownloaded(false);
            } else {
                downloadedBooks.push(book);
                await AsyncStorage.setItem('downloadedBooks', JSON.stringify(downloadedBooks));
                setDownloaded(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!book) {
        return <Text>Book not found</Text>;
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ borderBlockColor: "red", borderTopRightRadius: 44 }}>
                <Image
                    blurRadius={0}
                    style={{ width: '100%', height: height * 0.5, resizeMode: 'cover' }}
                    source={{ uri: book.imageUrl }}
                />
                <View style={{ backgroundColor: "white", marginBottom: 17 }}>
                    <View style={{ backgroundColor: "white", width: "100%", alignItems: 'center', justifyContent: 'center', marginTop: 20, position: "absolute", top: -85, borderTopLeftRadius: 40, borderTopEndRadius: 40 }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 50, marginBottom: 15 }}>{book.title}</Text>
                        <Text style={{ fontSize: 17, color: "gray" }}>{book.writer} | {book.publisher}</Text>
                        <Text style={{ fontSize: 14, color: "red", backgroundColor: "#FFE5E6", marginTop: 8, paddingHorizontal: 12, paddingVertical: 3 }}>{book.type}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 122, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 80, }}>
                <TouchableOpacity
                    style={{ backgroundColor: "white", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: 'center' }}
                    onPress={handleAddPress}
                >
                    <MaterialCommunityIcons name="bookmark-plus-outline" size={24} color={added ? "red" : "black"} />
                    <Text style={{ color: added ? "red" : "black" }}>Ekle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: "white", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: 'center' }}
                    onPress={handleLikePress}
                >
                    <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
                    <Text style={{ color: liked ? "red" : "black" }}>Beğen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: "white", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: 'center' }}
                    onPress={handleDownloadPress}
                >
                    <Feather name="download" size={24} color={downloaded ? "red" : "black"} />
                    <Text style={{ color: downloaded ? "red" : "black" }}>İndir</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "white"
            }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('PdfViewer', { pdfUrl: book.pdfUrl })}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 23,
                        backgroundColor: '#465de2',
                        width: "90%",
                        height: 50,
                        borderRadius: 12,
                    }}>
                    <Text style={{ textAlign: 'center', color: "white", fontSize: 17, fontWeight: "500" }}>Okumaya Başla</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12, paddingHorizontal: 30, backgroundColor: "white" }}>
                <Text style={{ fontSize: 27, fontWeight: "bold" }}>Hakkında</Text>
                <Text style={{ fontSize: 16, color: "gray", marginTop: 8 }}>
                    {book.content}
                </Text>
            </View>

            <View style={{ marginTop: 12, paddingHorizontal: 30 }}>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", marginTop: 14, borderBottomWidth: 0.2, borderBlockColor: "gray", paddingBottom: 12 }}>
                    <Text style={{ fontSize: 20, color: "gray" }}>ISBN:</Text>
                    <Text style={{ paddingHorizontal: 30, fontSize: 20 }}> {book.ISBN}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", marginTop: 14, borderBottomWidth: 0.2, borderBlockColor: "gray", paddingBottom: 12 }}>
                    <Text style={{ fontSize: 20, color: "gray" }}>Sayfa Sayısı:</Text>
                    <Text style={{ paddingHorizontal: 30, fontSize: 20 }}> {book.NumberPages}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", marginTop: 14 }}>
                    <Text style={{ fontSize: 20, color: "gray" }}>Yayın Tarihi:</Text>
                    <Text style={{ paddingHorizontal: 30, fontSize: 20 }}> {book.releaseDate}</Text>
                </View>
            </View>

            <View style={{ backgroundColor: 'white', paddingHorizontal: 30, marginTop: 20 }}>
                <Text style={{ fontSize: 19, fontWeight: "bold", marginTop: 16, marginBottom: 15 }}>Benzer Kitaplar</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} bounces={true} contentContainerStyle={{ paddingHorizontal: 10 }}>
                    {similarBooks.map(similarBook => (
                        <View key={similarBook.id} style={{ marginRight: 20, marginTop: 44 }}>
                            <SimilarBooks book={similarBook} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

export default BookDetail;
