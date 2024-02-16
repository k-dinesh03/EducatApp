import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { useRoute } from '@react-navigation/native'

const BottomSheetNav = ({ navigation, bottomSheetRef }) => {

    const route = useRoute();

    const snapPoints = useMemo(() => ['13%', '23%'], []);
    const renderBackdrop = useCallback((props) => {
        return <BottomSheetBackdrop appearsOnIndex={4} disappearsOnIndex={-1} {...props} />;
    }, []);

    return (

        <BottomSheet
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={true}
            style={{ display: 'flex' }}
            backdropComponent={renderBackdrop}
        >
            <View className='h-full w-11/12 self-center'>

                <View className='flex flex-row justify-between flex-wrap'>

                    {route.name === 'Home' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")}
                            className='rounded-full h-[50px] w-[50px] flex items-center justify-center bg-white border-[1px] border-gray-400'
                        >
                            <AntDesign name='home' size={26} color='gray' />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Home</Text>
                    </View>)}

                    {route.name === 'Post' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity onPress={() => navigation.navigate("Post")}
                            className='rounded-full h-[50px] w-[50px] flex items-center justify-center bg-white border-[1px] border-gray-400'
                        >
                            <Feather name='plus' size={26} color='gray' />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Post</Text>
                    </View>)}

                    {route.name === 'Messages' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ChatHome")}
                            className='rounded-full h-[50px] w-[50px] flex items-center pl-[2px] justify-center bg-white border-[1px] border-gray-400'
                        >
                            <Ionicons name='chatbox-ellipses-outline' size={26} color='gray' />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Messages</Text>
                    </View>)}

                    {route.name === 'Profile' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Profile")}
                            className='h-[50px] w-[50px] flex items-center justify-center'
                        >
                            <Image source={require("../assets/images/girl.png")} style={styles.profile} />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Profile</Text>
                    </View>)}

                    {route.name === 'Saved' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity
                            className='rounded-full h-[50px] w-[50px] flex items-center justify-center bg-white border-[1px] border-gray-400'
                        >
                            <SimpleLineIcons name='cloud-download' size={26} color='gray' />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Saved</Text>
                    </View>)}

                    {route.name === 'Collections' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity onPress={() => navigation.navigate("Collections")}
                            className='rounded-full h-[50px] w-[50px] flex items-center pl-[3px] justify-center bg-white border-[1px] border-gray-400'
                        >
                            <Ionicons name='folder-outline' size={25} color='gray' />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Collections</Text>
                    </View>)}

                    {route.name === 'Meetings' ? null : (<View className='flex items-center w-1/3 py-2'>
                        <TouchableOpacity
                            className='rounded-full h-[50px] w-[50px] flex items-center justify-center bg-white border-[1px] border-gray-400'
                        >
                            <AntDesign name='laptop' size={26} color='gray' />
                        </TouchableOpacity>

                        <Text className='font-medium tracking-wider'>Meetings</Text>
                    </View>)}

                </View>

            </View>

        </BottomSheet>

    )
}

export default BottomSheetNav

const styles = StyleSheet.create({
    profile: {
        height: '100%',
        width: '100%',
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: '#aaa',
        objectFit: 'cover'
    }
})