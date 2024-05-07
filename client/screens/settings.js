import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from 'react-native'
import React, { useContext } from 'react'


import { MaterialCommunityIcons, FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';


const Menu = () => {

    const { navigation } = useNavigation();

    const menuData = [
        {
            title: 'Saved',
            icon: <FontAwesome name='bookmark' size={26} color='#8b4baa' />,
            onPress: () => {
                console.log('Saved')
            }
        },
        {
            title: 'Account & Privacy',
            icon: <FontAwesome6 name='user-large' size={25} color='#8b4baa' />,
            onPress: () => {
                console.log('Account & Privacy')
            }
        },
        {
            title: 'Help & Support',
            icon: <View className='h-[30px] w-[30px] rounded-full bg-[#8b4baa] items-center justify-center'><FontAwesome6 name='question' size={20} color='#fff' /></View>,
            onPress: () => {
                console.log('Help & Support')
            }
        },
    ]

    return (

        <View className="h-full w-full bg-white px-4 dark:bg-neutral-900">

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <View className='pb-16 pt-3 h-full flex-col justify-between'>

                <View className='space-y-8'>

                    <View>
                        {menuData.map((menu, index) => {
                            return (
                                <View className='border-b-[1px] border-slate-400' key={index}>
                                    <TouchableWithoutFeedback onPress={menu.onPress}>
                                        <View className='flex-row items-center space-x-3 py-5'>
                                            <View className='w-12 items-center'>{menu.icon}</View>
                                            <Text className='text-black dark:text-white text-lg tracking-wide mt-1'>{menu.title}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        })}
                    </View>

                </View>



            </View>

        </View>
    )
}

export default Menu