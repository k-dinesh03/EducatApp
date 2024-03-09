import { View, Text, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios';

import ChatBubble from './chatBubble';

const ChatBot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);


    const key = 'AIzaSyDykZUu7HZbYHw916aRpnFEqQXJUerypR0';

    const handelUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];
        setLoading(true);

        try {
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
                { contents: updatedChat }
            );

            console.log("Gemini pro API Response: ", response.data);

            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (modelResponse) {
                const updatedchatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ];

                setChat(updatedchatWithModel);
                setUserInput("");
            }
        }
        catch (error) {
            console.error("Error calling Gemini Pro API:", error);
            console.error("Error responding:", error.response);
            alert("An error occurred. Please try again");
        }
        finally {
            setLoading(false);
        }
    };


    const renderChatItem = ({ item }) => {
        return (
            <ChatBubble
                role={item.role}
                text={item.parts[0].text}
            />
        );
    }

    return (
        <SafeAreaView className='w-screen h-full flex self-center' style={{ width: '97%' }}>

            <StatusBar backgroundColor='transparent' barStyle={'dark-content'} />

            <View className='w-full h-full py-2'>

                {loading && <ActivityIndicator style={{ marginTop: 10 }} color="rgb(16 185 129)" />}

                <FlatList
                    data={chat}
                    renderItem={renderChatItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                />

                <View className='flex-row px-1 items-center justify-around h-10 w-full'>
                    <TextInput
                        style={styles.inputContainer}
                        placeholder='Type your message...'
                        placeholderTextColor="#aaa"
                        value={userInput}
                        onChangeText={setUserInput}
                    />
                    <TouchableOpacity
                        onPress={handelUserInput}
                        disabled={loading || userInput.trim() === ''}
                        className='bg-white h-10 w-10 items-center justify-center rounded-full border-[0.6px]'
                    >
                        <Ionicons name='send' color="green" size={21} />
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        borderColor: "#000",
        backgroundColor: "#fff",
        borderWidth: 0.6,
        borderRadius: 25,
        width: "87%",
        height: "100%",
        paddingHorizontal: 10
    },
    logo: {
        width: 45,
        height: 45,
        shadowRadius: 100,
    },
    button: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    }
})


export default ChatBot
