import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';

import { BlurView } from 'expo-blur';
import Progress from './progress';

const Uploading = ({ progress, image, video }) => {

    const isVideoUrl = (url) => {
        if (url) {
            const videoExtensions = ['mp4', 'avi', 'mov'];
            return videoExtensions.some(ext => url.toLowerCase().includes(ext));
        }
        return false;
    };

    return (
        <BlurView tint='systemThickMaterialLight' className='h-screen w-full absolute items-center justify-center z-10'>

            <View className='py-1 items-center justify-between w-3/4 h-44 bg-gray-400 rounded-md'>

                {isVideoUrl(video) && <Video
                    source={{ uri: video }}
                    style={{ width: '100px', height: '100px' }}
                    resizeMode='contain'
                />}

                {image && <Image source={{ uri: image }} style={{ width: 60, height: 60, marginTop: 3 }} />}

                <Text className='font-medium tracking-wider mb-1 text-white'>Uploading...</Text>

                <Progress progress={progress} />

                <View className='w-full space-y-1'>

                    <View className='h-[0.8px] w-full bg-slate-200'></View>

                    <TouchableOpacity className='w-full items-center justify-center h-10'>
                        <Text className='text-lg tracking-wider text-blue-600'>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </BlurView>
    )
}

export default Uploading