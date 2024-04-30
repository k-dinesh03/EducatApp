import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ToastAndroid } from 'react-native'
import React, { useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { firebase } from '../../config/config'
import { useNavigation } from '@react-navigation/native'

const ForgotPassword = ({ route }) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState(null);
    const navigation = useNavigation();

    const handleInput = (value) => {
        setEmail(value);
        const validationErrors = validateEmail(value);
        setErrors(validationErrors);
    }

    const validateEmail = (email) => {
        if (!email) {
            return 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            return 'Invalid email address';
        }
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!errors) {
            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    ToastAndroid.showWithGravityAndOffset(
                        'Password reset email sent successfully',
                        2500,
                        ToastAndroid.BOTTOM,
                        25,
                        30,
                    );
                    navigation.navigate('SignIn');
                })
                .catch((err) => {
                    console.error('Error sending password reset email:', err);
                    alert("Error", "Failed to send password reset email. Please try again later.");
                });
        }
    };

    return (
        <ScrollView className='mt-10 w-screen' showsVerticalScrollIndicator={false}>

            <View className='w-full h-screen'>

                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                    translucent={true}
                />

                <SafeAreaView className='w-full h-full justify-evenly'>

                    <View className='flex items-center justify-center h-96 self-center w-96'>
                        <Image
                            className='w-full h-full'
                            source={require('../../assets/images/Forgotpassword.png')}
                        />
                    </View>

                    <View className='space-y-8'>

                        <View className='w-11/12 self-center'>
                            <Text className='font-semibold text-2xl mb-3'>Forgot Password ?</Text>
                            <Text className='text-md'>Don't worry ! It happens. Please enter the registered email address, we will send a OTP to that email.</Text>
                        </View>

                        <View className='w-11/12 self-center'>
                            <View className='flex flex-row rounded-md items-center px-2 justify-between border border-gray-400'>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="abc@gmail.com"
                                    className='w-11/12 py-2'
                                    value={email}
                                    onChangeText={(value) => handleInput(value)}
                                    clearButtonMode="always"
                                    style={{ fontSize: 15 }}
                                />
                                <Ionicons name='mail-outline' size={22} />
                            </View>
                            {errors && <Text className='text-xs text-red-500'>{errors}</Text>}
                        </View>

                        <TouchableOpacity className='w-11/12 self-center py-[10px] items-center bg-emerald-500 rounded-md' onPress={handleSubmit}>
                            <Text className='text-white text-lg font-semibold tracking-wider'>Submit</Text>
                        </TouchableOpacity>

                    </View>

                </SafeAreaView>

            </View>

        </ScrollView>

    )
}

export default ForgotPassword

