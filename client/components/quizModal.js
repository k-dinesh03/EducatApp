import React, { useState } from 'react'
import { Modal, Text, Pressable, View, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import { Feather, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const QuizModal = ({ modalVisible, setModalVisible, setQuestions, questions, quizIndex, quizTimes, setQuizTimes }) => {

    const [urlField, setUrlField] = useState(false);
    const [categories, setCategories] = useState(false);

    const [difficulty, setDifficulty] = useState('');
    const [amount, setAmount] = useState('');

    const data = [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
    ];
    const handleDropdownChange = (selectedValue) => {
        setDifficulty(selectedValue.value);
    };

    const generateQuesError = (amount, difficulty) => {
        if (!amount) {
            Alert.alert('Fill the fields', 'Please Enter a valid inputs');
            return false;
        }
        if (amount < 3 || amount > 20) {
            Alert.alert('Fill the fields', 'Please Enter a number of questions you want between 3 and 20');
            return false;
        }
        if (!difficulty) {
            Alert.alert('Fill the fields', 'Please Select a difficulty level');
            return false;
        }
        return true;
    }

    const generateQuestions = async () => {

        if (generateQuesError(amount, difficulty)) {
            try {
                const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple`);
                const data = await response.json();

                // Save questions in the correct index
                const updatedQuestions = [...questions];
                updatedQuestions[quizIndex] = data.results;
                setQuestions(updatedQuestions);

                // Mark quiz as added in quizTimes
                const updatedQuizTimes = [...quizTimes];
                updatedQuizTimes[quizIndex].added = true;
                setQuizTimes(updatedQuizTimes);

                setModalVisible(!modalVisible);
                console.log(data.results);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible)
            }}
        >
            <View className='flex-1 items-center justify-center'>

                <View className='bg-white w-5/6 rounded-md px-4 pt-3 pb-5 space-y-3 shadow-lg shadow-black'>

                    <View className='flex-row justify-between items-center'>
                        <Text className='text-lg font-medium tracking-wide'>Add Quiz</Text>
                        <Pressable onPress={() => setModalVisible(!modalVisible)}>
                            <MaterialCommunityIcons name='close' size={20} color='black' />
                        </Pressable>
                    </View>

                    <View className='flex-row space-x-4'>

                        <TouchableOpacity className='h-[45px] w-[45px] items-center justify-start border-[1px] border-slate-400 rounded-md py-[3px]'>
                            <Image source={require('../assets/images/Graduation_Cap.png')} style={styles.logo} />
                            <Text className='text-md font-medium tracking-widest absolute bottom-[3px]'>Ai</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'>
                            <Ionicons name='document-text-outline' size={26} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            onPress={() => { setCategories(!categories), setUrlField(false) }}
                        >
                            <AntDesign name='bulb1' size={22} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            onPress={() => { setCategories(false), setUrlField(!urlField) }}
                        >
                            <Feather name='link' size={22} />
                        </TouchableOpacity>

                    </View>

                    {categories &&
                        <View className='space-y-2'>
                            <TextInput
                                style={styles.inputBox}
                                placeholder='Enter Number of Questions (3 - 20)'
                                value={amount}
                                onChangeText={amount => setAmount(amount)}
                                clearButtonMode="always"
                                keyboardType='numeric'
                            />
                            <Dropdown
                                style={styles.inputBox}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={data}
                                maxHeight={250}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Difficulty"
                                value={difficulty}
                                onChange={handleDropdownChange}
                            />
                            <TouchableOpacity
                                className='w-full h-10 items-center justify-center bg-emerald-500 rounded-sm'
                                onPress={generateQuestions}
                            >
                                <Text className='text-white text-lg'>Generate</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {urlField && <TextInput
                        className='bg-slate-100 h-9 px-2 rounded-md'
                        placeholder='Enter a URL'
                        clearButtonMode="always"
                    />}

                </View>

            </View>

        </Modal>
    )
}

export default QuizModal;
const styles = StyleSheet.create({
    logo: {
        width: 32,
        height: 32,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc'
    },
    inputBox: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#aaa',
        alignSelf: 'center',
        borderRadius: 4,
        paddingHorizontal: 8
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#666'
    },
    selectedTextStyle: {
        fontSize: 14,
    },
})