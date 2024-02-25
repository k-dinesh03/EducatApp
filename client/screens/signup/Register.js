import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

import Validate from './validate';

import { firebase } from '../../config/config'
import 'firebase/firestore';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';

function Register() {

	const navigation = useNavigation();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [loading, setLoading] = useState(false)

	const data = [
		{ label: 'Explorer', value: 'explorer' },
		{ label: 'Creator', value: 'creator' },
	];

	const [userType, setUserType] = useState('')

	const values = useRef({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	})
	const [errors, setErrors] = useState({});

	const handleDropdownChange = (selectedValue) => {
		setUserType(selectedValue);
		handleInput('userType', selectedValue.value);
	};

	const handleInput = (name, value) => {
		const newValues = { ...values.current, [name]: value };
		values.current = newValues;

		// Validate the input
		const validationErrors = Validate(newValues);
		setErrors(validationErrors);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validationErrors = Validate(values.current);
		setErrors(validationErrors);


		if (Object.keys(validationErrors).length === 0) {

			setLoading(true);
			const { username, userType, email, password } = values.current;

			try {

				//for registering user
				const { data } = await axios.post('/auth/register', { username, userType, email, password });
				console.log(data);

				// for verification mail and folder creation
				await firebase.auth().createUserWithEmailAndPassword(email, password)

					.then(() => {

						//send verification mail
						firebase.auth().currentUser.sendEmailVerification({
							handleCodeInApp: true,
							url: 'https://educat-auth.firebaseapp.com'
						})

							.then(() => {
								navigation.navigate('EmailSent')
							})
							.catch((error) => {
								console.log(error.message)
							})
					})
					.catch((error) => {
						console.log(error.message)
					})

				setLoading(false);

			}
			catch (error) {
				console.log(error.response.data.message);
				console.log("Error Type: ", error.message)
				setLoading(false);
			}
			finally {
				setLoading(false);
			}
		}
	}
	return (
		<ScrollView className='mt-10' showsVerticalScrollIndicator={false}>

			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent={true}
			/>

			<SafeAreaView style={styles.container}>

				<View>
					<Image
						style={styles.tinyLogo}
						source={require('../../assets/images/Educat-logo.png')}
					/>
				</View>

				<Text style={styles.title} className='font-semibold tracking-wider'>SIGNUP</Text>

				<View style={styles.inputContainer} className='mt-3'>
					<Text className='self-start mb-2'>Username</Text>
					<View className='flex flex-row rounded-md items-center w-full pr-3 pl-[17px] justify-between' style={styles.input}>
						<TextInput
							autoCapitalize='none'
							placeholder="abc"
							value={values.username}
							onChangeText={(value) => handleInput('username', value)}
							className='w-11/12 py-2'
							clearButtonMode="always"
							style={{ fontSize: 15 }}
						/>
						<AntDesign name='user' size={19} style={{ color: '#666' }} />
					</View>
					{errors.username && <Text className='self-start text-red-500 text-xs '>{errors.username}</Text>}
				</View>

				<View style={styles.inputContainer} className='mt-3'>
					<Text className='self-start mb-2'>Email</Text>
					<View className='flex flex-row rounded-md items-center w-full pr-3 pl-[17px] justify-between' style={styles.input}>
						<TextInput
							autoCapitalize='none'
							placeholder="abc@gmail.com"
							value={values.email}
							onChangeText={(value) => handleInput('email', value)}
							className='w-11/12 py-2'
							clearButtonMode="always"
							style={{ fontSize: 15 }}
						/>
						<Ionicons name='mail-outline' size={22} style={{ color: '#666' }} />
					</View>
					{errors.email && <Text className='self-start text-red-500 text-xs '>{errors.email}</Text>}
				</View>

				<View style={styles.inputContainer} className='mt-3'>
					<Text className='self-start mb-2'>User Type</Text>
					<View className='flex flex-row rounded-md items-center w-full justify-between h-[45px]' style={styles.input}>
						<Dropdown
							style={styles.dropdown}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							data={data}
							maxHeight={300}
							labelField="label"
							valueField="value"
							placeholder="Select User"
							value={userType}
							onChange={handleDropdownChange}
						/>
					</View>
					{errors.userType && <Text className='self-start text-red-500 text-xs '>{errors.userType}</Text>}
				</View>

				<View style={styles.inputContainer} className='mt-3'>
					<Text className='self-start mb-2'>Password</Text>
					<View className='flex flex-row rounded-md items-center w-full pr-3 pl-[17px] justify-between' style={styles.input}>
						<TextInput
							autoCapitalize='none'
							placeholder="********"
							secureTextEntry={!showPassword}
							value={values.password}
							onChangeText={(value) => handleInput('password', value)}
							className='w-11/12 py-2'
							clearButtonMode="always"
							style={{ fontSize: 15 }}
						/>
						<Ionicons
							name={showPassword ? 'eye-outline' : 'eye-off-outline'}
							size={21}
							onPress={() => { setShowPassword(!showPassword); }}
							style={{ color: '#666' }}
						/>
					</View>
					{errors.password && <Text className='self-start text-red-500 text-xs '>{errors.password}</Text>}
				</View>

				<View style={styles.inputContainer} className='mt-3'>
					<Text className='self-start mb-2'>Confirm Password</Text>
					<View className='flex flex-row rounded-md items-center w-full pr-3 pl-[17px] justify-between' style={styles.input}>
						<TextInput
							autoCapitalize='none'
							placeholder="********"
							secureTextEntry={!showConfirmPassword}
							value={values.confirmPassword}
							onChangeText={(value) => handleInput('confirmPassword', value)}
							className='w-11/12 py-2'
							clearButtonMode="always"
							style={{ fontSize: 15 }}
						/>
						<Ionicons
							name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
							size={21}
							onPress={() => { setShowConfirmPassword(!showConfirmPassword); }}
							style={{ color: '#666' }}
						/>
					</View>
					{errors.confirmPassword && <Text className='self-start text-red-500 text-xs '>{errors.confirmPassword}</Text>}
				</View>

				{loading ? (
					<View style={styles.registerBtnTouch}>
						<Text className='w-full h-full py-[10px] text-center rounded-md text-lg text-white tracking-wider bg-slate-400'>Linking you with us...</Text>
					</View>
				) : (
					<TouchableOpacity style={styles.registerBtnTouch} onPress={handleSubmit}>
						<Text className='w-full h-full py-[10px] text-center rounded-md text-lg text-white tracking-wider bg-emerald-500'>Register</Text>
					</TouchableOpacity>
				)}


				<View className='w-[90%] items-center flex-row justify-center mb-5'>

					<Text>Already a member ?</Text>

					<TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
						<Text style={{ fontSize: 14, marginLeft: 7 }} className='text-emerald-700 underline'>Sign In</Text>
					</TouchableOpacity>

				</View>

			</SafeAreaView>

		</ScrollView>
	);
}

export default Register;

const styles = StyleSheet.create({
	container: {
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	title: {
		fontSize: 24,
		marginBottom: 10
	},
	inputContainer: {
		width: '90%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc'
	},
	textContainer: {
		alignSelf: 'flex-end',
	},
	text: {
		textAlign: 'right',
	},
	registerBtnTouch: {
		display: 'flex',
		flexDirection: 'row',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 5,
		width: '90%',
		marginVertical: 25
	},
	tinyLogo: {
		width: 200,
		height: 200,
	},
	dropdown: {
		margin: 16,
		height: 50,
		width: '92%'
	},
	placeholderStyle: {
		fontSize: 15,
		color: '#666'
	},
	selectedTextStyle: {
		fontSize: 15,
	},
	loader: {
		width: 24,
		height: 24,
		borderWidth: 3,
		borderRadius: 50,
		borderStyle: 'dotted',
		borderTopColor: 'white',
		borderRightColor: 'white',
		borderLeftColor: 'white',
	}
});

