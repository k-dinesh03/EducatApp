import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import { Alert, Modal, Text, Pressable, View, TextInput, ToastAndroid } from 'react-native';

import axios from 'axios';

const EditModal = ({ modalVisible, setModalVisible, post }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    //handle post update
    const updatePost = async (id) => {
        try {
            setLoading(true);
            const { data } = await axios.put(`/post/update-post/${id}`, { title, description });
            setLoading(false);
            ToastAndroid.showWithGravityAndOffset(
                data?.message,
                3000,
                ToastAndroid.BOTTOM,
                25,
                30,
            );
        }
        catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    //initial post data
    useEffect(() => {
        setTitle(post.title);
        setDescription(post.description);
    }, [post]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}
        >
            <View className='flex-1 items-center justify-center' style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>

                <View className='bg-white w-11/12 rounded-md px-4 pt-3 space-y-5 pb-6'>

                    <View className='flex-row justify-between items-center'>
                        <Text className='text-lg font-medium tracking-wide'>Edit Your Posts</Text>
                        <Pressable onPress={() => setModalVisible(!modalVisible)}>
                            <MaterialCommunityIcons name='close' size={20} color='black' />
                        </Pressable>
                    </View>

                    <View className='space-y-1'>
                        <Text className='text-md font-medium tracking-wide'>Title</Text>
                        <TextInput
                            className='bg-slate-200 h-9 px-2 rounded-sm'
                            value={title}
                            onChangeText={text => setTitle(text)}
                            clearButtonMode="always"
                        />
                    </View>

                    <View className='space-y-1'>
                        <Text className='text-md font-medium tracking-wide'>Description</Text>
                        <TextInput
                            className='bg-slate-200 px-2 py-1 rounded-sm text-start'
                            value={description}
                            onChangeText={text => setDescription(text)}
                            multiline={true}
                            numberOfLines={4}
                            clearButtonMode="always"
                        />
                    </View>

                    <View className='w-11/12 flex-row items-center justify-evenly self-center'>
                        <Pressable
                            className='bg-red-400 px-3 py-[6px] rounded-md items-center'
                        >
                            <Text className='text-white text-lg'>Cancel</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                updatePost(post?._id), setModalVisible(!modalVisible)
                            }}
                            className='bg-purple-400 px-3 py-[6px] rounded-md items-center'
                        >
                            <Text className='text-white text-lg'>{loading ? 'Please wait' : 'Update'}</Text>
                        </Pressable>

                    </View>
                </View>

            </View>

        </Modal>
    )
}

export default EditModal;
