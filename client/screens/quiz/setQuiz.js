import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';

import { Video } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';
import QuizMenu from '../../components/quizMenu';

import { useNavigation } from '@react-navigation/native';

const SetQuiz = ({ route }) => {

    const navigation = useNavigation();

    const bottomSheetRef = useRef(null);
    const videoRef = useRef(null);
    const videoUrl = route.params?.videoUrl || '';
    const selectedOptionQuiz = route.params?.selectedOption || null;
    const [modalVisible, setModalVisible] = useState(false);

    const [indexOfQuiz, setIndexOfQuiz] = useState(null);

    const removeQuiz = (index) => {

        // Mark quiz as removed in quizTimes
        const updatedQuizTimes = [...quizTimes];
        updatedQuizTimes[index].added = false;
        updatedQuizTimes[index].questions = [];
        setQuizTimes(updatedQuizTimes);
    }

    const [quizTitle, setQuizTitle] = useState('');
    const [quizTimes, setQuizTimes] = useState([
        { hour: 0, minute: 0, second: 0, added: false, questions: [] },
        { hour: 0, minute: 0, second: 0, added: false, questions: [] },
    ]);

    const handleTimeInputChange = (quizIndex, field, value) => {
        const updatedQuizTimes = [...quizTimes];
        updatedQuizTimes[quizIndex][field] = value;
        setQuizTimes(updatedQuizTimes);
    };

    const handleQuizTimeSubmit = () => {
        navigation.navigate('Post', { quizzes: quizTimes, quizTitle: quizTitle });
    };

    return (

        <SafeAreaView className='w-screen h-full flex bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <ScrollView
                className='h-full self-center -z-10'
                style={{ width: '97%' }}
                showsVerticalScrollIndicator={false}
            >

                {selectedOptionQuiz === 'videowithquiz' && <View className='w-full h-full py-1 space-y-5 mt-2'>

                    <View className='flex-row items-center space-x-3 my-2'>
                        <Text className='font-medium tracking-widest' style={{ fontSize: 15 }}>Title : </Text>
                        <TextInput
                            autoCapitalize='none'
                            placeholder='Title of the Quiz'
                            className='py-[2px] w-3/4 rounded-sm border-b-[1px] border-gray-400'
                            clearButtonMode="always"
                            value={quizTitle}
                            onChangeText={(text) => setQuizTitle(text)}
                        />
                    </View>

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

                        <View className='space-y-4'>

                            <Text className='font-medium tracking-wide' style={{ fontSize: 15 }}>Enter Time To Add Quiz : </Text>

                            {quizTimes.map((quizTime, index) => (

                                <View className='flex-row items-center justify-around' key={index}>

                                    <View className='space-x-1 flex-row items-center'>
                                        <TextInput
                                            autoCapitalize='none'
                                            maxLength={2}
                                            keyboardType='numeric'
                                            placeholder='HH'
                                            className='w-12 h-12 rounded-lg py-2 border border-gray-400 text-center'
                                            clearButtonMode="always"
                                            value={quizTime.hour}
                                            onChangeText={(value) => handleTimeInputChange(index, 'hour', value)}
                                        />
                                        <Text className='font-bold'> : </Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            maxLength={2}
                                            keyboardType='numeric'
                                            placeholder='MM'
                                            className='w-12 h-12 rounded-lg py-2 border border-gray-400 text-center'
                                            clearButtonMode="always"
                                            value={quizTime.minute}
                                            onChangeText={(value) => handleTimeInputChange(index, 'minute', value)}
                                        />
                                        <Text className='font-bold'> : </Text>
                                        <TextInput
                                            autoCapitalize='none'
                                            maxLength={2}
                                            keyboardType='numeric'
                                            placeholder='SS'
                                            className='w-12 h-12 rounded-lg py-2 border border-gray-400 text-center'
                                            clearButtonMode="always"
                                            value={quizTime.second}
                                            onChangeText={(value) => handleTimeInputChange(index, 'second', value)}
                                        />
                                    </View>

                                    {quizTime.added ? (
                                        <View className='flex-row items-center space-x-2'>
                                            <Text style={{ fontSize: 15 }} className='bg-emerald-500 text-white px-3 py-[6px] rounded-md'>Quiz Added</Text>
                                            <TouchableOpacity className='bg-red-500 px-2 py-[6px] rounded-md' onPress={() => removeQuiz(index)}>
                                                <MaterialCommunityIcons name='close' size={20} color='white' />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            className='border-[1px] border-slate-400 px-3 py-[6px] rounded-md'
                                            onPress={() => { setModalVisible(true), setIndexOfQuiz(index) }}
                                        >
                                            <Text style={{ fontSize: 15 }}>Add Quiz</Text>
                                        </TouchableOpacity>
                                    )}

                                </View>

                            ))}

                            <QuizMenu
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                                quizIndex={indexOfQuiz}
                                quizTimes={quizTimes}
                                setQuizTimes={setQuizTimes}
                                selectedOptionQuiz={selectedOptionQuiz}
                            />

                        </View>

                    </View>

                    <TouchableOpacity
                        className='w-1/3 bg-emerald-500 py-2 items-center rounded-md self-center mb-8'
                        onPress={handleQuizTimeSubmit}
                    >
                        <Text className='text-white text-lg'>Submit</Text>
                    </TouchableOpacity>

                </View>}

                {selectedOptionQuiz === 'quiz' &&

                    <View className='w-11/12 h-full self-center py-3'>

                        <View className='w-full h-60 flex items-center justify-center border-[1px] border-gray-400 rounded-md mb-5 mt-2'>
                            <Image
                                style={{ width: '70%', height: '70%', objectFit: 'cover' }}
                                source={require("../../assets/images/Educat-logo.png")}
                            />
                        </View>

                        <Text className='text-lg font-medium tracking-wide mb-5'>Add Quiz From</Text>

                        <QuizMenu selectedOptionQuiz={selectedOptionQuiz} />

                    </View>
                }

            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default SetQuiz;

