import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';

const AddBook2 = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [publisher, setPublisher] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [isbn, setIsbn] = useState('');
    const [numberPages, setNumberPages] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [image, setImage] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadFile = async (uri, filePath) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileRef = ref(storage, filePath);
            await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file: ', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!title || !writer || !publisher || !type || !content || !isbn || !numberPages || !releaseDate || !image || !pdfUrl) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        try {
            const imageUrl = await uploadFile(image, `images/${new Date().toISOString()}`);

            // PDF URL kullanıcı tarafından manuel olarak girildiği için burada ek bir yükleme işlemi yapılmıyor.
            const pdfDownloadUrl = pdfUrl;

            await addDoc(collection(db, 'books'), {
                title,
                writer,
                publisher,
                type,
                content,
                ISBN: isbn,
                NumberPages: parseInt(numberPages, 10),
                releaseDate: parseInt(releaseDate, 10),
                imageUrl,
                pdfUrl: pdfDownloadUrl,
            });

            Alert.alert('Başarılı', 'Kitap başarıyla eklendi!');
            setTitle('');
            setWriter('');
            setPublisher('');
            setType('');
            setContent('');
            setIsbn('');
            setNumberPages('');
            setReleaseDate('');
            setImage(null);
            setPdfUrl('');
            navigation.navigate('PdfViewer', { pdfUrl: pdfDownloadUrl });
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Hata', 'Kitap eklenemedi.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Kitap İsmi" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Yazar" value={writer} onChangeText={setWriter} />
            <TextInput style={styles.input} placeholder="Yayınevi" value={publisher} onChangeText={setPublisher} />
            <TextInput style={styles.input} placeholder="Tür" value={type} onChangeText={setType} />
            <TextInput style={styles.input} placeholder="İçerik" value={content} onChangeText={setContent} />
            <TextInput style={styles.input} placeholder="ISBN" value={isbn} onChangeText={setIsbn} />
            <TextInput style={styles.input} placeholder="Sayfa Sayısı" keyboardType="numeric" value={numberPages} onChangeText={setNumberPages} />
            <TextInput style={styles.input} placeholder="Yayın Tarihi" keyboardType="numeric" value={releaseDate} onChangeText={setReleaseDate} />
            <Button title="Resim Seç" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TextInput style={styles.input} placeholder="PDF URL" value={pdfUrl} onChangeText={setPdfUrl} />
            <Button title="Kitap Ekle" onPress={handleSubmit} />
        </View>
    );
};

export default AddBook2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    image: {
        width: 150, // Genişlik artırıldı
        height: 150, // Yükseklik artırıldı
        marginTop: 10,
        marginBottom: 10,
    },
});