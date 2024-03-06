
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostProvider } from './context/postContext';

import ChatBot from './screens/eduAi/chatBot';
import Post from './screens/creator/post';
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
import Explore from './screens/explore';
import ChatHome from './screens/chat/ChatHome';

const App = () => {

	//global state
	const { state } = useContext(AuthContext);
	const authenticatedUser = state?.user && state?.token;
	const username = state?.user?.username;

	const Stack = createNativeStackNavigator();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				{authenticatedUser ? (
					<Stack.Navigator initialRouteName="Home" >
						<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
						<Stack.Screen name="Explore" component={Explore} options={{ title: 'Explore' }} />
						<Stack.Screen name="Profile" component={Profile} options={{ title: username }} />
						<Stack.Screen name="ChatBot" component={ChatBot} options={{ title: 'EduAi' }} />
						<Stack.Screen name="ChatHome" component={ChatHome} options={{ title: username }} />
						<Stack.Screen name="PostTemp" component={PostTemp} options={{ title: 'Explore' }} />
						<Stack.Screen name="SetQuiz" component={SetQuiz} options={{ title: 'Create a Quiz' }} />
						<Stack.Screen name="Quizz" component={Quizz} options={{ title: 'Quiz' }} />
						<Stack.Screen name="Post" component={Post} options={{ title: 'Create a Post' }} />
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