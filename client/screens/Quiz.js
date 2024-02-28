import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View, TouchableOpacity, TextInput } from 'react-native';

import { Video } from 'expo-av';

import Navigation from '../components/Navigation';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';
import QuizModal from '../components/quizModal';

const Quiz = ({ route }) => {

    const bottomSheetRef = useRef(null);
    const videoRef = useRef(null);
    const videoUrl = route.params?.videoUrl || '';
    const [modalVisible, setModalVisible] = useState(false);

    const handleQuizSubmit = () => {
        console.log("Submitted Quiz");
    };

    const [hourInput, setHourInput] = useState('');
    const [minuteInput, setMinuteInput] = useState('');
    const [secondInput, setSecondInput] = useState('');

    const handleTimeInputChange = (field, value) => {
        switch (field) {
            case 'hour':
                setHourInput(value);
                break;
            case 'minute':
                setMinuteInput(value);
                break;
            case 'second':
                setSecondInput(value);
                break;
            default:
                break;
        }
    };

    return (

        <SafeAreaView className='w-screen h-full flex pt-10 bg-slate-100'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation />

            <ScrollView
                className='h-full self-center -z-10'
                style={{ width: '95%' }}
                showsVerticalScrollIndicator={false}
            >

                <View className='w-full h-full py-1 space-y-3'>

                    <Text className='self-center text-lg font-semibold tracking-wider'>Make a Quiz</Text>

                    <View className='w-full h-96 border-[1px] border-slate-400 rounded-sm mb-3'>

                        <Video
                            ref={videoRef}
                            source={{ uri: videoUrl }}
                            paused={false}
                            repeat={true}
                            style={{ width: '100%', height: '100%', borderRadius: 5 }}
                            useNativeControls
                            resizeMode='contain'
                            isLooping={true}
                        />

                    </View>

                    <View className='w-full space-y-6 px-[10px] pb-8'>


                        <View className='flex-row items-center'>
                            <Text className='font-medium tracking-widest' style={{ fontSize: 15 }}>Time Duration : </Text>
                            <Text style={{ fontSize: 15 }}>2 Mins</Text>
                        </View>

                        <View className='space-y-3'>

                            <Text className='font-medium tracking-wide' style={{ fontSize: 15 }}>Enter Time To Add Quiz : </Text>

                            <View className='flex-row items-center justify-around'>

                                <View className='space-x-1 flex-row items-center'>
                                    <TextInput
                                        autoCapitalize='none'
                                        maxLength={2}
                                        keyboardType='numeric'
                                        placeholder='HH'
                                        className='w-12 h-12 rounded-lg py-2 border border-gray-400 text-center'
                                        clearButtonMode="always"
                                        value={hourInput}
                                        onChangeText={(value) => handleTimeInputChange('hour', value)}
                                    />
                                    <Text className='font-bold'> : </Text>
                                    <TextInput
                                        autoCapitalize='none'
                                        maxLength={2}
                                        keyboardType='numeric'
                                        placeholder='MM'
                                        className='w-12 h-12 rounded-lg py-2 border border-gray-400 text-center'
                                        clearButtonMode="always"
                                        value={minuteInput}
                                        onChangeText={(value) => handleTimeInputChange('minute', value)}
                                    />
                                    <Text className='font-bold'> : </Text>
                                    <TextInput
                                        autoCapitalize='none'
                                        maxLength={2}
                                        keyboardType='numeric'
                                        placeholder='SS'
                                        className='w-12 h-12 rounded-lg py-2 border border-gray-400 text-center'
                                        clearButtonMode="always"
                                        value={secondInput}
                                        onChangeText={(value) => handleTimeInputChange('second', value)}
                                    />
                                </View>

                                <TouchableOpacity
                                    className='border-[1px] border-slate-400 px-3 py-[6px] rounded-md'
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text style={{ fontSize: 15 }}>Add Quiz</Text>
                                </TouchableOpacity>

                            </View>

                            <QuizModal
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />

                        </View>

                    </View>

                    <TouchableOpacity
                        className='w-3/5 bg-emerald-500 py-2 items-center rounded-md self-center mb-8'
                        onPress={handleQuizSubmit}
                    >
                        <Text className='text-white text-lg'>Submit</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Quiz;

