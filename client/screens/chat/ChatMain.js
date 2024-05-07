import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, Send } from 'react-native-gifted-chat';

export default function ChatMain({ route, navigation }) {

	const { userId, userName, chatResponse } = route.params;
	const [messages, setMessages] = useState([]);

	const handleSend = (newMessages = []) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

		setTimeout(() => {
			const receivedMessage = {
				_id: Math.round(Math.random() * 1000000).toString(),
				text: chatResponse,
				createdAt: new Date(),
				user: {
					_id: userId === 1 ? 2 : 1
				}
			};
			onReceiveMessage([receivedMessage]);
		}, 2000);
	};

	const onReceiveMessage = (newMessages = []) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			title: userName,
		});
	}, [navigation, userName]);

	return (
		<View style={{ flex: 1 }}>

			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent={true}
			/>

			<GiftedChat
				messages={messages}
				onSend={newMessages => handleSend(newMessages)}
				user={{ _id: userId }}
				renderBubble={renderBubble}
				renderInputToolbar={renderInputToolbar}
				renderSend={renderSend}
				renderComposer={renderComposer}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	bubble: {
		borderRadius: 10,
		backgroundColor: '#33C24E',
		marginRight: 10,
		marginBottom: 5,
	},
	inputToolbar: {
		backgroundColor: '#ECEFF1',
		borderTopWidth: 0,
		paddingBottom: 5,
		marginHorizontal: 10,
		marginLeft: 0,
	},
	composer: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingTop: 10,
		paddingBottom: 10,
	},
	sendButton: {
		marginRight: 0,
	},
	bubbleReceived: {
		borderRadius: 10,
		backgroundColor: '#E0E0E0',
		marginLeft: -35,
		marginBottom: 5,
	},
});

// Custom bubble component
const renderBubble = props => (
	<Bubble
		{...props}
		wrapperStyle={{
			left: {
				...styles.bubbleReceived,
			},
			right: {
				...styles.bubble,
			},
		}}
	/>
);

// Custom input toolbar component
const renderInputToolbar = props => (
	<InputToolbar
		{...props}
		containerStyle={styles.inputToolbar}
	/>
);

// Custom send button component
const renderSend = props => (
	<Send {...props} containerStyle={styles.sendButton} />
);

// Custom composer component
const renderComposer = props => (
	<Composer
		{...props}
		textInputStyle={styles.composer}
	/>
);
