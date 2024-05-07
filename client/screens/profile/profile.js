import React, { useRef, useContext, useState, useEffect } from "react";
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TouchableWithoutFeedback,
	TouchableOpacity,
	View,
	Image,
	ToastAndroid,
	ActivityIndicator,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import MenuBtn from "../../components/menuBtn";
import BottomSheetNav from "../../components/bottomSheetNav";

import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { firebase } from "../../config/config";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

const Profile = () => {
	const bottomSheetRef = useRef(null);
	const navigation = useNavigation();

	//global state
	const { state, setState } = useContext(AuthContext);
	const { user } = state;
	const userType = state?.user?.userType === "creator";

	//local state
	const [username, setUsername] = useState(user?.username);
	const [password, setPassword] = useState(user?.password);

	const [email] = useState(user?.email); // important to update profile pic
	const [loading, setLoading] = useState(false);

	//handle update user data
	const handleUpdate = async () => {
		try {
			setLoading(true);

			const { data } = await axios.put("/auth/update-user", {
				username,
				password,
				email,
			});

			setLoading(false);

			if (data) {
				const updatedUser = data.updatedUser;

				// Update local state
				setState({ ...state, user: updatedUser });

				// Update AsyncStorage with the latest user data
				await AsyncStorage.setItem(
					"Educat",
					JSON.stringify({ ...state, user: updatedUser })
				);

				alert(data.message);
			} else {
				alert("No data received from the server");
			}
		} catch (error) {
			alert(error.response.data.message);
			setLoading(false);
			console.log(error);
		}
	};

	const pickMediaGalleryImages = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				aspect: [128, 128],
				allowsEditing: true,
				orderedSelection: true,
				quality: 0.75,
			});

			if (!result.canceled) {
				Alert.alert("Attention!", "Are you sure you want to delete ?", [
					{
						text: "Cancel",
						onPress: () => {
							result.canceled,
								ToastAndroid.showWithGravityAndOffset(
									"Canceled",
									2500,
									ToastAndroid.BOTTOM,
									25,
									30
								);
						},
					},
					{
						text: "SET",
						onPress: () => {
							setProfilePic(result.assets[0].uri);
						},
					},
				]);
			}
		} catch (error) {
			console.error("Error picking media from gallery : ", error);
		}
	};

	//logout method
	const handleLogout = async () => {
		setState({
			user: null,
			token: "",
		});
		await AsyncStorage.removeItem("Educat");
		ToastAndroid.showWithGravityAndOffset(
			"Logged Out Successfully",
			2500,
			ToastAndroid.BOTTOM,
			25,
			30
		);
	};

	const storage = firebase.storage();
	const [profileImgUrl, setProfileImgUrl] = useState(user?.profilePic || null);

	const setProfilePic = async (uri) => {
		try {
			setLoading(true);

			// Upload images to Firebase Storage
			const responseImg = await fetch(uri);
			const blob = await responseImg.blob();

			// Get the filename from the URI
			let filename = uri.split("/").pop();
			const extension = filename.split(".").pop();
			const name = filename.split(".").slice(0, -1).join(".");
			filename = name + Date.now() + extension;

			const storageRef = storage.ref().child(`profiles/${filename}`);
			await storageRef.put(blob);

			const downloadUrl = await storageRef.getDownloadURL();
			setProfileImgUrl(downloadUrl);

			const response = await axios.put("/auth/profile-pic", {
				profilePic: downloadUrl,
				email,
			});

			setLoading(false);

			ToastAndroid.showWithGravityAndOffset(
				response?.data?.message,
				2500,
				ToastAndroid.BOTTOM,
				25,
				30
			);

			if (response?.data) {
				const updatedUser = response?.data.updatedUser;
				setState({ ...state, user: updatedUser });
				await AsyncStorage.setItem(
					"Educat",
					JSON.stringify({ ...state, user: updatedUser })
				);
			}
			else {
				console.log("No data received from the server");
			}

		}
		catch (error) {
			ToastAndroid.showWithGravityAndOffset(
				error,
				2500,
				ToastAndroid.BOTTOM,
				25,
				30
			);
		}
		finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView className="w-screen h-full flex bg-white">

			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent={true}
			/>

			<ScrollView
				className="h-full self-center space-y-6 -z-10"
				style={{ width: "95%" }}
				showsVerticalScrollIndicator={false}
			>
				<View className="relative mb-16 mt-2">

					<View className="w-3/5 h-10 self-center border-x-[1px] border-t-[1px] border-slate-400 absolute top-20 rounded-t-sm" />

					{userType ? (
						<View className="items-center absolute top-32 left-[14px] w-1/3">
							<Text className="font-medium text-lg">0</Text>
							<Text className="font-semibold text-xl tracking-wide">
								Explorers
							</Text>
						</View>
					) : (
						<View className="items-center absolute top-32 left-[14px] w-1/3">
							<Text className="font-medium text-lg">0</Text>
							<Text className="font-semibold text-xl tracking-wide">
								LeaderBoard
							</Text>
						</View>
					)}

					<View className="items-center absolute top-32 right-[14px] w-1/3">
						<Text className="font-medium text-lg">{user?.score}</Text>
						<Text className="font-semibold text-xl tracking-wider">Scores</Text>
					</View>

					<View className="w-[120px] h-[120px] rounded-full items-center justify-center bg-white border-[0.3px] border-slate-400 self-center my-2 relative overflow-hidden">
						{profileImgUrl === null ||
							profileImgUrl === undefined ||
							!profileImgUrl ? (
							<Image
								style={{ width: "80%", height: "80%", borderRadius: 100 }}
								source={require("../../assets/images/user.jpg")}
							/>
						) : (
							<View className="w-full h-full">
								<Image
									style={{ width: "100%", height: "100%", borderRadius: 100 }}
									source={{ uri: profileImgUrl }}
								/>
							</View>
						)}

						{loading ? (
							<View className="absolute z-50 w-full h-full items-center justify-center bg-black/10">
								<ActivityIndicator color="white" />
							</View>
						) : null}

						<TouchableOpacity
							className="w-full absolute bottom-0 flex items-center z-50 bg-black/30"
							onPress={pickMediaGalleryImages}
						>
							<FontAwesome name="edit" color="white" size={20} />
						</TouchableOpacity>

					</View>

				</View>

				<View className="w-full flex-row justify-around">
					<View className="items-center space-y-1">
						<TouchableOpacity className="h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md">
							<Ionicons name="folder-outline" size={26} color="black" />
						</TouchableOpacity>
						<Text className="font-medium tracking-wide">{userType ? 'Posts' : 'Saved'}</Text>
					</View>

					<View className="items-center space-y-1">
						<TouchableOpacity className="h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md">
							<AntDesign name="message1" size={24} color="black" />
						</TouchableOpacity>
						<Text className="font-medium tracking-wide">Chats</Text>
					</View>

					<View className="items-center space-y-1">
						<TouchableOpacity className="h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md">
							<Ionicons name="videocam-outline" size={27} color="black" />
						</TouchableOpacity>
						<Text className="font-medium tracking-wide">Meets</Text>
					</View>

					<View className="items-center space-y-1">
						<TouchableOpacity className="h-12 w-12 border-[1px] border-slate-500 items-center justify-center rounded-md">
							<Ionicons name="call-outline" size={26} color="black" />
						</TouchableOpacity>
						<Text className="font-medium tracking-wide">Calls</Text>
					</View>
				</View>

				<View className="w-full flex-col border-[1px] border-slate-400 rounded-md">

					<View className="w-11/12 py-4 flex-row items-center space-x-2">
						<View className="mx-4">
							<AntDesign name="github" size={27} />
						</View>
						<Text numberOfLines={1} ellipsizeMode="tail" className='mr-10'>Github link</Text>
					</View>

					<View className="w-10/12 self-end border-b-[1px] border-slate-400" />

					<View className="w-11/12 py-4 flex-row items-center space-x-2">
						<View className="mx-4">
							<AntDesign name="youtube" size={28} color="red" />
						</View>
						<Text numberOfLines={1} ellipsizeMode="tail" className='mr-10'>YouTube link</Text>
					</View>

					<View className="w-10/12 self-end border-b-[1px] border-slate-400" />

					<View className="w-11/12 py-4 flex-row items-center space-x-2">
						<View className="mx-4">
							<Ionicons name="logo-linkedin" size={27} color="#0077b5" />
						</View>
						<Text numberOfLines={1} ellipsizeMode="tail" className='mr-10'>LinkedIn link</Text>
					</View>

				</View>

				<TouchableOpacity
					onPress={() => navigation.navigate('ResetPassword')}
					className="py-2 flex items-center rounded bg-emerald-400"
				>
					<Text className="text-white text-lg">Change Password</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="py-2 flex items-center rounded"
					onPress={handleLogout}
					style={{ backgroundColor: "#f07777" }}
				>
					<Text className="text-white text-lg">Logout</Text>
				</TouchableOpacity>

				{/* <View className='space-y-8'>
				
                    <View className='flex-row w-3/5 justify-between'>
                        <Text>Name : </Text>
                        <TextInput value={username} onChangeText={(text) => setUsername(text)} className='w-32 h-8 bg-white' />
                    </View>
                    <View className='flex-row w-3/5 justify-between'>
                        <Text>Password : </Text>
                        <TextInput value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true} className='w-32 h-8 bg-white' />
                    </View>

                    <TouchableOpacity className='bg-green-500 py-2 flex items-center' onPress={handleUpdate}>
                        <Text className='text-white text-lg'>{loading ? <ActivityIndicator /> : 'Update'}</Text>
                    </TouchableOpacity>

                </View>*/}

			</ScrollView>

			<MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

			{/* Bottom Sheet navigation */}
			<BottomSheetNav bottomSheetRef={bottomSheetRef} />

		</SafeAreaView>
	);
};

export default Profile;
