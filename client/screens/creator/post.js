import * as React from 'react'
import { useRef, useState, useContext } from 'react'
import { SafeAreaView, Text, ScrollView, StyleSheet, StatusBar, View, ToastAndroid, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';

import { PostContext } from '../../context/postContext';

import { Video } from 'expo-av';

import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';
import PostModal from '../../components/postModal';

import { AntDesign, Feather, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const windowWidth = Dimensions.get('window').width;
const carouselWidth = windowWidth - (windowWidth * 0.03);

import { firebase } from '../../config/config';
import { useNavigation } from '@react-navigation/native';

const Post = ({ route }) => {

    //From Quiz screen
    const quizzes = route.params?.quizzes || {};
    const quizTitle = route.params?.quizTitle || '';

    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    //global state
    const { posts, setPosts } = useContext(PostContext);

    //ImagePicker
    const [images, setImages] = useState([]);
    const [maxHeight, setMaxHeight] = useState(0);

    const pickMediaGalleryImages = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [403, 384],
                allowsEditing: true,
                orderedSelection: true,
                quality: 0.75,
                multiple: true,
            });

            if (!result.canceled) {
                // Calculate the maximum height when new images are added
                const newMaxHeight = Math.max(
                    ...result.assets.map((asset) => (asset.height / asset.width) * windowWidth)
                );
                setMaxHeight(newMaxHeight);

                setImages([...images, ...result.assets.map((asset) => asset.uri)]);
            }
        }
        catch (error) {
            console.error('Error picking media from gallery : ', error);
        }
    };

    const pickMediaGalleryVideos = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                aspect: [403, 384],
                allowsEditing: true,
                orderedSelection: true,
                quality: 0.75,
                multiple: true,
            });

            if (!result.canceled) {
                // Calculate the maximum height when new images are added
                const newMaxHeight = Math.max(
                    ...result.assets.map((asset) => (asset.height / asset.width) * windowWidth)
                );
                setMaxHeight(newMaxHeight);

                setImages([...images, ...result.assets.map((asset) => asset.uri)]);
            }
        }
        catch (error) {
            console.error('Error picking media from gallery : ', error);
        }
    };

    const pickMediaCamera = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                aspect: [403, 384],
                allowsEditing: true,
                quality: 0.75,
                orderedSelection: true,
                multiple: true,
            });

            if (!result.canceled) {
                // Calculate the maximum height when new images are added
                const newMaxHeight = Math.max(
                    ...result.assets.map((asset) => (asset.height / asset.width) * windowWidth)
                );
                setMaxHeight(newMaxHeight);

                setImages([...images, ...result.assets.map((asset) => asset.uri)]);
            }

        }
        catch (error) {
            console.error('Error picking media from camera : ', error);
        }
    }

    const carouselRef = useRef(null);

    const removeMedia = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
        ToastAndroid.showWithGravityAndOffset(
            'Image have been removed',
            3000,
            ToastAndroid.BOTTOM,
            25,
            30,
        );
    };

    const videoRef = React.useRef(null);

    const renderItem = ({ item }) => {

        const isVideo = /\.(mp4|mov|avi|wmv|flv|mkv|gif)$/i.test(item);

        return (
            <View className='w-full h-full border-[1px] rounded-sm'>
                {isVideo ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: item }}
                        paused={false}
                        repeat={true}
                        style={{ width: '100%', height: '100%' }}
                        useNativeControls
                        resizeMode='contain'
                        isLooping
                    />
                ) : (
                    <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
                )}
            </View>
        );
    };

    const [activeSlide, setActiveSlide] = useState(0);

    const pagination_one = (activeSlide) => {
        return (
            <Pagination
                dotsLength={images.length}
                activeDotIndex={activeSlide}
                dotStyle={{
                    width: 25,
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
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    paddingHorizontal: 0,
                    paddingVertical: 8,
                }}
            />
        );
    };

    const pagination_two = (activeSlide) => {
        return (
            <Pagination
                dotsLength={images.length}
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

    const [isHeader, setIsHeader] = useState(false);
    const [isDescription, setIsDescription] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const [errors, setErrors] = useState({});

    const storage = firebase.storage();
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validationErrors = postValidate({ title, description, images });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

            try {
                setUploading(true);


                // Upload images to Firebase Storage
                const imageUrls = await Promise.all(images.map(async (image) => {
                    const response = await fetch(image);
                    const blob = await response.blob();

                    // Get the filename from the URI
                    let filename = image.split('/').pop();
                    const extension = filename.split('.').pop();
                    const name = filename.split('.').slice(0, -1).join('.');
                    filename = name + Date.now() + extension;

                    const storageRef = storage.ref().child(`images/${filename}`);
                    await storageRef.put(blob);
                    return storageRef.getDownloadURL();
                }));

                if (selectedOption === 'images') {
                    const { data } = await axios.post('/post/create-post', { title, description, images: imageUrls, quizzes: {}, quizTitle: null, likes: 0, rating: 0, postType: selectedOption });
                    setUploading(false);

                    setPosts([...posts, data?.post]);

                    ToastAndroid.showWithGravityAndOffset(
                        data?.message,
                        3000,
                        ToastAndroid.BOTTOM,
                        25,
                        30,
                    );

                }
                else if (selectedOption === 'videos') {
                    const { data } = await axios.post('/post/create-post', { title, description, images: imageUrls, quizzes: {}, quizTitle: null, likes: 0, rating: 0, postType: selectedOption });
                    setUploading(false);

                    setPosts([...posts, data?.post]);

                    ToastAndroid.showWithGravityAndOffset(
                        data?.message,
                        3000,
                        ToastAndroid.BOTTOM,
                        25,
                        30,
                    );

                }
                else if (selectedOption === 'videowithquiz') {
                    const { data } = await axios.post('/post/create-post', { title, description, images: imageUrls, quizzes: quizzes, quizzes: quizzes, likes: 0, rating: 0, postType: selectedOption });
                    setUploading(false);

                    setPosts([...posts, data?.post]);

                    ToastAndroid.showWithGravityAndOffset(
                        data?.message,
                        3000,
                        ToastAndroid.BOTTOM,
                        25,
                        30,
                    );

                }

                navigation.navigate("Home");
            }
            catch (error) {
                alert(error.response.data.message || error.message);
                setUploading(false);
                console.log(error);
            }
        }
    }

    const postValidate = (values) => {

        const errors = {}

        if (!values.images.length > 0) {
            errors.images = "Required";
        }
        if (!values.title) {
            errors.title = "Required";
        }
        if (!values.description) {
            errors.description = "Required";
        }

        return errors;
    }

    const carouselContainerStyles = {
        height: maxHeight,
        width: '100%'
    };


    return (
        <SafeAreaView className='flex-1 bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <ScrollView className='w-full h-full flex space-y-7 -z-10 pt-5'>

                <Text className='font-medium self-center text-lg tracking-wider'>Share Your Ideas</Text>

                {selectedOption === null && (
                    <View>

                        <View className='w-11/12 self-center h-60 flex items-center justify-center border-[1px] border-gray-400 rounded-md'>

                            <Image
                                style={{ width: '70%', height: '70%', objectFit: 'cover' }}
                                source={require("../../assets/images/Educat-logo.png")}
                            />

                        </View>
                        <PostModal setSelectedOption={setSelectedOption} />

                    </View>
                )}

                {selectedOption === 'images' &&
                    <View className='self-center' style={{ width: '97%' }}>

                        <TouchableOpacity className='self-end bg-slate-200 flex flex-row items-center space-x-2 justify-end py-1 px-2 rounded-md z-20' onPress={pickMediaCamera}>
                            <Text className='text-md'>Take a Snap</Text>
                            <SimpleLineIcons name='camera' color='#000000' size={25} />
                        </TouchableOpacity>

                    </View>
                }

                {selectedOption === 'videowithquiz' &&
                    <View className='space-y-3 self-center' style={{ width: '97%' }}>

                        <TouchableOpacity
                            className='self-center'
                            onPress={() =>
                                navigation.navigate('SetQuiz', {
                                    videoUrl: images[activeSlide],
                                    selectedOption: 'videowithquiz'
                                })
                            }
                        >
                            <Text className='text-lg underline'>Add a Quiz</Text>
                        </TouchableOpacity>
                    </View>
                }

                {selectedOption === 'images' || selectedOption === 'videos' || selectedOption === 'videowithquiz' ? (

                    <View className='self-center' style={{ width: '97%' }}>

                        {images.length > 0 ? (

                            <View className='w-full flex justify-between items-end relative'>

                                <Carousel
                                    layout={'default'}
                                    ref={carouselRef}
                                    data={images}
                                    sliderWidth={carouselWidth}
                                    itemWidth={carouselWidth}
                                    renderItem={renderItem}
                                    onSnapToItem={(index) => setActiveSlide(index)}
                                    containerCustomStyle={carouselContainerStyles}
                                />

                                <View className='h-auto space-x-1 py-2 px-[6px] absolute z-40 self-end flex-row justify-center items-center' style={styles.videoBtnContainer}>

                                    <TouchableOpacity
                                        className='w-8 h-8 flex items-center justify-center rounded-full'
                                        style={styles.videoBtn}
                                        onPress={selectedOption === 'images' ? pickMediaGalleryImages : pickMediaGalleryVideos}
                                    >
                                        <AntDesign name='addfile' color='white' size={18} />
                                    </TouchableOpacity>

                                    <TouchableOpacity className='w-8 h-8 flex items-center justify-center rounded-full' style={styles.videoBtn} onPress={() => removeMedia(activeSlide)}>
                                        <Feather name='x' color='white' size={21} />
                                    </TouchableOpacity>

                                </View>

                                {images.length < 4 ? pagination_one(activeSlide) : pagination_two(activeSlide)}

                            </View>

                        ) : (

                            <View className='w-full h-72 flex items-center justify-between py-2 border-[1px] border-gray-400 rounded-md'>

                                <Image
                                    style={{ width: '70%', height: '70%', objectFit: 'cover' }}
                                    source={require("../../assets/images/Educat-logo.png")}
                                />

                                {errors.images && <Text className='text-xs text-red-500 ml-2'>({errors.images})</Text>}

                                <TouchableOpacity
                                    className='w-3/6 bg-emerald-500 py-2 items-center rounded-md'
                                    onPress={selectedOption === 'images' ? pickMediaGalleryImages : pickMediaGalleryVideos}
                                >
                                    <Text className='text-white text-lg'>Upload from Gallery</Text>
                                </TouchableOpacity>

                            </View>
                        )}
                    </View>

                ) : null}

                <View className={`w-4/5 ${isHeader ? 'py-2' : ''} px-2 py-[6px] self-center border-y-[1px] border-slate-400 flex justify-between`}>

                    <TouchableOpacity className='flex flex-row items-center py-1 justify-between transition-opacity duration-300' onPress={() => setIsHeader(!isHeader)} activeOpacity={0.8}>
                        <View className='flex-row items-center'>
                            <Text className='font-medium text-lg tracking-widest'>Title</Text>
                            {errors.title && <Text className='text-xs text-red-500 ml-2'>({errors.title})</Text>}
                        </View>
                        <MaterialIcons name={isHeader ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color='black' size={22} />
                    </TouchableOpacity>

                    {isHeader &&
                        <TextInput
                            autoCapitalize='none'
                            placeholder="Title"
                            value={title}
                            onChangeText={(text) => setTitle(text)}
                            className='w-full text-md py-1'
                            autoCorrect={true}
                            multiline={true}
                            numberOfLines={2}
                        />
                    }

                </View>

                <View className={`w-11/12 ${isDescription ? 'py-2' : ''} px-2 py-[6px] self-center border-y-[1px] border-slate-400 flex justify-between`}>

                    <TouchableOpacity className='flex flex-row py-1 items-center justify-between transition-opacity duration-300' onPress={() => setIsDescription(!isDescription)} activeOpacity={0.8}>
                        <View className='flex-row items-center'>
                            <Text className='font-medium text-lg tracking-widest'>Description</Text>
                            {errors.description && <Text className='text-xs text-red-500 ml-2'>({errors.description})</Text>}
                        </View>
                        <MaterialIcons name={isDescription ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color='black' size={22} />
                    </TouchableOpacity>

                    {isDescription &&
                        <TextInput
                            autoCapitalize='none'
                            placeholder="Description"
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            className='w-full text-md py-1'
                            autoCorrect={true}
                            multiline={true}
                            numberOfLines={3}
                        />
                    }
                </View>

                <TouchableOpacity className='bg-emerald-500 py-2 px-6 items-center rounded-md self-center mb-8' onPress={handleSubmit}>
                    <Text className='text-white text-lg'>Share the Post</Text>
                </TouchableOpacity>

            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* BottomSheet Navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({
    videoBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
})