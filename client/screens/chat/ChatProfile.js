import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const users = [
	{ id: 1, name: 'Creater 1', chatResponse: 'Hi, how are you?' },
	{ id: 2, name: 'Creater 2', chatResponse: 'Hey there!' },
	{ id: 3, name: 'Creater 3', chatResponse: 'Hello!' }
];

export default function ChatProfile() {
	const navigation = useNavigation();
	const [chatResponses, setChatResponses] = useState({});

	useEffect(() => {
		fetchChatResponses();
	}, []);

	const fetchChatResponses = async () => {
		const responses = {};
		for (const user of users) {
			const response = await fetchChatResponseFromAPI(user.id);
			responses[user.id] = response;
		}
		setChatResponses(responses);
	};

	const fetchChatResponseFromAPI = async (userId) => {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(users.find(user => user.id === userId).chatResponse);
			}, 1000);
		});
	};

	const handleChatMainNavigation = (userId, userName) => {
		const chatResponse = chatResponses[userId] || '';
		navigation.navigate('ChatMain', { userId, userName, chatResponse });
	};

	return (
		<View style={styles.container}>
			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent={true}
			/>
			{users.map(user => (
				<TouchableOpacity key={user.id} onPress={() => handleChatMainNavigation(user.id, user.name)}>
					<View style={styles.userContainer}>
						<View style={styles.avatarContainer}><Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text></View>
						<Text style={styles.userName}>{user.name}</Text>
					</View>
					<View style={{ height: 0.5, backgroundColor: "#000", width: '100%', bottom: 10 }} />
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9',
		padding: 20,
	},
	userContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	avatarContainer: {
		height: 60,
		width: 60,
		borderRadius: 30,
		backgroundColor: '#888',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 20,
	},
	avatarText: {
		color: '#fff',
		fontSize: 24,
		fontWeight: 'bold',
	},
	userName: {
		fontSize: 18,
		color: '#333',
	},
});
