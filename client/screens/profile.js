import React, { useRef, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableWithoutFeedback, TouchableOpacity, View, Image, ToastAndroid, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';

import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { firebase } from '../config/config';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';

const Profile = () => {

    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();

    //global state
    const { state, setState } = useContext(AuthContext);
    const { user } = state;


    //local state
    const [username, setUsername] = useState(user?.username);
    const [password, setPassword] = useState(user?.password);
    const [dp, setDP] = useState(user?.profilePic);

    const [email] = useState(user?.email); // important to update profile pic
    const [loading, setLoading] = useState(false);


    //logout method
    const handleLogout = async () => {
        setState({
            user: null,
            token: ""
        });
        await AsyncStorage.removeItem('@auth');
        alert('User logged out successfully');
    }

    //handle update user data
    const handleUpdate = async () => {
        try {
            setLoading(true);

            const { data } = await axios.put('/auth/update-user', { username, password, email });

            setLoading(false);

            if (data) {
                const updatedUser = data.updatedUser;

                // Update local state
                setState({ ...state, user: updatedUser });

                // Update AsyncStorage with the latest user data
                await AsyncStorage.setItem('@auth', JSON.stringify({ ...state, user: updatedUser }));

                alert(data.message);
            }
            else {
                alert('No data received from the server');
            }
        }
        catch (error) {
            alert(error.response.data.message);
            setLoading(false);
            console.log(error)
        }
    }

    //pick images for profile
    const [profileImage, setProfileImage] = useState(null);

    const pickMediaGalleryImages = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [128, 128],
                allowsEditing: true,
                orderedSelection: true,
                quality: 0.75,
            });

            if (!result.canceled) {
                Alert.alert('Attention!', 'Are you sure you want to delete ?',
                    [{
                        text: 'Cancel',
                        onPress: () => {
                            result.canceled,
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
                        text: 'SET',
                        onPress: () => {
                            setProfilePic(result.assets[0].uri);
                        }
                    }]
                );
            }
        }
        catch (error) {
            console.error('Error picking media from gallery : ', error);
        }
    };

    const storage = firebase.storage();

    const setProfilePic = async (uri) => {

        setProfileImage(uri);

        try {
            setLoading(true);

            // Upload images to Firebase Storage
            const uploadImage = async (imageUrl) => {

                const response = await fetch(imageUrl);
                const blob = await response.blob();

                // Get the filename from the URI
                let filename = imageUrl.split('/').pop();
                const extension = filename.split('.').pop();
                const name = filename.split('.').slice(0, -1).join('.');
                filename = name + Date.now() + extension;

                const storageRef = storage.ref().child(`profiles/${filename}`);
                await storageRef.put(blob);
                const downloadURL = await storageRef.getDownloadURL();
                return downloadURL;
            }

            const downloadUrl = await uploadImage(profileImage);

            const { data } = await axios.put('/auth/profile-pic', { profilePic: downloadUrl, email });

            setDP(downloadUrl);
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
            alert(error.response.data.message || error.message);
            setLoading(false);
            console.log(error);
        }
    }

    const displayDP = () => {

    }

    return (
        <SafeAreaView className='w-screen h-full flex bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <ScrollView className='h-full self-center space-y-5 -z-10' style={{ width: '97%' }} showsVerticalScrollIndicator={false}>

                <View className='relative mb-12'>

                    <View className='w-3/5 h-10 self-center border-x-[1px] border-t-[1px] border-slate-400 absolute top-20 rounded-tr-md rounded-tl-md' />

                    <View className='items-center absolute top-32 left-4 w-1/3'>
                        <Text className='font-medium text-lg'>0</Text>
                        <Text className='font-semibold text-xl tracking-wider'>Explorers</Text>
                    </View>

                    <View className='items-center absolute top-32 right-4 w-1/3'>
                        <Text className='font-medium text-lg'>200</Text>
                        <Text className='font-semibold text-xl tracking-wider'>Views</Text>
                    </View>

                    <View className='w-32 h-32 rounded-full items-center bg-slate-200 self-center my-2 relative overflow-hidden'>

                        {dp === null || dp === undefined || !dp ? (
                            <Image
                                style={{ width: '100%', height: '100%', borderRadius: 100 }}
                                source={require("../assets/images/girl.png")}
                            />
                        ) : (
                            <TouchableWithoutFeedback className='w-full h-full' onPress={displayDP}>
                                <Image
                                    style={{ width: '100%', height: '100%', borderRadius: 100 }}
                                    source={{ uri: dp }}
                                />
                            </TouchableWithoutFeedback>
                        )}

                        {loading ? <View className='absolute z-50 w-full h-full items-center justify-center bg-black/10'>
                            <ActivityIndicator color='white' />
                        </View> : null}

                        <TouchableOpacity className='w-full absolute bottom-0 flex items-center z-50 bg-black/40' onPress={pickMediaGalleryImages}>
                            <FontAwesome name='edit' color='white' size={20} />
                        </TouchableOpacity>

                    </View>

                </View>

                <View className='w-full flex-row justify-around'>

                    <View className='items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md'>
                            <Ionicons name='folder-outline' size={26} color='black' />
                        </TouchableOpacity>
                        <Text className='font-medium tracking-wide'>Posts</Text>
                    </View>

                    <View className='items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md'>
                            <AntDesign name='message1' size={24} color='black' />
                        </TouchableOpacity>
                        <Text className='font-medium tracking-wide'>Chats</Text>
                    </View>

                    <View className='items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md'>
                            <Ionicons name='videocam-outline' size={27} color='black' />
                        </TouchableOpacity>
                        <Text className='font-medium tracking-wide'>Meets</Text>
                    </View>

                    <View className='items-center space-y-1'>
                        <TouchableOpacity className='h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md'>
                            <Ionicons name='call-outline' size={26} color='black' />
                        </TouchableOpacity>
                        <Text className='font-medium tracking-wide'>Calls</Text>
                    </View>

                </View>

                <View className='w-full flex-col border-[1px] border-slate-400 rounded-md'>

                    <View className='w-11/12 py-4 flex-row items-center space-x-2'>
                        <View className='mx-4'><AntDesign name='github' size={27} /></View>
                        <Text ellipsizeMode="tail">Github link</Text>
                    </View>

                    <View className='w-10/12 self-end border-b-[1px] border-slate-400' />

                    <View className='w-11/12 py-4 flex-row items-center space-x-2'>
                        <View className='mx-4'><AntDesign name='youtube' size={28} color='red' /></View>
                        <Text ellipsizeMode="tail">YouTube link</Text>
                    </View>

                    <View className='w-10/12 self-end border-b-[1px] border-slate-400' />

                    <View className='w-11/12 py-4 flex-row items-center space-x-2'>
                        <View className='mx-4'><Ionicons name='logo-linkedin' size={27} color='#0077b5' /></View>
                        <Text ellipsizeMode="tail">LinkedIn link</Text>
                    </View>

                </View>

                {/* <View className='space-y-8'>
                    <View className='flex-row w-3/5 justify-between'>
                        <Text>Name : </Text>
                        <TextInput value={username} onChangeText={(text) => setUsername(text)} className='w-32 h-8 bg-white' />
                    </View>
                    <View className='flex-row w-3/5 justify-between'>
                        <Text>Email : </Text>
                        <TextInput value={email} editable={false} />
                    </View>
                    <View className='flex-row w-3/5 justify-between'>
                        <Text>Password : </Text>
                        <TextInput value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true} className='w-32 h-8 bg-white' />
                    </View>
                    <View className='flex-row w-3/5 justify-between'>
                        <Text>UserType : </Text>
                        <TextInput value={state?.user.userType} editable={false} />
                    </View>

                    <TouchableOpacity className='bg-green-500 py-2 flex items-center' onPress={handleUpdate}>
                        <Text className='text-white text-lg'>{loading ? <ActivityIndicator /> : 'Update'}</Text>
                    </TouchableOpacity>
                </View>*/}

                <TouchableOpacity onPress={handleLogout} className='w-full py-3 bg-red-400 rounded-md flex-row items-center justify-center'>
                    <Text className='font-medium text-white text-lg'>Logout</Text>
                </TouchableOpacity>


            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Profile;
