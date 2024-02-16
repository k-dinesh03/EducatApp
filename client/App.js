
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ChatHome from './screens/chat/ChatHome';
import ChatMain from './screens/chat/ChatMain';
import Post from './screens/creator/post';
import Collections from './screens/creator/collections';
import EmailSent from './screens/others/emailSent';
import Register from './screens/signup/Register'
import Launch from './screens/others/Launch'
import SignIn from './screens/signIn/SignIn'
import ForgotPassword from './screens/others/ForgotPassword'
import OTP from './screens/others/otp'
import Home from './screens/home';
import Profile from './screens/profile';

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
						<Stack.Screen name="ChatHome" component={ChatHome} />
						<Stack.Screen name="ChatMain" component={ChatMain} />
						<Stack.Screen name="Post" component={Post} />
						<Stack.Screen name="Collections" component={Collections} />
					</Stack.Navigator>
				) : (
					<Stack.Navigator initialRouteName="Launch" screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Launch" component={Launch} />
						<Stack.Screen name="EmailSent" component={EmailSent} />
						<Stack.Screen name="SignIn" component={SignIn} />
						<Stack.Screen name="Register" component={Register} />
						<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
						<Stack.Screen name="OTP" component={OTP} />
					</Stack.Navigator>
				)}
			</NavigationContainer>
		</GestureHandlerRootView>
	);
};

export default () => {
	return (
		<AuthProvider>
			<App />
		</AuthProvider>
	)
}