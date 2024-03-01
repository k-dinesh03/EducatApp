import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react';

const QuizModal = ({ quizModal, closeModal, handleAttendQuiz }) => {

    return (

        <Modal visible={quizModal} transparent animationType="fade">

            <View className='h-full w-11/12 self-center items-center justify-center'>

                <View className='bg-white space-y-4 px-4 py-3 rounded-md shadow-lg shadow-black'>

                    <Text className='text-lg'>Do you want to attend the quiz ?</Text>

                    <View className='flex-row justify-around mb-2'>

                        <TouchableOpacity
                            className='bg-blue-500 px-5 py-2 items-center justify-center rounded-md'
                            onPress={handleAttendQuiz}
                        >
                            <Text className='text-white' style={{ fontSize: 16 }}>Yes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='bg-blue-500 px-5 py-2 items-center justify-center rounded-md'
                            onPress={closeModal}
                        >
                            <Text className='text-white' style={{ fontSize: 16 }}>No</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        </Modal>
    )
}

export default QuizModal