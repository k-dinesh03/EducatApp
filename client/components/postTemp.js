import React, { useRef, useContext, useEffect, useState } from 'react';

import { PostContext } from '../context/postContext';
import { useNavigation } from '@react-navigation/native';

import Navigation from '../components/Navigation';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';

import { View, Text, Image, TouchableOpacity, Dimensions, ToastAndroid, SafeAreaView, StatusBar, ScrollView, TextInput, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Video } from 'expo-av';

import { AntDesign, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const carouselWidth = windowWidth - (windowWidth * 0.05);


const PostTemp = ({ route }) => {

    //from post screen
    const videoUrl = route.params?.videoUrl || '';
    const videoRef = useRef(null);
    const navigation = useNavigation();

    // from postCard component
    const postId = route.params?.postId || '';

    const bottomSheetRef = useRef(null);

    const { posts } = useContext(PostContext);
    const [currentPost, setCurrentPost] = useState(null);

    // Search for the post with the given postId
    useEffect(() => {
        if (postId) {
            const post = posts.find((post) => post._id === postId);
            setCurrentPost(post);
        }
    }, [postId, videoUrl, posts]);

    const carouselRef = useRef(null);

    // Function to check if the URL has a video extension
    const isVideoUrl = (url) => {
        if (url) {
            const videoExtensions = ['mp4', 'avi', 'mov'];
            return videoExtensions.some(ext => url.toLowerCase().includes(ext));
        }
        return false;
    };

    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        if (videoRef.current) {
            const newIsMuted = !isMuted;
            setIsMuted(newIsMuted);
            videoRef.current.setIsMutedAsync(newIsMuted);

            const toastMessage = newIsMuted ? 'Video Muted' : 'Video Unmuted';

            ToastAndroid.showWithGravityAndOffset(
                toastMessage,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                30
            );
        }
    };

    const renderItem = ({ item }) => {

        const isVideo = isVideoUrl(item);

        if (isVideo) {
            return (
                <View className='w-full h-full'>
                    <Video
                        ref={videoRef}
                        source={{ uri: item }}
                        paused={false}
                        repeat={true}
                        style={{ width: '100%', height: '100%', borderRadius: 5 }}
                        useNativeControls
                        resizeMode='contain'
                        isLooping={true}
                        isMuted={isMuted}
                    />
                    <TouchableOpacity className='absolute top-1 right-12 bg-white w-9 h-9 rounded-full flex items-center justify-center' onPress={toggleMute}>
                        {isMuted ? (
                            <SimpleLineIcons name='volume-off' size={22} color='black' />
                        ) : (
                            <SimpleLineIcons name='volume-2' size={22} color='black' />
                        )}
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            return (
                <View className='w-full h-full'>
                    <Image source={{ uri: item }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                </View>
            );
        }
    };

    const [activeSlide, setActiveSlide] = useState(0);

    const pagination_one = (activeSlide, imageLength) => {
        return (
            <Pagination
                dotsLength={imageLength}
                activeDotIndex={activeSlide}
                dotStyle={{
                    width: 20,
                    height: 3.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    marginHorizontal: 0,
                    paddingHorizontal: 0
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
                containerStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingHorizontal: 0,
                    paddingVertical: 8,
                }}
            />
        );
    };

    const pagination_two = (activeSlide, imageLength) => {
        return (
            <Pagination
                dotsLength={imageLength}
                activeDotIndex={activeSlide}
                dotStyle={{
                    width: 7,
                    height: 7,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    marginHorizontal: 0,
                    paddingHorizontal: 0
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
                containerStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingHorizontal: 0,
                    paddingVertical: 8,
                }}
            />
        );
    };

    const [isCommentOpen, setIsCommentOpen] = useState(false);

    return (
        <SafeAreaView className='w-screen h-full flex pt-10 bg-slate-50'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation navigation={navigation} />

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            <ScrollView className='h-full self-center -z-10 py-1' style={{ width: '95%' }} showsVerticalScrollIndicator={false}>

                {/* From postCard Component */}

                {currentPost ? (

                    <View className='w-full h-full space-y-3 mb-2'>

                        <Text className='font-semibold tracking-wider text-3xl'>{currentPost.title}</Text>

                        <View className='flex-row items-center justify-end space-x-1'>
                            <Text className='text-sm'>Posted by</Text>
                            <TouchableOpacity>
                                <Text className='text-sm font-medium tracking-wider'>{currentPost?.postedBy?.username}</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full h-96'>

                            <Carousel
                                layout={'default'}
                                ref={carouselRef}
                                data={currentPost?.images}
                                sliderWidth={carouselWidth}
                                itemWidth={carouselWidth}
                                renderItem={renderItem}
                                onSnapToItem={(index) => setActiveSlide(index)}
                            />

                            {currentPost?.images.length > 1 && <View className='absolute top-1 right-1 bg-white w-[42px] h-[26px] rounded-full flex items-center justify-center'>
                                <Text className='tracking-widest mb-[1px]'>{activeSlide + 1}/{currentPost?.images.length}</Text>
                            </View>}

                        </View>

                        {currentPost?.images.length < 4 ? pagination_one(activeSlide, currentPost?.images.length) : pagination_two(activeSlide, currentPost?.images.length)}

                        <View className='flex-row items-center justify-between px-2'>

                            <View className='flex-row space-x-4 items-center'>

                                <TouchableOpacity className='items-center'>
                                    <Ionicons name='heart-outline' size={26.5} color='black' />
                                </TouchableOpacity>

                                <TouchableOpacity className='items-center' onPress={() => setIsCommentOpen(!isCommentOpen)}>
                                    <Ionicons name='chatbubble-outline' size={25} color='black' style={{ transform: [{ rotate: '270deg' }] }} />
                                </TouchableOpacity>

                                <TouchableOpacity className='items-center'>
                                    <AntDesign name='sharealt' color='black' size={23.5} />
                                </TouchableOpacity>

                            </View>

                            <TouchableOpacity className='items-center'>
                                <View className='items-center'>
                                    <FontAwesome name='bookmark-o' size={23.5} color='black' />
                                </View>
                            </TouchableOpacity>

                        </View>

                        {isCommentOpen ? (
                            <View className='space-y-1 border-[1px] border-slate-300 rounded-md py-[2px] px-1 mb-2'>

                                <Text className='font-medium tracking-wider text-lg'>Comments</Text>

                                <View className='flex-row space-x-2 items-center'>

                                    <View className='h-[30px] w-[30px] rounded-full'>
                                        <Image source={require("../assets/images/girl.png")} style={styles.profilePic} />
                                    </View>

                                    <TextInput
                                        placeholder="Share your thoughts"
                                        className='py-1'
                                        clearButtonMode="always"
                                        multiline
                                    />
                                </View>

                            </View>
                        ) : (
                            <View className='space-y-1 border-[1px] border-slate-300 rounded-md py-1 px-1 mb-2'>
                                <Text className='font-medium tracking-wider text-lg'>Description</Text>
                                <Text>{currentPost.description}</Text>
                            </View>
                        )}

                    </View>

                ) : (
                    <Text className='self-center'>Loading...</Text>
                )}

            </ScrollView>

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} navigation={navigation} />

        </SafeAreaView >
    )
}

export default PostTemp

const styles = StyleSheet.create({
    profilePic: {
        height: '100%',
        width: '100%',
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: '#aaa',
        objectFit: 'cover'
    },
})