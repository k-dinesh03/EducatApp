import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Video } from 'expo-av';

const Course = ({ route }) => {
    const { courseId, creator, startTime } = route.params;
    const [courseDetails, setCourseDetails] = useState(null);
    const [showLive, setShowLive] = useState(false);
    const [hideImage, setHideImage] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            const simulatedDetails = {
                title: 'Introduction to React Native',
                creator: creator,
                startTime: startTime,
                description: 'This course covers the basics of React Native development.',
                imageUrl: require('../../assets/images/4.jpg'),
            };
            setCourseDetails(simulatedDetails);
        }, 1000);

        return () => clearTimeout(timer);
    }, [courseId]);

    const handleJoinCourse = () => {
        console.log(`Joining live ID: ${courseId}`);
        setShowLive(true);
        setHideImage(true);
    };

    const handleSendChatMessage = () => {
        if (messageInput.trim() !== '') {
            setChatMessages([...chatMessages, { id: chatMessages.length, message: messageInput }]);
            setMessageInput('');
        }
    };

    return (
        <View style={styles.container}>
            {courseDetails ? (
                <>
                    <Text style={styles.header}>{courseDetails.title}</Text>
                    <Text style={styles.subHeader}>By: {courseDetails.creator}</Text>
                    <Text style={styles.subHeader}>Start Time: {courseDetails.startTime}</Text>
                    <Text style={styles.description}>{courseDetails.description}</Text>
                    {!hideImage && <Image source={courseDetails.imageUrl} style={styles.image} />}
                    {!showLive && (
                        <TouchableOpacity onPress={handleJoinCourse} style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join Live</Text>
                        </TouchableOpacity>
                    )}
                    {showLive && (
                        <>
                            <Video
                                source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                                style={styles.video}
                                useNativeControls
                                resizeMode="contain"
                            />
                            <FlatList
                                data={chatMessages}
                                renderItem={({ item }) => (
                                    <Text key={item.id}>{item.message}</Text>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                style={styles.chat}
                            />
                            <TextInput
                                placeholder="Type your message..."
                                onChangeText={setMessageInput}
                                value={messageInput}
                                onSubmitEditing={handleSendChatMessage}
                                style={styles.input}
                            />
                        </>
                    )}
                </>
            ) : (
                <Text>Loading Live details...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    joinButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    joinButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    video: {
        width: '100%',
        height: 300,
        marginBottom: 20,
        top: -40,
    },
    chat: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
});

export default Course;
