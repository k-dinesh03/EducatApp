import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, StatusBar } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const ChatBot = () => {
	const [userMsg, setUserMsg] = useState('');
	const [messages, setMessages] = useState([]);
	const [sending, setSending] = useState(false);
	const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
	const scrollViewRef = useRef();

	useEffect(() => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
		}
	}, [messages]);

	const handleSendMessage = async () => {
		if (userMsg.trim() === '' || sending) return;

		setSending(true);

		setMessages((prevMessages) => [...prevMessages, { text: userMsg, sender: 'user' }]);

		setUserMsg('');

		try {
			const geminiResponse = await fetchGeminiResponse(userMsg);

			setMessages((prevMessages) => [...prevMessages, { text: geminiResponse, sender: 'gemini' }]);
		} catch (error) {
			console.error('Error receiving Gemini response:', error);
			setMessages((prevMessages) => [...prevMessages, { text: 'An error occurred while processing your request.', sender: 'gemini' }]);
		}

		setSending(false);
	};

	const fetchGeminiResponse = async (userMsg) => {
		try {
			const response = await fetch('https://chat-server-k330.onrender.com/gemini', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userMsg, conversationHistory: [] }),
			});
			const data = await response.json();
			return data.content;
		} catch (error) {
			throw new Error('Error calling Gemini API:', error);
		}
	};

	const copyToClipboard = (text) => {
		Clipboard.setString(text);
	};

	const toggleSpeech = async (index) => {
		if (speakingMessageIndex === index) {
			await Speech.stop();
			setSpeakingMessageIndex(null);
		} else {
			Speech.speak(messages[index].text, { language: 'en', voiceIOS: 'com.apple.ttsbundle.Daniel-compact' });
			setSpeakingMessageIndex(index);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent={true}
			/>
			{sending && <ActivityIndicator style={styles.loader} color="#000" />}
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{messages.map((message, index) => (
					<View
						key={index}
						style={[
							styles.messageContainer,
							{ alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start' },
						]}
					>
						<View
							style={[
								styles.messageBubble,
								{ backgroundColor: message.sender === 'user' ? '#2070F0' : '#B95CF4' },
								{ paddingBottom: message.sender === 'gemini' ? null : 0, },
							]}
							className={`${message.sender === 'user' ? 'rounded-tl-lg rounded-b-lg' : 'rounded-tr-lg rounded-b-lg'}`}
						>
							<Text style={styles.messageText}>{message.text}</Text>
							{message.sender === 'gemini' && (
								<View style={styles.iconContainer}>
									<TouchableOpacity onPress={() => copyToClipboard(message.text)}>
										<Feather name="clipboard" size={20} color="#fff" style={styles.icon} />
									</TouchableOpacity>
									<TouchableOpacity onPress={() => toggleSpeech(index)}>
										<Feather name={speakingMessageIndex ? "volume-x" : "volume-2"} size={24} color="#fff" style={styles.icon} />
									</TouchableOpacity>
								</View>
							)}
						</View>
					</View>
				))}
			</ScrollView>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Type your message here"
					value={userMsg}
					onChangeText={setUserMsg}
				/>
				<TouchableWithoutFeedback
					onPress={handleSendMessage}
					disabled={userMsg.trim() === '' || sending}
				>
					<View className='h-12 w-12 rounded-full bg-emerald-500 flex-row items-center justify-center pr-1'>
						<FontAwesome name="send" size={21} color="#fff" />
					</View>
				</TouchableWithoutFeedback>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 10,
	},
	scrollView: {
		flexGrow: 1,
		justifyContent: 'flex-end',
	},
	messageContainer: {
		marginTop: 10,
		maxWidth: '95%',
	},
	messageBubble: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		maxWidth: '80%',
		flexDirection: 'col',
		justifyContent: 'space-between',
	},
	messageText: {
		color: '#fff',
		marginBottom: 8
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
	},
	input: {
		flex: 1,
		height: 45,
		borderColor: '#999',
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 10,
		marginRight: 10,
	},
	loader: {
		alignSelf: 'center',
		marginTop: 3,
	},
	iconContainer: {
		flexDirection: 'row',
		gap: 15,
		alignItems: 'center'
	},
});

export default ChatBot;
