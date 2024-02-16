import React, { useRef, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Navigation from '../components/Navigation';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';

import { AuthContext } from '../context/authContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {

    const bottomSheetRef = useRef(null)

    //global state
    const { state, setState } = useContext(AuthContext);
    const { user } = state;

    //local state
    const [username, setUsername] = useState(user?.username);
    const [password, setPassword] = useState(user?.password);
    const [email] = useState(user?.email);
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

    return (
        <SafeAreaView className='w-screen h-full flex pt-10'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation navigation={navigation} />

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            <ScrollView className='h-full self-center space-y-10 -z-10' style={{ width: '95%' }}>

                <View className='space-y-8'>
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

                    <TouchableOpacity className='flex-row w-3/5 justify-between' onPress={handleUpdate}>
                        <Text>{loading ? 'Please wait' : 'Update Profile'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleLogout}>
                    <Text className='font-medium'>Logout</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} navigation={navigation} />

        </SafeAreaView>
    );
};

export default Profile;
