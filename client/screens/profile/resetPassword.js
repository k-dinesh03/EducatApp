import { View, Text, TextInput, StyleSheet, StatusBar, SafeAreaView, ToastAndroid, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';
import { Ionicons } from '@expo/vector-icons';
import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';

import Validate from './validatePassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ResetPassword = () => {

    const bottomSheetRef = useRef(null);

    //global state
    const { state, setState } = useContext(AuthContext);
    const { user } = state;

    const [email] = useState(user?.email); // important to update profile pic
    const [loading, setLoading] = useState(false);


    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [CurrentPassword, setCurrentPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');


    const [errors, setErrors] = useState({});

    const handleValidation = () => {
        const validationErrors = Validate({ CurrentPassword, NewPassword, ConfirmPassword });
        setErrors(validationErrors);
    }

    const handleLogout = async () => {
        setState({
            user: null,
            token: "",
        });
        await AsyncStorage.removeItem("Educat");
        ToastAndroid.showWithGravityAndOffset(
            "Logged Out Successfully",
            2500,
            ToastAndroid.BOTTOM,
            25,
            30
        );
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            handleValidation();

            if (errors.length > 0) return;

            const { data } = await axios.put("/auth/update-user", {
                ConfirmPassword,
                email,
            });

            setLoading(false);

            if (data) {
                const updatedUser = data.updatedUser;

                // Update local state
                setState({ ...state, user: updatedUser });

                // Update AsyncStorage with the latest user data
                await AsyncStorage.setItem(
                    "Educat",
                    JSON.stringify({ ...state, user: updatedUser })
                );

                ToastAndroid.showWithGravityAndOffset(
                    data?.message,
                    2500,
                    ToastAndroid.BOTTOM,
                    25,
                    30
                );

                handleLogout();
            }
            else {
                console.log("No data received from the server");
            }
        }
        catch (error) {
            setLoading(false);
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (

        <SafeAreaView className="w-screen h-full flex bg-white">

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <View className="flex-col items-center h-full self-center space-y-5 -z-10" style={{ width: "95%" }}>

                <View className='flex-row w-full justify-between self-center'>

                    <View style={styles.inputContainer} className='mt-3'>
                        <Text className='self-start mb-2 font-medium tracking-wider text-lg'>Current Password</Text>
                        <View className='flex flex-row rounded-md items-center w-full px-2 justify-between' style={styles.input}>
                            <TextInput
                                autoCapitalize='none'
                                placeholder="********"
                                secureTextEntry={!showCurrentPassword}
                                className='py-2 w-11/12'
                                clearButtonMode="always"
                                autoCorrect={false}
                                value={CurrentPassword}
                                onChangeText={(text) => setCurrentPassword(text)}
                                autoFocus
                            />
                            <Ionicons
                                name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={21}
                                onPress={() => { setShowCurrentPassword(!showCurrentPassword) }}
                            />
                        </View>
                    </View>

                    {errors?.currentPassword && <Text className='self-start text-red-500 text-xs '>{errors?.currentPassword}</Text>}

                </View>


                <View className='flex-row w-full justify-between self-center'>

                    <View style={styles.inputContainer} className='mt-3'>
                        <Text className='self-start mb-2 font-medium tracking-wider text-lg'>New Password</Text>
                        <View className='flex flex-row rounded-md items-center w-full px-2 justify-between' style={styles.input}>
                            <TextInput
                                autoCapitalize='none'
                                placeholder="********"
                                secureTextEntry={!showNewPassword}
                                className='py-2 w-11/12'
                                clearButtonMode="always"
                                autoCorrect={false}
                                value={NewPassword}
                                onChangeText={(text) => setNewPassword(text)}
                            />
                            <Ionicons
                                name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={21}
                                onPress={() => { setShowNewPassword(!showNewPassword) }}
                            />
                        </View>
                    </View>

                    {errors?.newPassword && <Text className='self-start text-red-500 text-xs '>{errors?.newPassword}</Text>}

                </View>


                <View className='flex-row w-full justify-between self-center mb-10'>

                    <View style={styles.inputContainer} className='mt-3'>
                        <Text className='self-start mb-2 font-medium tracking-wider text-lg'>Current Password</Text>
                        <View className='flex flex-row rounded-md items-center w-full px-2 justify-between' style={styles.input}>
                            <TextInput
                                autoCapitalize='none'
                                placeholder="********"
                                secureTextEntry={!showCurrentPassword}
                                className='py-2 w-11/12'
                                clearButtonMode="always"
                                autoCorrect={false}
                                value={ConfirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                            />
                            <Ionicons
                                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={21}
                                onPress={() => { setShowConfirmPassword(!showConfirmPassword) }}
                            />
                        </View>
                    </View>

                    {errors?.confirmPassword && <Text className='self-start text-red-500 text-xs '>{errors?.confirmPassword}</Text>}

                </View>


                <View className="py-2 flex items-center rounded-md bg-emerald-500 w-full">
                    <TouchableWithoutFeedback onPress={handleUpdate}>
                        <Text className="text-white text-lg">{loading ? <ActivityIndicator size={25} color='white' /> : 'Change Password'}</Text>
                    </TouchableWithoutFeedback>
                </View>

            </View>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    )
}

export default ResetPassword

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc'
    }
});