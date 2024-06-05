import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Button } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BannerCarousel from './BannerCarousel';
import SimilarBooks from "../bookkDetail/similarBooks";
import Author from '../authorDetail/Author';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const { width, height } = Dimensions.get("window");

function Home() {
    const navigation = useNavigation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState([]);
    const [bookCount, setBookCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchBooks = async () => {
            const bookData = await fetchBookData();
            setBooks(bookData);
            setBookCount(bookData.length);
            const pages = bookData.reduce((total, book) => total + (book.NumberPages || 0), 0);
            setTotalPages(pages);
        };

        const fetchAuthors = async () => {
            const authorData = await fetchAuthorData();
            setAuthors(authorData);
            setLoading(false);
        };

        fetchBooks();
        fetchAuthors();
    }, []);

    const fetchBookData = async () => {
        const allData = [];

        try {
            const querySnapshot = await getDocs(collection(db, "books"));
            querySnapshot.forEach((doc) => {
                allData.push({ ...doc.data(), id: doc.id });
            });
            return allData;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchAuthorData = async () => {
        const allAuthors = [];

        try {
            const querySnapshot = await getDocs(collection(db, "authors"));
            querySnapshot.forEach((doc) => {
                allAuthors.push({ ...doc.data(), id: doc.id });
            });
            return allAuthors;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
        <ScrollView>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#2980B9',
                justifyContent: 'center',
                marginBottom: 400
            }}>
                {/* Top View */}
                <View style={{
                    width: '100%',
                    height: '20%',
                    justifyContent: 'center',
                }}>
                    <Image
                        style={{ width: "100%", height: height }}
                        source={require('../../../assets/anasayfaDeneme2.jpg')}
                    />
                </View>

                {/* Bottom View */}
                <View style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F4F4F4',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    justifyContent: 'center',
                }}>
                    <View style={{
                        marginTop: 19,
                        flexDirection: "row",
                        alignItems: 'center',
                        height: height * 0.06,
                        width: width * 0.9,
                        backgroundColor: "#e2b951",
                        borderRadius: 14,
                        paddingHorizontal: 14,
                        marginBottom: 23,
                        marginLeft: 20,
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <SimpleLineIcons
                            style={{ position: 'absolute', left: 12 }}
                            name="book-open"
                            size={10}
                            color="white"
                        />
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                textAlign: 'center',
                                flex: 1
                            }}
                        >
                            İçeride toplam {bookCount} kitap ve {totalPages} sayfa var!
                        </Text>
                    </View>

                    <BannerCarousel />

                    <View style={{ marginBottom: 35, marginLeft: 12, marginTop: -734, marginHorizontal: 2 }}>
                        <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 20 }}>Yeni Eklenen Kitaplar</Text>
                        <FlatList
                            horizontal
                            data={books}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ marginRight: 20, marginLeft: 10, marginTop: 50 }}>
                                    <SimilarBooks book={item} />
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <View style={{ marginBottom: 15, marginLeft: 17, marginTop: 2 }}>
                        <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 30 }}>En Sevilen Kitaplar</Text>
                        <FlatList
                            horizontal
                            data={books}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ marginRight: 20, marginLeft: 10, marginTop: 50, }}>
                                    <SimilarBooks book={item} />
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* Yazarların Listesi */}
                    <View style={{ marginBottom: 15, marginLeft: 17, marginTop: 2 }}>
                        <Text style={{ fontSize: 19, fontWeight: 'bold' }}>Favori Yazarlar</Text>
                        <FlatList
                            horizontal
                            data={authors}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ marginRight: 10, marginLeft: 10, marginTop: 90, marginBottom: 1244 }}>
                                    <Author author={item} />
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>
            </View>

            {/* Yazar ve Kitap Ekle Butonları */}
            <Button title="Yazar Ekle" onPress={() => navigation.navigate('yazar ekle item', { authorId: 'desired-author-id' })} />
            <Button title="Kitap Ekle" onPress={() => navigation.navigate('Kitap Ekle2')} />
            <Button title="Kitap Listesi" onPress={() => navigation.navigate('Kitap liste')} />
        </ScrollView>
    );
}

export default Home;
