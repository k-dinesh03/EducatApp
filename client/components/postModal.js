import React, { useState } from 'react'
import { Modal, Text, Pressable, View, TouchableOpacity } from 'react-native';

import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const PostModal = ({ setSelectedOption }) => {

    const [modalVisible, setModalVisible] = useState(true);
    const navigation = useNavigation();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible)
            }}
        >
            <BlurView tint='systemThickMaterialLight' className='flex-1 items-center justify-center'>

                <View className='bg-white w-5/6 rounded-md px-4 pt-3 pb-5 space-y-5 shadow-xl shadow-black'>

                    <View className='flex-row justify-between items-center'>
                        <Text className='text-lg font-medium tracking-wide'>Share Your Ideas as :</Text>
                        <Pressable onPress={() => setModalVisible(!modalVisible)}>
                            <MaterialCommunityIcons name='close' size={20} color='black' />
                        </Pressable>
                    </View>

                    <View className='flex-row flex-wrap w-full'>

                        <View className='items-center w-1/3 mb-4 space-y-1'>
                            <TouchableOpacity
                                className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                                onPress={() => { setSelectedOption('videos'), setModalVisible(false) }}
                            >
                                <Ionicons name='play-circle-outline' color='black' size={30} />
                            </TouchableOpacity>
                            <Text className='text-md tracking-wide'>Videos</Text>
                        </View>

                        <View className='items-center w-1/3 mb-4 space-y-1'>
                            <TouchableOpacity
                                onPress={() => { setSelectedOption('images'), setModalVisible(false) }}
                                className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            >
                                <AntDesign name='picture' size={26} color='black' />
                            </TouchableOpacity>
                            <Text className='text-md tracking-wide'>Images</Text>
                        </View>

                        <View className='items-center w-1/3 mb-4 space-y-1'>
                            <TouchableOpacity
                                onPress={() => { setSelectedOption('videowithquiz'), setModalVisible(false) }}
                                className='h-[45px] w-[45px] justify-end border-[1px] border-slate-400 rounded-md'
                            >
                                <AntDesign name='bulb1' size={19} color='black' style={{ position: 'absolute', top: 2 }} />
                                <Ionicons name='play-circle-outline' color='black' size={22} style={{ alignSelf: 'flex-end' }} />
                            </TouchableOpacity>
                            <Text className='text-md tracking-wide'>Video & Quiz</Text>
                        </View>

                        <View className='items-center w-1/3 space-y-1'>
                            <TouchableOpacity
                                onPress={() => { setSelectedOption('poll'), setModalVisible(false) }}
                                className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            >
                                <MaterialCommunityIcons name='ballot-outline' size={30} color='black' />
                            </TouchableOpacity>
                            <Text className='text-md tracking-wide'>Poll</Text>
                        </View>

                        <View className='items-center w-1/3 space-y-1'>
                            <TouchableOpacity
                                onPress={() => { setSelectedOption('documents'), setModalVisible(false) }}
                                className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            >
                                <Ionicons name='document-text-outline' size={26} />
                            </TouchableOpacity>
                            <Text className='text-md tracking-wide'>Documents</Text>
                        </View>

                        <View className='items-center w-1/3 space-y-1'>
                            <TouchableOpacity
                                onPress={() => { setSelectedOption('quiz'), setModalVisible(false) }}
                                className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            >
                                <AntDesign name='bulb1' size={22} />
                            </TouchableOpacity>
                            <Text className='text-md tracking-wide'>Quiz</Text>
                        </View>

                    </View>

                </View>

            </BlurView>

        </Modal>
    )
}

export default PostModal;