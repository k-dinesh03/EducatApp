import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/authContext';


const Header = () => {

    const { state } = useContext(AuthContext);
    const userName = state?.user?.username;

    return (
        <View className='w-full h-48 bg-violet-400 px-3 rounded-b-3xl justify-end'>

            <View className='flex-row items-center justify-between'>

                <Text className='text-white text-3xl font-medium tracking-wider'>Hello,</Text>

                <TouchableOpacity className='h-10 w-10 rounded-full items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <Ionicons name='notifications-outline' color='#f8f8ff' size={23} />
                </TouchableOpacity>

            </View>

            <View className='flex-row items-center mb-[10px] space-x-1'>

                <Text className='text-white text-lg'>{userName}</Text>

                <Image source={require('../assets/images/hi_emoji.png')} style={styles.emoji} />

            </View>

            <View className='flex-row h-[45px] px-3 items-center justify-between border-[0.7px] border-white rounded-full mb-[10px]'>

                <TouchableOpacity>
                    <Ionicons name='search' color='#f8f8ff' size={25} />
                </TouchableOpacity>

                <TextInput
                    autoCapitalize='none'
                    placeholder='Search your topic'
                    placeholderTextColor='#f8f8ff'
                    className='w-4/5 rounded-lg text-white'
                    clearButtonMode="always"
                />

                <TouchableOpacity>
                    <Ionicons name='mic-outline' color='#f8f8ff' size={25} />
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    emoji: {
        height: 30,
        width: 30,
        objectFit: 'cover',
    }
})