import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native';

import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PostModal = ({ setSelectedOption }) => {

    const navigation = useNavigation();

    return (

        <View className='w-full flex-1 flex-row flex-wrap items-center justify-center rounded-md px-4 py-3 space-y-5'>

            <View className='items-center w-1/3 mb-3 space-y-1'>
                <TouchableOpacity
                    className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                    onPress={() => { setSelectedOption('videos') }}
                >
                    <Ionicons name='play-circle-outline' color='black' size={30} />
                </TouchableOpacity>
                <Text className='text-md tracking-wide'>Videos</Text>
            </View>

            <View className='items-center w-1/3 mb-3 space-y-1'>
                <TouchableOpacity
                    onPress={() => { setSelectedOption('images') }}
                    className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                >
                    <AntDesign name='picture' size={26} color='black' />
                </TouchableOpacity>
                <Text className='text-md tracking-wide'>Images</Text>
            </View>

            <View className='items-center w-1/3 mb-3 space-y-1'>
                <TouchableOpacity
                    onPress={() => { setSelectedOption('videowithquiz') }}
                    className='h-[45px] w-[45px] justify-end border-[1px] border-slate-400 rounded-md'
                >
                    <AntDesign name='bulb1' size={19} color='black' style={{ position: 'absolute', top: 2 }} />
                    <Ionicons name='play-circle-outline' color='black' size={22} style={{ alignSelf: 'flex-end' }} />
                </TouchableOpacity>
                <Text className='text-md tracking-wide'>Video & Quiz</Text>
            </View>

            <View className='items-center w-1/3 space-y-1'>
                <TouchableOpacity
                    onPress={() => { setSelectedOption('poll') }}
                    className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                >
                    <MaterialCommunityIcons name='ballot-outline' size={30} color='black' />
                </TouchableOpacity>
                <Text className='text-md tracking-wide'>Poll</Text>
            </View>

            <View className='items-center w-1/3 space-y-1'>
                <TouchableOpacity
                    onPress={() => { setSelectedOption('documents') }}
                    className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                >
                    <Ionicons name='document-text-outline' size={26} />
                </TouchableOpacity>
                <Text className='text-md tracking-wide'>Documents</Text>
            </View>

            <View className='items-center w-1/3 space-y-1'>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedOption('quiz'),
                            navigation.navigate('SetQuiz', { selectedOption: 'quiz' })
                    }}
                    className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                >
                    <AntDesign name='bulb1' size={22} />
                </TouchableOpacity>
                <Text className='text-md tracking-wide'>Quiz</Text>
            </View>

        </View>
    )
}

export default PostModal;