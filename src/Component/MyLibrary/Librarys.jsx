import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Text, View, Dimensions, TouchableOpacity, Animated } from 'react-native';

const { width, height } = Dimensions.get("window");

function Librarys({ name, imageSource, color, backgroundColor, logo, pres }) {
    const [scaleValue] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={pres}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: backgroundColor || "#f2f2f5",
                    borderRadius: 19,
                    height: height * 0.55,
                    width: width * 0.7,
                    marginVertical: 10,
                    shadowColor: "black",
                    shadowOffset: { width: 3, height: 7 },
                    shadowOpacity: 0.27,
                    shadowRadius: 4.65,
                    elevation: 6,
                    transform: [{ scale: scaleValue }],
                    marginRight: 16,
                    marginLeft: 16,
                    justifyContent: 'center'
                }}
            >
                <Image
                    style={{
                        height: height * 0.30,
                        width: height * 0.40,
                        borderRadius: 7,
                        marginBottom: 20,
                    }}
                    source={imageSource}
                />
                <Text
                    style={{
                        color: color || '#333',
                        fontSize: 26,
                        fontWeight: "700",
                        textAlign: "center",
                        marginBottom: 40,
                    }}
                >
                    {name}
                </Text>
                {/* <View style={{ marginTop: 10 }}>
                    {logo}
                </View> */}
            </Animated.View>
        </TouchableOpacity>
    );
}

export default Librarys;
