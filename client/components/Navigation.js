import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const Navigation = () => {

    const navigation = useNavigation();

    return (

        <View className='w-full h-16 flex items-center justify-center'>

            <View className='h-[58px] rounded-md border-[1px] border-gray-400 flex flex-row justify-between items-center px-[8px]' style={{ width: '97%' }}>

                <View className='flex flex-row items-start w-24 h-14'>
                    <Image source={require('../assets/images/Graduation_Cap.png')} style={styles.logo} />
                    <Text className='text-xl font-semibold tracking-widest absolute bottom-0 right-0'>EDUCAT</Text>
                </View>

                <View className='flex-row h-full items-center space-x-4'>
                    <TouchableOpacity>
                        <Ionicons name='notifications-outline' size={27} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <AntDesign name='search1' size={27} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>

    );
};

export default Navigation;

const styles = StyleSheet.create({
    logo: {
        width: 45,
        height: 45,
    },
})