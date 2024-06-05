import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../Screens/Signup';
import loginPage from '../Screens/loginPage';
import ForgotPassword from '../Screens/ForgotPassword';
import Enter from '../Screens/Enter';

const Stack = createStackNavigator();
const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Enter'
            screenOptions={{ headerShown: false }}>
            <Stack.Screen

                name="Enter"
                component={Enter}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-circle-outline" size={24} color="black" />
                    ),
                }}
            />
            <Stack.Screen

                name="login"
                component={loginPage}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-circle-outline" size={24} color="black" />
                    ),
                }}
            />
            <Stack.Screen
                name="Şifremi Unuttum"
                component={ForgotPassword}
                options={{
                    headerTransparent: true,
                    headerTintColor: 'rgba(255, 255, 255, 0)'
                }}
            />
            <Stack.Screen
                name="Üye ekranı"
                component={Signup}
                options={{
                    headerTransparent: true,
                    headerTintColor: 'rgba(255, 255, 255, 0)'
                }}
            />
            <Stack.Screen
                name="Giris Sayfasi"
                component={Enter}

                options={{
                    headerTransparent: true,
                    headerTintColor: 'white',

                }}


            />

        </Stack.Navigator>
    )
}

export default AuthStack

const styles = StyleSheet.create({})