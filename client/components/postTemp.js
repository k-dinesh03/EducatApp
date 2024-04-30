import React, { useRef, useContext, useEffect, useState } from "react";

import { PostContext } from "../context/postContext";
import { useNavigation } from "@react-navigation/native";

import MenuBtn from "../components/menuBtn";
import BottomSheetNav from "../components/bottomSheetNav";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import { Video } from "expo-av";

import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import QuizModal from "./quizModal";

const windowWidth = Dimensions.get("window").width;
const carouselWidth = windowWidth - windowWidth * 0.03;

const PostTemp = ({ route }) => {
  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();

  // from postCard component
  const postId = route.params?.postId || "";
  const videoRef = React.useRef(null);

  const { allData } = useContext(PostContext);
  const [currentPost, setCurrentPost] = useState(null);

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  // Search for the post with the given postId
  useEffect(() => {
    if (postId) {
      const post = allData.find((post) => post._id === postId);
      setCurrentPost(post);
    }
  }, [postId, allData]);

  const carouselRef = useRef(null);

  // Function to check if the URL has a video extension
  const isVideoUrl = (url) => {
    if (url) {
      const videoExtensions = ["mp4", "avi", "mov"];
      return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
    }
    return false;
  };

  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      const newIsMuted = !isMuted;
      setIsMuted(newIsMuted);
      videoRef.current.setIsMutedAsync(newIsMuted);

      const toastMessage = newIsMuted ? "Video Muted" : "Video Unmuted";

      ToastAndroid.showWithGravityAndOffset(
        toastMessage,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        30
      );
    }
  };

  const [quizModal, setQuizModal] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [quizNumber, setQuizNumber] = useState(0);

  const [quizTimes, setQuizTimes] = useState([
    { time: 0, questions: [] },
    { time: 0, questions: [] },
  ]);

  const handleTimes = (quizIndex, field, value) => {
    const updatedQuizTimes = [...quizTimes];
    updatedQuizTimes[quizIndex][field] = value;
    setQuizTimes(updatedQuizTimes);
  };

  const setTimeToQuiz = () => {
    handleTimes(
      0,
      "time",
      currentPost?.quizzes[0].hour * 60 * 60 +
        currentPost?.quizzes[0].minute * 60 +
        currentPost?.quizzes[0].second
    );
    handleTimes(0, "questions", currentPost?.quizzes[0].questions);
    handleTimes(
      1,
      "time",
      currentPost?.quizzes[1].hour * 60 * 60 +
        currentPost?.quizzes[1].minute * 60 +
        currentPost?.quizzes[1].second
    );
    handleTimes(1, "questions", currentPost?.quizzes[1].questions);
  };

  const onPlaybackStatusUpdate = async (status) => {
    const positionInSeconds = status.positionMillis / 1000;

    // Check if the video has reached the time and the modal hasn't been shown yet
    if (positionInSeconds >= quizTimes[quizNumber].time && !isModalShown) {
      await videoRef.current.pauseAsync();
      setQuizModal(true);
      setIsModalShown(true);
    }
  };

  const handleAttendQuiz = () => {
    closeModal();
    videoRef.current.pauseAsync();
    navigation.navigate("Quizz", {
      quiz: quizTimes,
      quizNumber: quizNumber,
      quizTitle: currentPost.quizTitle,
    });
  };

  // Close the modal and resume video playback
  const closeModal = () => {
    setQuizNumber(1);
    setQuizModal(false);
  };

  const renderItem = ({ item }) => {
    const isVideo = isVideoUrl(item);

    if (isVideo) {
      return (
        <View className="w-full h-full">
          <Video
            ref={videoRef}
            source={{ uri: item }}
            paused={false}
            repeat={true}
            style={{ width: "100%", height: "100%" }}
            useNativeControls
            resizeMode="contain"
            isLooping={true}
            isMuted={isMuted}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onLoad={setTimeToQuiz}
          />
          <TouchableOpacity
            className="absolute top-1 right-0 w-9 h-9 rounded-full flex items-center justify-center bg-slate-200"
            onPress={toggleMute}
          >
            {isMuted ? (
              <SimpleLineIcons name="volume-off" size={22} color="black" />
            ) : (
              <SimpleLineIcons name="volume-2" size={22} color="black" />
            )}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Image
          source={{ uri: item }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 5,
            resizeMode: "contain",
          }}
        />
      );
    }
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const pagination_one = (activeSlide, imageLength) => {
    return (
      <Pagination
        dotsLength={imageLength}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 20,
          height: 3.5,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          marginHorizontal: 0,
          paddingHorizontal: 0,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
        containerStyle={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 0,
          paddingVertical: 8,
        }}
      />
    );
  };

  const pagination_two = (activeSlide, imageLength) => {
    return (
      <Pagination
        dotsLength={imageLength}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 7,
          height: 7,
          borderRadius: 5,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          marginHorizontal: 0,
          paddingHorizontal: 0,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
        containerStyle={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 0,
          paddingVertical: 8,
        }}
      />
    );
  };

  //for quiz
  const [selectedAns, setSelectedAns] = useState({});

  const shuffleAnswers = (question) => {
    if (!question) {
      return [];
    }

    const allAnswers = [
      question.correct_answer,
      ...question.incorrect_answers.filter(Boolean),
    ];

    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    return allAnswers.map(
      (answer, index) =>
        answer && (
          <TouchableOpacity
            key={index}
            className={`flex-row justify-between items-center py-2 px-2 border-[1px] rounded-sm`}
          >
            <Text>
              {String.fromCharCode("a".charCodeAt(0) + index)}
              {")"} {answer}
            </Text>
          </TouchableOpacity>
        )
    );
  };

  const scrollViewRef = useRef();
  const goToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleQuizSubmit = () => {
    console.log("Submitted quiz");
  };

  return (
    <SafeAreaView className="w-screen h-full flex bg-white">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />

      <QuizModal
        quizModal={quizModal}
        closeModal={closeModal}
        handleAttendQuiz={handleAttendQuiz}
      />

      <ScrollView
        className="h-full self-center -z-10 py-1"
        style={{ width: "97%" }}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {/* From postCard Component */}

        {currentPost ? (
          <View>
            {(currentPost?.postType === "images" ||
              currentPost?.postType === "videos" ||
              currentPost?.postType === "videowithquiz") && (
              <View className="w-full h-full space-y-3 mb-2">
                <View className="flex-row items-center justify-end space-x-1 mt-3">
                  <Text className="text-sm">Posted by</Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-medium tracking-wider">
                      {currentPost?.postedBy?.username}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="w-full h-96 border-[1px] border-slate-300 rounded-md">
                  <Carousel
                    layout={"default"}
                    ref={carouselRef}
                    data={currentPost?.images}
                    sliderWidth={carouselWidth}
                    itemWidth={carouselWidth}
                    renderItem={renderItem}
                    onSnapToItem={(index) => setActiveSlide(index)}
                  />

                  {currentPost?.images.length > 1 && (
                    <View className="absolute top-1 right-1 bg-white w-[42px] h-[26px] rounded-full flex items-center justify-center">
                      <Text className="tracking-widest mb-[1px]">
                        {activeSlide + 1}/{currentPost?.images.length}
                      </Text>
                    </View>
                  )}
                </View>

                {currentPost?.images.length < 4
                  ? pagination_one(activeSlide, currentPost?.images.length)
                  : pagination_two(activeSlide, currentPost?.images.length)}

                <Text className="font-semibold tracking-wider text-3xl">
                  {currentPost.title}
                </Text>

                <View className="flex-row items-center space-x-3 px-1 my-2">
                  <View className="flex-row items-center space-x-1">
                    <TouchableOpacity className="items-center">
                      <AntDesign name="staro" color="black" size={21} />
                    </TouchableOpacity>
                    <Text className="font-medium">{currentPost?.rating}</Text>
                  </View>

                  <View className="flex-row items-center space-x-1">
                    <TouchableOpacity className="items-center">
                      <Ionicons name="heart-outline" size={22} color="black" />
                    </TouchableOpacity>
                    <Text className="font-medium">
                      {currentPost?.likes} Likes
                    </Text>
                  </View>
                </View>

                <View className="w-full flex-row self-center items-center justify-between border-[1px] border-slate-400 p-[3px] rounded-md">
                  {isDescriptionOpen ? (
                    <TouchableOpacity
                      className="h-14 bg-violet-400 items-center justify-center rounded-md"
                      style={{ width: "49%" }}
                      onPress={() => {
                        setIsDescriptionOpen(true);
                      }}
                    >
                      <Text className="text-lg font-medium tracking-wider text-white">
                        Description
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="h-14 bg-violet-300 items-center justify-center rounded-md"
                      style={{ width: "49%" }}
                      onPress={() => {
                        setIsDescriptionOpen(!isDescriptionOpen),
                          setIsCommentOpen(!isCommentOpen);
                      }}
                    >
                      <Text className="text-lg font-medium tracking-wider text-white">
                        Description
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isCommentOpen ? (
                    <TouchableOpacity
                      className="h-14 bg-violet-400 items-center justify-center rounded-md"
                      style={{ width: "49%" }}
                      onPress={() => {
                        setIsCommentOpen(true), setIsDescriptionOpen(false);
                      }}
                    >
                      <Text className="text-lg font-medium tracking-wider text-white">
                        Comments
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="h-14 bg-violet-300 items-center justify-center rounded-md"
                      style={{ width: "49%" }}
                      onPress={() => {
                        setIsCommentOpen(!isCommentOpen),
                          setIsDescriptionOpen(!isDescriptionOpen);
                      }}
                    >
                      <Text className="text-lg font-medium tracking-wider text-white">
                        Comments
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isCommentOpen && (
                  <View className="space-y-1 py-[2px] px-1 mb-2">
                    <Text className="font-medium tracking-wider text-lg">
                      Comments
                    </Text>

                    <View className="flex-row space-x-2 items-center">
                      <View className="h-[30px] w-[30px] rounded-full">
                        <Image
                          source={require("../assets/images/girl.png")}
                          style={styles.profilePic}
                        />
                      </View>

                      <TextInput
                        placeholder="Share your thoughts"
                        className="w-3/4 py-1 border-b-[1px] border-slate-400"
                        clearButtonMode="always"
                      />
                    </View>
                  </View>
                )}

                {isDescriptionOpen && (
                  <View className="space-y-1 py-1 px-1 mb-2">
                    <Text className="font-medium tracking-wider text-lg">
                      Description
                    </Text>
                    <Text>{currentPost.description}</Text>
                  </View>
                )}
              </View>
            )}

            {currentPost?.postType === "quiz" && (
              <View className="w-full h-full space-y-3 mb-2">
                <View className="flex-row items-center justify-end space-x-1 mt-3">
                  <Text className="text-sm">Posted by</Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-medium tracking-wider">
                      {currentPost?.postedBy?.username}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="font-semibold tracking-wider text-3xl">
                  {currentPost.title}
                </Text>

                <View className="flex-row items-center space-x-3 px-1 my-2">
                  <View className="flex-row items-center space-x-1">
                    <TouchableOpacity className="items-center">
                      <AntDesign name="staro" color="black" size={21} />
                    </TouchableOpacity>
                    <Text className="font-medium">{currentPost?.rating}</Text>
                  </View>

                  <View className="flex-row items-center space-x-1">
                    <TouchableOpacity className="items-center">
                      <Ionicons name="heart-outline" size={22} color="black" />
                    </TouchableOpacity>
                    <Text className="font-medium">
                      {currentPost?.likes} Likes
                    </Text>
                  </View>
                </View>

                <View className="space-y-3 mb-5">
                  <View className="flex-row justify-between items-center h-[45px] px-2 border-[1px] border-emerald-700 rounded-md">
                    <Text
                      className="font-semibold tracking-wider text-emerald-700"
                      style={{ fontSize: 16 }}
                    >
                      Answered
                    </Text>
                    <Text
                      className="font-semibold tracking-wider text-emerald-700"
                      style={{ fontSize: 16 }}
                    >
                      0
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center h-[45px] px-2 border-[1px] border-red-500 rounded-md">
                    <Text
                      className="font-semibold tracking-wider text-red-700"
                      style={{ fontSize: 16 }}
                    >
                      Unanswered
                    </Text>
                    <Text
                      className="font-semibold tracking-wider text-red-700"
                      style={{ fontSize: 16 }}
                    >
                      0
                    </Text>
                  </View>
                </View>

                {currentPost?.quizQuest.map((question, i) => {
                  return (
                    <View className="space-y-2 mb-5" key={i}>
                      <Text className="tracking-wide">
                        {i + 1}. {question.question}
                      </Text>

                      {shuffleAnswers(question)}

                      <TouchableOpacity>
                        <Text className="underline">Explanation</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}

                <TouchableOpacity
                  className="mb-5 w-1/3 items-center self-center bg-emerald-500 py-[6px] rounded-md"
                  onPress={handleQuizSubmit}
                >
                  <Text className="text-lg text-white">Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <Text className="self-center">Loading...</Text>
        )}
      </ScrollView>

      {currentPost?.postType === "quiz" ? (
        <TouchableOpacity
          className="rounded-full h-12 w-12 flex items-center justify-center bg-white border-[1px] border-gray-400 absolute bottom-3 right-3"
          onPress={goToTop}
        >
          <MaterialIcons name="keyboard-arrow-up" size={26} color="black" />
        </TouchableOpacity>
      ) : (
        <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />
      )}

      {/* Bottom Sheet navigation */}
      <BottomSheetNav bottomSheetRef={bottomSheetRef} navigation={navigation} />
    </SafeAreaView>
  );
};

export default PostTemp;

const styles = StyleSheet.create({
  profilePic: {
    height: "100%",
    width: "100%",
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "#aaa",
    objectFit: "cover",
  },
});
