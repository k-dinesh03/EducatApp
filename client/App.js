
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostProvider } from './context/postContext';

import ChatBot from './screens/eduAi/chatBot';
import Post from './screens/creator/post';
import Collections from './screens/creator/collections';
import EmailSent from './screens/others/emailSent';
import Register from './screens/signup/Register'
import Launch from './screens/others/Launch'
import SignIn from './screens/signIn/SignIn'
import ForgotPassword from './screens/others/ForgotPassword'
import Home from './screens/home';
import Profile from './screens/profile';
import PostTemp from './components/postTemp';
import SetQuiz from './screens/quiz/setQuiz';
import Quizz from './screens/quiz/quizz';

const App = () => {

	//global state
	const { state } = useContext(AuthContext);
	const authenticatedUser = state?.user && state?.token;

	const Stack = createNativeStackNavigator();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				{authenticatedUser ? (
					<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Home" component={Home} />
						<Stack.Screen name="Profile" component={Profile} />
						<Stack.Screen name="ChatBot" component={ChatBot} />
						<Stack.Screen name="Collections" component={Collections} />
						<Stack.Screen name="PostTemp" component={PostTemp} />
						<Stack.Screen name="SetQuiz" component={SetQuiz} />
						<Stack.Screen name="Quizz" component={Quizz} />
						<Stack.Screen name="Post" component={Post} />
					</Stack.Navigator>
				) : (
					<Stack.Navigator initialRouteName="Launch" screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Launch" component={Launch} />
						<Stack.Screen name="EmailSent" component={EmailSent} />
						<Stack.Screen name="SignIn" component={SignIn} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
					</Stack.Navigator>
				)}
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

export default () => {
	return (
		<AuthProvider>
			<PostProvider>
				<App />
			</PostProvider>
		</AuthProvider>
	)
}