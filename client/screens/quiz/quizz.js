import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';


const Quizz = ({ route }) => {

    const quizSet = route.params?.quiz || {};
    const quizNumber = route.params?.quizNumber;
    const quizTitle = route.params?.quizTitle || '';
    console.log("Quizz set: " + JSON.stringify(quizSet));

    const [options, setOptions] = useState([]);

    const shuffleArray = (array) => {
        const shuffledArray = array.slice();

        for (let pass = 0; pass < 4; pass++) {
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
        }

        return shuffledArray;
    }

    const [selectedOption, setSelectedOption] = useState({});
    const [validateSelectedOption, setValidateSelectedOption] = useState({});
    const [score, setScore] = useState(0);

    const handleOptionSelected = (questionIndex, option) => {
        setSelectedOption({
            ...selectedOption,
            [questionIndex]: option
        });
    }

    const handleQuizSubmit = () => {
        let correctAnswers = 0;
        quizSet[quizNumber].questions.forEach((question, index) => {
            if (selectedOption[index] === question.correct_answer) {
                correctAnswers++;
                setValidateSelectedOption({
                    ...validateSelectedOption,
                    [index]: true
                });
            }
            else {
                setValidateSelectedOption({
                    ...validateSelectedOption,
                    [index]: false
                });
            }
        })
        setScore(correctAnswers);
        console.log("Score: ", score);
    }

    return (
        <SafeAreaView className='w-screen h-full flex'>

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

                <View className='w-full p-1 space-y-10'>

                    <View className='space-y-3'>

                        <Text className='text-lg self-center font-semibold tracking-wider'>Quiz - {quizTitle}</Text>

                        <View className='flex-row justify-between items-center h-[42px] px-2 border-[1px] border-emerald-700 rounded-md'>
                            <Text className='font-semibold tracking-wider text-emerald-700' style={{ fontSize: 16 }}>Answered</Text>
                            <Text className='font-semibold tracking-wider text-emerald-700' style={{ fontSize: 16 }}>0</Text>
                        </View>

                        <View className='flex-row justify-between items-center h-[42px] px-2 border-[1px] border-red-500 rounded-md'>
                            <Text className='font-semibold tracking-wider text-red-700' style={{ fontSize: 16 }}>Unanswered</Text>
                            <Text className='font-semibold tracking-wider text-red-700' style={{ fontSize: 16 }}>0</Text>
                        </View>

                    </View>

                    <View className='space-y-2'>

                        {quizSet[quizNumber].questions.map((question, i) => {

                            return (
                                <View className='space-y-2 mb-5' key={i}>

                                    <Text className='tracking-wide'>{i + 1}. {question.question}</Text>

                                    {question.incorrect_answers.map((option, j) => (
                                        <TouchableOpacity
                                            key={j}
                                            onPress={() => handleOptionSelected(i, option)}
                                            className={`flex-row justify-between items-center py-2 px-2 border-[1px] rounded-sm`}
                                        >
                                            <Text>{String.fromCharCode('a'.charCodeAt(0) + j)}{')'} {option}</Text>
                                        </TouchableOpacity>
                                    ))}

                                    <TouchableOpacity>
                                        <Text className='underline'>Explanation</Text>
                                    </TouchableOpacity>

                                </View>
                            )
                        })}
                    </View>

                </View>

                <TouchableOpacity className='mb-7 w-1/3 items-center self-center bg-emerald-500 py-[6px] rounded-md' onPress={handleQuizSubmit}>
                    <Text className='text-lg text-white'>Submit</Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>
    );
};

export default Quizz;

