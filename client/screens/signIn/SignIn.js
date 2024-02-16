import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AuthContext } from '../../context/authContext';

function SignIn({ navigation }) {

    //global state
    const { state, setState } = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!email || !password) {
                setError('Please Enter a valid Email or Password');
                return;
            }

            //to login
            const { data } = await axios.post('/auth/login', { email: email, password: password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setState(data);
            await AsyncStorage.setItem('@auth', JSON.stringify(data));
            Alert.alert(data && data.message);

            // Navigate to the desired screen
            navigation.navigate('Home');
        }
        catch (error) {
            Alert.alert(error.response.data.message);
        }
    };

    //Temp function to check local storage data
    const getLocalStorageData = async () => {
        let data = await AsyncStorage.getItem('@auth');
        console.log("Local Storage : ", data);
    }
    getLocalStorageData();

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword', { email: values.current.email });
    };

    return (

        <ScrollView className='mt-10'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <View style={styles.container} className='space-y-5 mb-3'>

                <Animated.Image
                    entering={FadeInUp.duration(3000).springify().delay(200)}
                    style={styles.tinyLogo}
                    source={require("../../assets/images/Educat-logo.png")}
                />

                <Text style={styles.title}>SIGN IN</Text>

                <View>
                    <View style={styles.inputContainer} className='mt-3'>
                        <Text className='self-start mb-2'>Email</Text>
                        <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} className='flex flex-row rounded-md items-center w-full px-2 justify-between' style={styles.input}>
                            <TextInput
                                autoCapitalize='none'
                                placeholder="abc@gmail.com"
                                onChangeText={text => setEmail(text)}
                                value={email}
                                className='w-11/12 py-2'
                                clearButtonMode="always"
                                autoCorrect={false}
                            />
                            <Ionicons name='mail-outline' size={22} />
                        </Animated.View>
                    </View>

                    <View style={styles.inputContainer} className='mt-3'>
                        <Text className='self-start mb-2'>Password</Text>
                        <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} className='flex flex-row rounded-md items-center w-full px-2 justify-between' style={styles.input}>
                            <TextInput
                                autoCapitalize='none'
                                placeholder="********"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={text => setPassword(text)}
                                className='w-11/12 py-2'
                                clearButtonMode="always"
                                autoCorrect={false}
                            />
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={21}
                                onPress={() => { setShowPassword(!showPassword) }}
                            />
                        </Animated.View>
                    </View>

                    {error.length > 0 && <Text className='text-xs text-red-500'>{error}</Text>}
                </View>

                <TouchableOpacity style={styles.textContainer}>
                    <Animated.Text entering={FadeInUp.duration(3000).springify().delay(200)} style={styles.text} onPress={handleForgotPassword}>Forgot Password?</Animated.Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                    <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} style={styles.button} className='bg-emerald-500'>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Animated.View>
                </TouchableOpacity>

                <Animated.Text entering={FadeInUp.duration(3000).springify().delay(200)} style={{ color: 'grey', marginVertical: 25 }}>or continue with</Animated.Text>

                <View style={styles.authenticate}>

                    <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} className='w-full'>
                        <TouchableOpacity className='w-full border-[1px] border-gray-500 rounded-md px-2'>
                            <View className='w-3/6 flex-row self-center justify-around items-center'>
                                <Image
                                    style={styles.auth_image}
                                    source={require("../../assets/images/google.png")}
                                />
                                <Text>SignIn with Google</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} className='w-full'>
                        <TouchableOpacity className='w-full border-[1px] border-gray-500 rounded-md px-2 mt-2'>
                            <View className='w-3/6 flex-row self-center justify-around items-center'>
                                <Image
                                    style={styles.auth_image}
                                    source={require("../../assets/images/LinkedIn_icon.png")}
                                />
                                <Text>SignIn with LinkedIn</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                </View>

                <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} className='items-center'>

                    <Text>If you aren't a member, you can</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className='text-emerald-700 underline'>Register here!</Text>
                    </TouchableOpacity>

                </Animated.View>

            </View>

        </ScrollView >
    );
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    tinyLogo: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 26,
        fontWeight: '500'
    },
    inputContainer: {
        width: '90%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc'
    },
    textContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    text: {
        textAlign: 'right',
    },
    buttonContainer: {
        alignItems: 'center',
        width: '90%',
    },
    button: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    authenticate: {
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    auth_image: {
        width: 28,
        height: 28,
        marginVertical: 8
    }
});
