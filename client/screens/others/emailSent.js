import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

import { firebase } from '../../config/config'
import { useNavigation } from '@react-navigation/native';

const EmailSent = () => {

    const [continueEnabled, setContinueEnabled] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const checkEmailVerification = async () => {
            try {
                const user = firebase.auth().currentUser;
                if (user) {
                    await user.reload();
                    setContinueEnabled(user.emailVerified);
                }
                else {
                    console.log('No user found.');
                }
            } catch (error) {
                console.error('Error checking email verification:', error.message);
            }
        };

        const startPeriodicCheck = () => {
            setTimeout(async () => {
                await checkEmailVerification();
                const user = firebase.auth().currentUser;
                if (user && !user.emailVerified) {
                    startPeriodicCheck();
                }
            }, 10000);
        };

        checkEmailVerification();
        startPeriodicCheck();

        // Add a listener for changes in authentication state
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            setContinueEnabled(user ? user.emailVerified : false);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();

    }, []);

    const handleResendEmail = async () => {
        try {
            await firebase.auth().currentUser.sendEmailVerification({
                handleCodeInApp: true,
                url: 'https://educat-auth.firebaseapp.com'
            });
            ToastAndroid.showWithGravityAndOffset(
                'Verification mail resent successfully',
                3000,
                ToastAndroid.BOTTOM,
                25,
                30,
            );
        }
        catch (error) {
            console.error('Error resending verification email:', error.message);
        }
    };

    const handleContinue = () => {
        if (continueEnabled) {
            navigation.navigate('SignIn');
        }
    };

    return (
        <ScrollView className='mt-10 w-screen' showsVerticalScrollIndicator={false}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                    translucent={true}
                />

                <View className='w-full h-screen'>

                    <SafeAreaView className='w-full h-full justify-center space-y-12'>

                        <View className='flex items-center justify-center h-80 self-center w-80'>
                            <Image
                                className='w-full h-full'
                                source={require('../../assets/images/emailSent.png')}
                            />
                        </View>

                        <View className='space-y-14'>

                            <View className='w-11/12 self-center flex items-center'>
                                <Text className='font-semibold text-2xl mb-3'>Email Sent</Text>
                                <Text className='text-md text-center'>A verification mail has been delivered to your email address. Please check your inbox. </Text>
                            </View>

                            <View>
                                <TouchableOpacity
                                    className={`w-11/12 self-center py-[10px] items-center rounded-md bg-emerald-500`}
                                    onPress={handleContinue}
                                >
                                    <Text className='text-white text-lg font-semibold tracking-wider'>{continueEnabled ? 'Continue' : <ActivityIndicator size={25} color='white' />}</Text>
                                </TouchableOpacity>

                                <View className='w-11/12 self-center py-[10px] flex flex-row items-center justify-center'>
                                    <Text className='text-md tracking-wider'>Not Yet Received ? </Text>
                                    <TouchableOpacity
                                        onPress={handleResendEmail}
                                    >
                                        <Text className='text-md tracking-wider text-emerald-700'>Resend Again</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>

                    </SafeAreaView>

                </View>

            </KeyboardAvoidingView>

        </ScrollView>
    )
}

export default EmailSent