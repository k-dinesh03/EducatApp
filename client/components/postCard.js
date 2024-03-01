import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ToastAndroid, Alert } from 'react-native'
import React, { useRef, useState, useCallback, createRef, useContext } from 'react'
import moment from 'moment';
import axios from 'axios';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Video } from 'expo-av';

import { MaterialCommunityIcons, FontAwesome, Ionicons, SimpleLineIcons, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import EditModal from './editModal';
import { AuthContext } from '../context/authContext';

const windowWidth = Dimensions.get('window').width;
const carouselWidth = windowWidth - (windowWidth * 0.05);

const PostCard = ({ posts }) => {

    const navigation = useNavigation();
    const { state } = useContext(AuthContext);
    const userId = state?.user?._id;

    const carouselRef = useRef(null);
    const videoRef = React.useRef(null);
    const likeItRefs = useRef(posts.map(() => createRef(null)));

    const handleLikes = useCallback((index) => ({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            toggleLike(posts[index]?._id);
        }
    }, [posts, toggleLike]);

    // Function to check if the URL has a video extension
    const isVideoUrl = (url) => {
        if (url) {
            const videoExtensions = ['mp4', 'avi', 'mov'];
            return videoExtensions.some(ext => url.toLowerCase().includes(ext));
        }
        return false;
    };

    const [savedPosts, setSavedPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const toggleSave = (postId) => {
        setSavedPosts((prevSavedPosts) => {
            if (prevSavedPosts.includes(postId)) {
                ToastAndroid.showWithGravityAndOffset(
                    'You Unsaved the post',
                    3000,
                    ToastAndroid.BOTTOM,
                    25,
                    30,
                );
                return prevSavedPosts.filter((id) => id !== postId);
            }
            else {
                ToastAndroid.showWithGravityAndOffset(
                    'You Saved the post',
                    3000,
                    ToastAndroid.BOTTOM,
                    25,
                    30,
                );
                return [...prevSavedPosts, postId];
            }
        });
    };

    const isPostSaved = (postId) => savedPosts.includes(postId);

    const toggleLike = (postId) => {
        setLikedPosts((prevLikedPosts) => {
            if (prevLikedPosts.includes(postId)) {
                ToastAndroid.showWithGravityAndOffset(
                    'You Disliked the post',
                    3000,
                    ToastAndroid.BOTTOM,
                    25,
                    30,
                );
                return prevLikedPosts.filter((id) => id !== postId);
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    'You Liked the post',
                    3000,
                    ToastAndroid.BOTTOM,
                    25,
                    30,
                );
                return [...prevLikedPosts, postId];
            }
        });
    };

    const isPostLiked = (postId) => likedPosts.includes(postId);

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

        if (isVideoUrl(item)) {
            return (
                <View className='w-full h-full'>
                    <Video
                        ref={videoRef}
                        source={{ uri: item }}
                        paused={false}
                        repeat={true}
                        style={{ width: '100%', height: '100%' }}
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
                    <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
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

    const [selectPostMenu, setSelectPostMenu] = useState([]);

    const togglePostMenu = (postId) => {
        setSelectPostMenu((prevSelectPostMenu) => {
            return { ...prevSelectPostMenu, [postId]: !prevSelectPostMenu[postId] };
        });
    }

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [post, setPost] = useState({});

    const handleDeleteAlert = (id) => {
        Alert.alert('Attention!', 'Are you sure you want to delete ?',
            [{
                text: 'Cancel',
                onPress: () => {
                    ToastAndroid.showWithGravityAndOffset(
                        'Canceled',
                        3000,
                        ToastAndroid.BOTTOM,
                        25,
                        30,
                    );
                }
            },
            {
                text: 'Delete',
                onPress: () => {
                    handleDeletePost(id);
                }
            }]
        );
    }

    const handleDeletePost = async (id) => {
        try {
            setLoading(true);
            const { data } = await axios.delete(`/post/delete-post/${id}`);
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


    return (
        <View className='h-full w-full my-[5px]'>

            <EditModal modalVisible={modalVisible} setModalVisible={setModalVisible} post={post} />

            {posts.map((post, i) => {

                const postId = post?._id;

                return (
                    <View className='w-full mb-1 border-[1px] border-slate-300 rounded-md' key={i} >

                        <View className='w-full flex-row justify-between items-center p-1'>

                            <View className='flex-row items-center space-x-2'>

                                <View className='h-[55px] w-[55px] rounded-full'>
                                    <Image source={require("../assets/images/girl.png")} style={styles.profilePic} />
                                </View>

                                <View className='space-y-1'>
                                    <TouchableOpacity>
                                        <Text className='font-medium tracking-wider'>{post?.postedBy?.username}</Text>
                                    </TouchableOpacity>

                                    <View className='flex flex-row items-center space-x-2'>
                                        <Text>100 Likes</Text>
                                        <View className='w-[1px] h-4 bg-black self-end'></View>
                                        <Text>
                                            {moment(post?.createdAt).isBefore(moment().subtract(7, 'days'))
                                                ? moment(post?.createdAt).format('DD MMM, YYYY')
                                                : moment(post?.createdAt).fromNow()
                                            }
                                        </Text>
                                    </View>
                                </View>

                            </View>

                            <TouchableOpacity onPress={() => togglePostMenu(postId)}>
                                {selectPostMenu[postId] ? (
                                    <MaterialCommunityIcons name='close' size={20} color='black' style={{ marginRight: 4 }} />
                                ) : (
                                    <MaterialCommunityIcons name='dots-vertical' size={28} color='black' />
                                )}
                            </TouchableOpacity>

                        </View>

                        {selectPostMenu[postId] &&
                            <Animated.View entering={FadeInUp.duration(3000).springify().delay(200)} className='w-full h-auto flex-row items-center justify-between py-[2px] px-1 my-1'>

                                {post?.postedBy?._id === userId && <TouchableOpacity className='px-3 flex-row items-center h-9 space-x-1 rounded-full bg-slate-200' onPress={() => { setPost(post), setModalVisible(true) }}>
                                    <Feather name='edit' color='black' size={18} />
                                    <Text>Edit</Text>
                                </TouchableOpacity>}

                                {post?.postedBy?._id === userId && <TouchableOpacity className='px-3 flex-row items-center h-9 space-x-1 rounded-full bg-slate-200' onPress={() => handleDeleteAlert(postId)}>
                                    <AntDesign name='delete' color='black' size={18} />
                                    <Text>Delete</Text>
                                </TouchableOpacity>}

                                {post?.postedBy?._id === userId ? null : <TouchableOpacity className='px-3 flex-row items-center h-9 space-x-1 rounded-full bg-slate-200'>
                                    <AntDesign name='user' color='black' size={17} />
                                    <Text>Connect</Text>
                                </TouchableOpacity>}

                                <TouchableOpacity className='px-3 flex-row items-center h-9 space-x-1 rounded-full bg-slate-200'>
                                    <Feather name='link' color='black' size={17} />
                                    <Text>Copy Link</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className='px-3 flex-row items-center h-9 space-x-1 rounded-full bg-slate-200'>
                                    <AntDesign name='sharealt' color='black' size={18} />
                                    <Text>Share</Text>
                                </TouchableOpacity>

                                {post?.postedBy?._id === userId ? null : <TouchableOpacity className='px-3 flex-row items-center h-9 space-x-1 rounded-full bg-slate-200'>
                                    <MaterialIcons name='report-gmailerrorred' color='red' size={22} />
                                    <Text className='text-red-600'>Report</Text>
                                </TouchableOpacity>}

                            </Animated.View>
                        }

                        <View className='w-full h-96 my-1'>

                            <TapGestureHandler
                                ref={likeItRefs.current[i]}
                                onHandlerStateChange={handleLikes(i)}
                                numberOfTaps={2}
                            >
                                <Carousel
                                    layout={'default'}
                                    ref={carouselRef}
                                    data={post?.images}
                                    sliderWidth={carouselWidth}
                                    itemWidth={carouselWidth}
                                    renderItem={renderItem}
                                    onSnapToItem={(index) => setActiveSlide(index)}
                                />
                            </TapGestureHandler>

                            <TouchableOpacity className='absolute top-1 right-1 bg-white w-9 h-9 rounded-full flex items-center justify-center' onPress={() => toggleLike(postId)}>
                                {isPostLiked(postId) ? (
                                    <Ionicons name='heart-sharp' size={24} color='black' />
                                ) : (
                                    <Ionicons name='heart-outline' size={24} color='black' />
                                )}
                            </TouchableOpacity>

                            {post?.images.length > 1 && <View className='absolute top-1 left-1 bg-white w-[42px] h-[26px] rounded-full flex items-center justify-center'>
                                <Text className='tracking-widest mb-[1px]'>{activeSlide + 1}/{post?.images.length}</Text>
                            </View>}

                        </View>

                        {post?.images.length < 4 ? pagination_one(activeSlide, post?.images.length) : pagination_two(activeSlide, post?.images.length)}

                        <View className='space-x-4 flex flex-row items-center px-[5px] my-2'>

                            <TouchableOpacity onPress={() => toggleSave(postId)}>
                                {isPostSaved(postId) ? (
                                    <View className='items-center'>
                                        <FontAwesome name='bookmark' size={25} color='black' />
                                        <Text className='text-md'>Saved</Text>
                                    </View>
                                ) : (
                                    <View className='items-center'>
                                        <FontAwesome name='bookmark-o' size={25} color='black' />
                                        <Text className='text-md'>Save</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <View className='w-[1.5px] h-[40px] bg-black'></View>

                            <Text
                                className='font-semibold tracking-wider text-2xl'
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                onPress={() =>
                                    navigation.navigate('PostTemp', {
                                        postId,
                                    })
                                }
                            >
                                {post?.title}
                            </Text>

                        </View>

                    </View>
                )
            })}

            {(!posts || posts.length === 0) &&
                <View>
                    <Text className='self-center'>Fetching Posts</Text>
                </View>
            }

        </View >
    )
}

export default PostCard

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