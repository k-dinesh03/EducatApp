import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';
import Header from '../components/header';
import { Ionicons, MaterialIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {

    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    return (
        <SafeAreaView className='w-screen h-full flex bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="light-content"
                translucent={true}
            />

            <ScrollView
                className='h-full w-full self-center -z-10 space-y-7'
                showsVerticalScrollIndicator={false}
            >
                <Header />

                <View className='flex-row justify-around'>

                    <View className='w-24 justify-center items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 rounded-full items-center justify-center pb-1 bg-yellow-400'>
                            <MaterialIcons name='category' color='#fff' size={32} />
                        </TouchableOpacity>
                        <Text>Category</Text>
                    </View>

                    <View className='w-24 justify-center items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 rounded-full items-center justify-center bg-purple-400'>
                            <Ionicons name='storefront-outline' color='#fff' size={28} />
                        </TouchableOpacity>
                        <Text>Subcriptions</Text>
                    </View>

                    <View className='w-24 justify-center items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 rounded-full items-center justify-center bg-green-400'>
                            <SimpleLineIcons name='trophy' color='#fff' size={25} />
                        </TouchableOpacity>
                        <Text>LeaderBoard</Text>
                    </View>

                </View>

                <View className='flex-row justify-around'>

                    <View className='w-24 justify-center items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 rounded-full items-center justify-center bg-orange-300'>
                            <Octicons name='video' color='#fff' size={26} />
                        </TouchableOpacity>
                        <Text>Classess</Text>
                    </View>

                    <View className='w-24 justify-center items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 rounded-full items-center justify-center bg-red-400'>
                            <MaterialIcons name='video-collection' color='#fff' size={25} />
                        </TouchableOpacity>
                        <Text>Live Course</Text>
                    </View>

                    <View className='w-24 justify-center items-center space-y-1'>
                        <TouchableOpacity
                            className='h-12 w-12 rounded-full items-center justify-center bg-slate-200 pb-2'
                            onPress={() => navigation.navigate("ChatBot")}
                        >
                            <Image source={require('../assets/images/Graduation_Cap.png')} style={styles.logo} />
                            <Text className='text-md font-medium tracking-widest absolute bottom-[6px] right-4'>Ai</Text>
                        </TouchableOpacity>
                        <Text>EduAi Assist</Text>
                    </View>

                </View>

                <View className='w-11/12 self-center flex-row items-center justify-between mt-3'>
                    <Text className='text-xl font-bold tracking-wider'>Explore New</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
                        <Text>See All</Text>
                    </TouchableOpacity>
                </View>

                <View className='w-11/12 self-center flex-row items-center justify-between mt-3'>
                    <Text className='text-xl font-bold tracking-wider'>My Learning</Text>
                    <TouchableOpacity>
                        <Text>See All</Text>
                    </TouchableOpacity>
                </View>

                <View className='w-11/12 self-center flex-row items-center justify-between mt-3'>
                    <Text className='text-xl font-bold tracking-wider'>Suggested For You</Text>
                    <TouchableOpacity>
                        <Text>See All</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    logo: {
        width: 30,
        height: 30,
    },
})