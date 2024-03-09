import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';


const Quizz = ({ route }) => {

    const quizSet = route.params?.quiz || {};
    const quizNumber = route.params?.quizNumber;
    const quizTitle = route.params?.quizTitle || '';

    const shuffleAnswers = (question) => {
        if (!question) {
            return [];
        }

        const allAnswers = [
            question.correct_answer,
            ...question.incorrect_answers.filter(Boolean),
        ];

        for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }

        return allAnswers.map((answer, index) => (
            answer && (
                <TouchableOpacity
                    key={index}
                    className={`flex-row justify-between items-center py-2 px-2 border-[1px] rounded-sm`}
                >
                    <Text>{String.fromCharCode('a'.charCodeAt(0) + index)}{')'} {answer}</Text>
                </TouchableOpacity>
            )
        ));
    };

    const scrollViewRef = useRef();
    const goToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }

    const handleQuizSubmit = () => {
        console.log("Submitted quiz");
    }

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
                ref={scrollViewRef}
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

                                    {shuffleAnswers(question)}

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

            <TouchableOpacity
                className='rounded-full h-12 w-12 flex items-center justify-center bg-white border-[1px] border-gray-400 absolute bottom-3 right-3'
                onPress={goToTop}
            >
                <MaterialIcons name='keyboard-arrow-up' size={26} color='black' />
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default Quizz;

