import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Text } from 'react-native'

import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const MenuBtn = ({ handleOpen }) => {

    const navigation = useNavigation();

    return (
        <View>

            <TouchableOpacity
                className='h-[45px] w-[45px] items-center justify-start border-[1px] border-slate-400 bg-white rounded-full py-[3px] absolute bottom-[75px] right-4'
                onPress={() => navigation.navigate("ChatBot")}
            >
                <Image source={require('../assets/images/Graduation_Cap.png')} style={styles.logo} />
                <Text className='text-md font-medium tracking-widest absolute bottom-[3px]'>Ai</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className='rounded-full h-[55px] w-[55px] flex items-center justify-center bg-white border-[1px] border-gray-400 absolute bottom-3 right-3'
                onPress={handleOpen}
            >
                <AntDesign name='appstore-o' size={26} color='black' />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 32,
        height: 32,
    }
});

export default MenuBtn;