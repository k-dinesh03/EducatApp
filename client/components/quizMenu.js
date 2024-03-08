import React, { useState } from 'react'
import { Modal, Text, Pressable, View, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ToastAndroid } from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import { Feather, Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const QuizModal = ({ modalVisible, setModalVisible, quizIndex, quizTimes, setQuizTimes, selectedOptionQuiz }) => {

    const navigation = useNavigation();

    // For video with quiz
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

    const generateQuestionsForVideo = async () => {

        if (generateQuesError(amount, difficulty)) {
            try {
                const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple`);

                setModalVisible(!modalVisible);

                // Mark quiz as added in quizTimes
                const updatedQuizTimes = [...quizTimes];
                updatedQuizTimes[quizIndex].added = true;
                updatedQuizTimes[quizIndex].questions = response.data.results;
                setQuizTimes(updatedQuizTimes);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    // For quiz
    const [urlFieldQuiz, setUrlFieldQuiz] = useState(false);
    const [categoriesQuiz, setCategoriesQuiz] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [isQuizAdded, setIsQuizAdded] = useState(false);

    const [isHeader, setIsHeader] = useState(false);
    const [isDescription, setIsDescription] = useState(false);
    const [errors, setErrors] = useState({});

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const generateQuestionsForQuiz = async () => {

        if (generateQuesError(amount, difficulty)) {
            try {
                const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple`);
                // console.log(response.data.results);
                setQuestions(response.data.results);
                setCategoriesQuiz(false);
                setIsQuizAdded(true);

                ToastAndroid.showWithGravityAndOffset(
                    'Quiz Added Successfully!',
                    3000,
                    ToastAndroid.BOTTOM,
                    25,
                    30,
                );
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    const handleQuizSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = postValidate({ title, description, questions });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                const { data } = await axios.post('/post/create-quiz', { title, description, quizQuest: questions, likes: 0, rating: 0, postType: selectedOptionQuiz });
                console.log('Data : ', data);
                setLoading(false);

                ToastAndroid.showWithGravityAndOffset(
                    data?.message,
                    3000,
                    ToastAndroid.BOTTOM,
                    25,
                    30,
                );

                navigation.navigate("Home");
            }
            catch (error) {
                alert(error.response.data.message || error.message);
                setLoading(false);
                console.log(error);
            }
        }
    }

    const postValidate = (values) => {

        const errors = {}

        if (!values.title) {
            errors.title = "Required";
        }

        if (values.questions.length === 0) {
            errors.questions = "Required";
        }

        if (!values.description) {
            errors.description = "Required";
        }

        return errors;
    }

    return (

        <View>

            {selectedOptionQuiz === 'videowithquiz' && <Modal
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
                            <Text className='text-lg font-medium tracking-wide'>Add Quiz From</Text>
                            <Pressable onPress={() => setModalVisible(!modalVisible)}>
                                <MaterialCommunityIcons name='close' size={20} color='black' />
                            </Pressable>
                        </View>

                        <View className='flex-row space-x-4'>

                            <TouchableOpacity
                                className='h-[45px] w-[45px] items-center justify-start border-[1px] border-slate-400 rounded-md py-[3px]'
                                onPress={() => navigation.navigate("ChatBot")}
                            >
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
                                    onPress={generateQuestionsForVideo}
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

            </Modal>}

            {selectedOptionQuiz === 'quiz' && <View className='flex-1 items-center justify-center'>

                <View className='w-full rounded-md px-1 space-y-7 mb-4'>

                    <View className='flex-row space-x-4 mb-4'>

                        <TouchableOpacity
                            className='h-[45px] w-[45px] items-center justify-start border-[1px] border-slate-400 rounded-md py-[3px]'
                            onPress={() => navigation.navigate("ChatBot")}
                        >
                            <Image source={require('../assets/images/Graduation_Cap.png')} style={styles.logo} />
                            <Text className='text-md font-medium tracking-widest absolute bottom-[3px]'>Ai</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'>
                            <Ionicons name='document-text-outline' size={26} />
                        </TouchableOpacity>

                        <View className='items-center space-y-1'>
                            <TouchableOpacity
                                className={`h-[45px] w-[45px] items-center justify-center border-[1px] ${isQuizAdded ? 'border-emerald-600' : 'border-slate-400'} rounded-md`}
                                onPress={() => { setCategoriesQuiz(!categoriesQuiz), setUrlFieldQuiz(false) }}
                            >
                                <AntDesign name='bulb1' size={22} color={isQuizAdded ? 'green' : 'black'} />
                            </TouchableOpacity>
                            {isQuizAdded && <View className='items-center space-y-1'>
                                <View style={styles.line} />
                                {errors.questions ?
                                    <Text className='text-xs text-red-500 ml-2'>({errors.questions})</Text>
                                    :
                                    <Text className='text-xs text-emerald-600'>Quiz Added</Text>
                                }
                            </View>}
                        </View>

                        <TouchableOpacity
                            className='h-[45px] w-[45px] items-center justify-center border-[1px] border-slate-400 rounded-md'
                            onPress={() => { setCategoriesQuiz(false), setUrlFieldQuiz(!urlFieldQuiz) }}
                        >
                            <Feather name='link' size={22} />
                        </TouchableOpacity>

                    </View>

                    {categoriesQuiz && <View className='space-y-3 my-3'>
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
                    </View>}

                    {isQuizAdded &&
                        <View className='space-y-8'>

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

                        </View>
                    }

                    <TouchableOpacity
                        className='w-11/12 h-10 self-center items-center justify-center bg-emerald-500 rounded-sm'
                        onPress={questions.length ? handleQuizSubmit : generateQuestionsForQuiz}
                    >
                        <Text className='text-white text-lg'>{questions.length ? 'Submit' : 'Generate'}</Text>
                    </TouchableOpacity>

                </View>

            </View>}

        </View>
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
    line: {
        height: 20,
        width: 1.2,
        transform: [{ rotate: '180deg' }],
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 1,
        borderColor: 'green'
    }
})