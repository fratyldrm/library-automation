import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import SimilarBooks from "../bookkDetail/similarBooks";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

const AutherDetail = ({ route }) => {
    const { authorId } = route.params;
    const [author, setAuthor] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        console.log("Author ID from route params: ", authorId); // Log the authorId
        const fetchAuthor = async () => {
            try {
                const docRef = doc(db, 'authors', authorId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data()); // Log the document data
                    setAuthor(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document: ', error);
            }
        };

        const checkIfLiked = async () => {
            try {
                const likedAuthors = JSON.parse(await AsyncStorage.getItem('likedAuthors')) || [];
                if (likedAuthors.includes(authorId)) {
                    setLiked(true);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAuthor();
        checkIfLiked();
    }, [authorId]);

    const handleLikePress = async () => {
        try {
            const likedAuthors = JSON.parse(await AsyncStorage.getItem('likedAuthors')) || [];
            if (liked) {
                const newLikedAuthors = likedAuthors.filter(id => id !== authorId);
                await AsyncStorage.setItem('likedAuthors', JSON.stringify(newLikedAuthors));
            } else {
                likedAuthors.push(authorId);
                await AsyncStorage.setItem('likedAuthors', JSON.stringify(likedAuthors));
            }
            setLiked(!liked);
        } catch (error) {
            console.log(error);
        }
    };

    if (!author) {
        return (
            <View style={styles.loading}>
                <Text>Yazar bilgileri yükleniyor...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ borderBlockColor: "red", borderTopRightRadius: 44 }}>
                <Image
                    blurRadius={0}
                    style={{ width: '100%', height: height * 0.3, resizeMode: 'cover', blurRadius: 5 }}
                    source={require('../../../assets/myLibrary.jpg')}
                />
                <View style={{ backgroundColor: "white" }}>
                    <View style={{ backgroundColor: "white", width: "100%", alignItems: 'center', justifyContent: 'center', marginTop: 20, position: "absolute", top: -85, borderTopLeftRadius: 40, borderTopEndRadius: 40 }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 70, marginBottom: 15 }}>{author.name}</Text>
                    </View>
                </View>
            </View>

            <View style={{
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 9, justifyContent: "center", alignItems: 'center', width: 100, height: 100, borderWidth: 0.2, borderColor: "black", position: 'absolute', top: 130, left: 140, backgroundColor: "white", borderRadius: 3333
            }}>
                <Image style={{ width: 100, height: 100, borderRadius: 554 }}
                    source={{ uri: author.imageUrl }}
                />
            </View>

            <View style={{ marginTop: 80, flexDirection: "row", justifyContent: "center", paddingHorizontal: 80 }}>
                <TouchableOpacity onPress={handleLikePress} style={{ backgroundColor: "white", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: 'center' }}>
                    <AntDesign name={liked ? "heart" : "hearto"} size={24} color="red" />
                    <Text>Beğen</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12, paddingHorizontal: 30, backgroundColor: "white" }}>
                <Text style={{ fontSize: 27, fontWeight: "bold", }}>Hakkında</Text>
                <Text style={{ fontSize: 16, color: "gray", marginTop: 8 }}>
                    {author.about}
                </Text>
            </View>

            <View style={{ backgroundColor: 'white', paddingHorizontal: 30 }}>
                <Text style={{ fontSize: 19, fontWeight: "bold", marginTop: 16, marginBottom: 35 }}>Tüm Eserleri </Text>
                <SimilarBooks
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    bounces={true}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AutherDetail;
