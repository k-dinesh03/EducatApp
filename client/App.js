
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
import Profile from './screens/profile/profile';
import PostTemp from './components/postTemp';
import SetQuiz from './screens/quiz/setQuiz';
import Quizz from './screens/quiz/quizz';
import Explore from './screens/explore';
import ChatProfile from './screens/chat/ChatProfile';
import ChatMain from './screens/chat/ChatMain';
import Settings from './screens/settings';
import ProfileSettings from './components/profileSettings';
import ResetPassword from './screens/profile/resetPassword';
import Meetings from './screens/meet/Meetings';
import TopCategory from './screens/topCategory/category'
import LeaderBoard from './screens/leaderboard/LeaderBoard';
import SubscriptionScreen from './screens/subcription/SubscriptionScreen';
import ClassesScreen from './screens/classess/ClassesScreen';
import ClassDetailsScreen from './screens/classess/ClassDetailsScreen';
import LiveCoursesScreen from './screens/Live/LiveCoursesScreen';
import Cource from './screens/Live/Cource';

const App = () => {

	//global state
	const { state, setState } = useContext(AuthContext);
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
						<Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Change Password' }} />
						<Stack.Screen name="Profile" component={Profile} options={() => ({
							title: username,
							headerRight: () => (<ProfileSettings />),
						})} />
						<Stack.Screen name="ChatBot" component={ChatBot} options={{ title: 'EduAi' }} />
						<Stack.Screen name="ChatProfile" component={ChatProfile} options={{ title: username }} />
						<Stack.Screen name="ChatMain" component={ChatMain} />
						<Stack.Screen name="PostTemp" component={PostTemp} options={{ title: 'Explore' }} />
						<Stack.Screen name="SetQuiz" component={SetQuiz} options={{ title: 'Create a Quiz' }} />
						<Stack.Screen name="Quizz" component={Quizz} options={{ title: 'Quiz' }} />
						<Stack.Screen name="Post" component={Post} options={{ title: 'Create a Post' }} />
						<Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
						<Stack.Screen name="Meetings" component={Meetings} options={{ title: 'Meetings' }} />
						<Stack.Screen name="TopCategory" component={TopCategory} options={{ title: 'Categories' }} />
						<Stack.Screen name="LeaderBoard" component={LeaderBoard} options={{ title: 'LeaderBoard' }} />
						<Stack.Screen name="Sbucriptions" component={SubscriptionScreen} options={{ title: 'Subcriptions' }} />
						<Stack.Screen name="ClassesScreen" component={ClassesScreen} options={{ title: 'Classes' }} />
						<Stack.Screen name="ClassDetails" component={ClassDetailsScreen} options={{ title: 'Class Details' }} />
						<Stack.Screen name="LiveCourses" component={LiveCoursesScreen} options={{ title: 'Live' }} />
						<Stack.Screen name="Cource" component={Cource} options={{ title: 'Live' }} />
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