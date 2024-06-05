import { Image, ImageBackground, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

const Enter = ({ navigation }) => {
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('login');
        }, 3000);

        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [navigation, opacityAnim, scaleAnim]);

    return (
        <ImageBackground source={require('../../assets/oyle.png')} style={styles.background}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/oylesine222.png')}
                    style={styles.topImage}
                />
                <Animated.Text style={[styles.text, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
                    <Text style={styles.boldText}>Cebindeki</Text> Kütüphane
                </Animated.Text>
                <Image
                    source={require('../../assets/oylesine22.png')}
                    style={styles.image}
                />
            </View>
        </ImageBackground>
    );
}

export default Enter;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 420, // Background image width
        height: 900,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    topImage: {
        width: 180, // Adjust width as needed
        height: 200, // Adjust height as needed
        resizeMode: 'contain',
        position: 'absolute',
        top: 20,
    },
    text: {
        color: 'white',
        fontSize: 35, // Larger font size
        fontWeight: '650', // Thicker text
        textAlign: 'center',
        textShadowOffset: { width: -1, height: 1 }, // Larger shadow offset
        textShadowRadius: 30, // Wider shadow radius
        fontFamily: 'Arial',
        fontStyle: "italic",
        letterSpacing: 6, // Wider letter spacing
        marginTop: 335,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 65, // Bold text
    },
    image: {
        width: 900,
        height: 300,
        resizeMode: 'contain',
        marginTop: 200 // Contain image
    },
});
