import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions, StatusBar } from 'react-native'
import React, { useContext, useState } from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';


const windowWidth = Dimensions.get("window").width;
const byteWidth = (windowWidth / 2.23);


const HomeCategories = () => {

    const navigation = useNavigation();

    const categories = [
        {
            url: require('../../assets/images/4.jpg'),
            title: 'Mobile App Development'
        },
        {
            url: require('../../assets/images/3.jpg'),
            title: 'Web Development'
        },
        {
            url: require('../../assets/images/2.jpg'),
            title: 'Analytics'
        },
        {
            url: require('../../assets/images/1.jpg'),
            title: 'UI/UX'
        },

    ]

    return (
        <View className='w-screen h-full bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <ScrollView showsVerticalScrollIndicator={false} className='h-full w-full pt-5'>

                <View className='h-full flex-row justify-between flex-wrap px-3'>
                    {categories.map((category, index) => {
                        return (
                            <View className='h-[150px] flex-col items-center mb-12 space-y-1' style={{ width: byteWidth }} key={index}>
                                <TouchableWithoutFeedback>
                                    <Image
                                        source={category.url}
                                        style={{ borderRadius: 5, height: '100%', width: '100%' }}
                                        resizeMode='cover'
                                    />
                                </TouchableWithoutFeedback>
                                <View className='flex-row justify-between px-1 w-full'>
                                    <Text className='text-black tracking-wider'>{category.title}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>

            </ScrollView>

        </View>
    )
}

export default HomeCategories