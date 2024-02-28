import { View, Text, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios';

import ChatBubble from './chatBubble';
import Navigation from '../../components/Navigation';

const ChatBot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);

    const buttonStyle = loading || userInput.trim() === '' ?
        [styles.button, { backgroundColor: '#fff' }] :
        styles.button;

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
            const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAHBC17AmhxsSAopbWbL6w4wRrTL9Wq9d0',
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
        <SafeAreaView className='w-screen h-full flex pt-10 bg-slate-100'>

            <StatusBar backgroundColor='transparent' barStyle={'dark-content'} />

            <View className='h-full self-center py-2'>

                <Navigation />

                {loading && <ActivityIndicator style={{ marginTop: 10 }} color="rgb(16 185 129)" />}

                <FlatList
                    data={chat}
                    renderItem={renderChatItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                />

                <View className='rounded-3xl shadow-md shadow-black'>
                    <View style={styles.inputContiner}>
                        <TextInput
                            style={styles.input}
                            placeholder='Type your message...'
                            placeholderTextColor="#aaa"
                            value={userInput}
                            onChangeText={setUserInput}
                        />
                        <TouchableOpacity
                            onPress={handelUserInput}
                            style={buttonStyle}
                            disabled={loading || userInput.trim() === ''}>
                            <Ionicons name='send' color="green" size={21} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    inputContiner: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3,
        borderColor: "#000",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: "space-evenly"
    },
    input: {
        width: "85%",
        height: 40,
        color: "#333",
        paddingLeft: 10
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
