import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';

const AddAuthor = () => {
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadFile = async (uri, filePath) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileRef = ref(storage, filePath);
        await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(fileRef);
        return downloadURL;
    };

    const handleSubmit = async () => {
        if (!name || !about || !image) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        try {
            const imageUrl = await uploadFile(image, `authors/${new Date().toISOString()}`);

            await addDoc(collection(db, 'authors'), {
                name,
                about,
                imageUrl,
                timestamp: serverTimestamp()
            });

            Alert.alert('Başarılı', 'Yazar başarıyla eklendi!');
            setName('');
            setAbout('');
            setImage(null);
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Hata', 'Yazar eklenemedi.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Yazar İsmi" value={name} onChangeText={setName} />
            <TextInput
                style={styles.input}
                placeholder="Hakkında"
                value={about}
                onChangeText={setAbout}
                multiline
            />
            <Button title="Resim Seç" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Button title="Yazar Ekle" onPress={handleSubmit} />
        </View>
    );
};

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
        width: 100,
        height: 100,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default AddAuthor;
