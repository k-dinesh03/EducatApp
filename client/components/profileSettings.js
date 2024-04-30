import { Modal, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Entypo, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const ProfileSettings = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View>

            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Entypo name="dots-three-vertical" size={21} color="black" style={{ marginRight: 5 }} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={()=> setModalVisible(false)}>

                <BlurView className='h-full w-full self-center items-center justify-center px-5'>

                    <View className='bg-white w-full flex-col shadow-xl shadow-black rounded-md'>

                        <TouchableOpacity className='flex-row items-center justify-between mx-5 border-b-[1px] border-slate-300 py-3' onPress={() => setModalVisible(false)}>
                            <Text className='font-medium tracking-widest text-lg'>Profile</Text>
                            <Feather name='x' size={23} color='black' />
                        </TouchableOpacity>

                        <TouchableOpacity className='flex-row items-center space-x-3 mx-5 border-b-[1px] border-slate-300 py-3'>
                            <Feather name='edit' size={23} color='black' />
                            <Text className='font-medium tracking-wide'>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className='flex-row items-center space-x-3 mx-5 border-b-[1px] border-slate-300 py-3' onPress={() => { setModalVisible(false), navigation.navigate('Settings') }}>
                            <Feather name='settings' size={24} color='black' />

                            <Text className='font-medium tracking-wide'>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className='flex-row items-center space-x-3 mx-5 border-b-[1px] border-slate-300 pt-3 pb-4'>
                            <MaterialIcons name='question-mark' size={24} color='black' />
                            <Text className='font-medium tracking-wide'>Help</Text>
                        </TouchableOpacity>

                    </View>

                </BlurView>

            </Modal>

        </View>
    )
}

export default ProfileSettings