import { SafeAreaView, Text, ScrollView, StyleSheet, StatusBar, View, TouchableOpacity, KeyboardAvoidingView, Image, Alert, Dimensions, TextInput, Platform } from 'react-native';
import * as React from 'react'
import { useRef, useState } from 'react'

import { Video } from 'expo-av';

import * as ImagePicker from 'expo-image-picker'
import axios from 'axios';

import Navigation from '../../components/Navigation';
import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';

import { AntDesign, Feather, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
const windowWidth = Dimensions.get('window').width;

const Post = ({ navigation }) => {

    const bottomSheetRef = useRef(null);

    //ImagePicker
    const [images, setImages] = useState([]);

    const pickMedia = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
                multiple: true,
            });

            if (!result.canceled) {
                setImages([...images, ...result.assets.map((asset) => asset.uri)]);
            }
        }
        catch (error) {
            console.error('Error picking media:', error);
        }
    };

    const carouselRef = useRef(null);

    const removeMedia = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const [resizeModes, setResizeModes] = useState(Array(images.length).fill('contain'));

    const zoomMedia = (index) => {
        setResizeModes((prevModes) => {
            const newModes = [...prevModes];
            newModes[index] = newModes[index] === 'contain' ? 'cover' : 'contain';
            return newModes;
        });
    };

    const videoRef = React.useRef(null);

    const renderItem = ({ item, index }) => {
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
                    <Image source={{ uri: item }} style={{ width: '100%', height: '100%', resizeMode: resizeModes[index] }} />
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
    const [isSubHeader, setIsSubHeader] = useState(false);
    const [isDescription, setIsDescription] = useState(false);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (title && subtitle && description) {

            try {
                setUploading(true);

                const { data } = await axios.post("/post/create-post", { title, subtitle, description });
                setUploading(false);

                alert(data?.message);

                navigation.navigate("Home");
            }
            catch (error) {
                alert(error.response.data.message || error.message);
                setUploading(false);
                console.log(error);
            }
        }
        else {
            alert("Please fill all fields");
        }
    }

    return (
        <SafeAreaView className='w-screen h-full flex pt-10'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

                {/* Top navigation */}
                <Navigation navigation={navigation} />

                <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

                <ScrollView className='w-full h-full flex space-y-8 -z-10'>

                    <View className='self-center mt-5' style={{ width: '95%' }}>

                        <TouchableOpacity className='self-end bg-slate-300 flex flex-row items-center justify-end py-1 px-2 rounded-md z-20'>
                            <Text className='text-md mr-2'>Take a Snap</Text>
                            <SimpleLineIcons name='camera' color='#000' size={25} />
                        </TouchableOpacity>

                    </View>

                    <View className='self-center' style={{ width: '95%' }}>
                        {images.length > 0 ? (

                            <View className='w-full h-72 flex justify-between items-center relative'>

                                <Carousel
                                    layout={'default'}
                                    ref={carouselRef}
                                    data={images}
                                    sliderWidth={styles.mediaContainer.width}
                                    itemWidth={styles.mediaContainer.width}
                                    renderItem={renderItem}
                                    onSnapToItem={(index) => setActiveSlide(index)}
                                />

                                <View className='h-auto space-y-2 py-2 px-2 absolute z-40 self-end flex justify-center items-center' style={styles.videoBtnContainer}>

                                    <TouchableOpacity className='w-8 h-8 flex items-center justify-center rounded-full' style={styles.videoBtn} onPress={pickMedia}>
                                        <AntDesign name='addfile' color='white' size={18} />
                                    </TouchableOpacity>

                                    <TouchableOpacity className='w-8 h-8 flex items-center justify-center rounded-full' style={styles.videoBtn} onPress={() => zoomMedia(activeSlide)}>
                                        <MaterialIcons name='fullscreen' color='white' size={26} />
                                    </TouchableOpacity>

                                    <TouchableOpacity className='w-8 h-8 flex items-center justify-center rounded-full' style={styles.videoBtn} onPress={() => removeMedia(activeSlide)}>
                                        <Feather name='x' color='white' size={21} />
                                    </TouchableOpacity>

                                </View>

                                {images.length < 8 ? pagination_one(activeSlide) : pagination_two(activeSlide)}

                            </View>

                        ) : (

                            <View className='w-full h-72 flex items-center justify-between py-2 border-[1px] border-gray-400 rounded-md'>

                                <Text className='font-semibold text-xl tracking-wider'>Share Your Ideas</Text>

                                <Image
                                    style={{ width: '50%', height: '50%', objectFit: 'contain' }}
                                    source={require("../../assets/images/Educat-logo.png")}
                                />

                                <TouchableOpacity className='w-3/4 bg-emerald-500 py-2 items-center rounded-md' onPress={pickMedia}>
                                    <Text className='text-white text-lg'>Choose from Gallery</Text>
                                </TouchableOpacity>


                            </View>
                        )}
                    </View>

                    <View className={`w-4/5 ${isHeader ? 'h-24 py-2' : ''} px-3 py-1 self-center border-y-[1px] border-slate-400 flex justify-between`}>

                        <TouchableOpacity className='flex flex-row items-center py-1 justify-between transition-opacity duration-300' onPress={() => setIsHeader(!isHeader)} activeOpacity={0.8}>
                            <View className='flex-row items-center'>
                                <Text className='font-medium text-lg tracking-widest'>Title</Text>
                            </View>
                            <MaterialIcons name='keyboard-arrow-down' color='black' size={22} />
                        </TouchableOpacity>

                        {isHeader &&
                            <TextInput
                                autoCapitalize='none'
                                placeholder="Title/Topic"
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                                className='w-full text-md opacity-100 transition-opacity duration-300 py-1'
                                autoCorrect={true}
                                multiline={true}
                                numberOfLines={2}
                            />
                        }

                    </View>

                    <View className={`w-11/12 ${isSubHeader ? 'h-24 py-2' : ''} px-3 py-1 self-center border-y-[1px] border-slate-400 flex justify-between`}>

                        <TouchableOpacity className='flex flex-row py-1 items-center justify-between transition-opacity duration-300' onPress={() => setIsSubHeader(!isSubHeader)} activeOpacity={0.8}>
                            <View className='flex-row items-center'>
                                <Text className='font-medium text-lg tracking-widest'>Subtitle</Text>
                            </View>
                            <MaterialIcons name='keyboard-arrow-down' color='black' size={22} />
                        </TouchableOpacity>

                        {isSubHeader &&
                            <TextInput
                                autoCapitalize='none'
                                placeholder="Subtitle/Hashtags"
                                value={subtitle}
                                onChangeText={(text) => setSubtitle(text)}
                                className='w-full py-1 text-md opacity-100 transition-opacity duration-300'
                                autoCorrect={true}
                                multiline={true}
                                numberOfLines={3}
                            />
                        }
                    </View>

                    <View className={`w-4/5 ${isDescription ? 'h-24 py-2' : ''} px-3 py-1 self-center border-y-[1px] border-slate-400 flex justify-between`}>

                        <TouchableOpacity className='flex flex-row py-1 items-center justify-between transition-opacity duration-300' onPress={() => setIsDescription(!isDescription)} activeOpacity={0.8}>
                            <View className='flex-row items-center'>
                                <Text className='font-medium text-lg tracking-widest'>Description</Text>
                            </View>
                            <MaterialIcons name='keyboard-arrow-down' color='black' size={22} />
                        </TouchableOpacity>

                        {isDescription &&
                            <TextInput
                                autoCapitalize='none'
                                placeholder="Description"
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                                className='w-full py-1 text-md opacity-100 transition-opacity duration-300'
                                autoCorrect={true}
                                multiline={true}
                            />
                        }
                    </View>

                    <TouchableOpacity className='w-3/4 bg-emerald-500 py-2 items-center rounded-md self-center mb-8' onPress={handleSubmit}>
                        <Text className='text-white text-lg'>Share the Post</Text>
                    </TouchableOpacity>

                </ScrollView>

                {/* BottomSheet Navigation */}
                <BottomSheetNav bottomSheetRef={bottomSheetRef} navigation={navigation} />

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({
    videoBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    mediaContainer: {
        width: windowWidth * (11 / 11.5)
    }
})