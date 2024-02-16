import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Navigation from '../../components/Navigation'

const ChatHome = () => {
    return (
        <SafeAreaView className='mt-10 w-screen h-screen flex py-2'>
            <Navigation />

            <View className='w-11/12 self-center'>
                <Text className='text-xl font-semibold tracking-wide'>Recent</Text>
                <View className='flex-row space-x-3 self-center'>
                    <View className='w-16 h-16 bg-slate-400 border border-black rounded-full' />
                    <View className='w-16 h-16 bg-slate-400 border border-black rounded-full' />
                    <View className='w-16 h-16 bg-slate-400 border border-black rounded-full' />
                    <View className='w-16 h-16 bg-slate-400 border border-black rounded-full' />
                    <View className='w-16 h-16 bg-slate-400 border border-black rounded-full' />
                </View>

                <View>
                    <Text className='text-xl font-semibold tracking-wide'>Conversation:</Text>
                </View>

                <View>
                    <View className='w-full h-12 bg-slate-400 border border-black rounded-lg'/>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ChatHome