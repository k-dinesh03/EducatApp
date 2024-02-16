import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useRef } from 'react';

const OTP = () => {
    const inputRefs = Array(4).fill(0).map((_, i) => useRef(null));

    const handleKeyPress = (index, key) => {
        if (key === 'Backspace' && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleChangeText = (index, text) => {
        if (text.length > 0 && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    return (

        <ScrollView className='mt-10 w-screen'>

            <View className='w-full h-screen flex justify-center'>

                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                    translucent={true}
                />

                <SafeAreaView className='w-full h-full justify-evenly'>

                    <View className='flex items-center justify-center h-80 self-center w-80'>
                        <Image
                            className='w-full h-full'
                            source={require('../../assets/images/enterOtp.png')}
                        />
                    </View>

                    <View className='w-11/12 self-center'>
                        <Text className='font-semibold text-2xl mb-3'>Verification Code</Text>
                        <Text className='text-md'>We have sent the verification code to your email address.</Text>
                    </View>

                    <View className='flex flex-row rounded-md items-center w-11/12 self-center px-2 justify-between'>
                        {[...Array(4)].map((_, index) => (
                            <TextInput
                                key={index}
                                autoCapitalize='none'
                                maxLength={1}
                                keyboardType='numeric'
                                className='w-14 h-14 rounded-lg py-2 border border-gray-400 text-center text-xl'
                                clearButtonMode="always"
                                ref={inputRefs[index]}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                onChangeText={(text) => handleChangeText(index, text)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity className='w-11/12 self-center py-[10px] items-center bg-emerald-500 rounded-md' style={{ elevation: 3 }}>
                        <Text className='text-white text-lg font-semibold tracking-wider'>Submit</Text>
                    </TouchableOpacity>

                </SafeAreaView>
            </View>

        </ScrollView>
    )
}

export default OTP

