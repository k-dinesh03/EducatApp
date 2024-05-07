import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const Course = ({ route }) => {
    const { courseId, creator, startTime } = route.params;
    const [courseDetails, setCourseDetails] = useState(null); // State to store course details

    // Simulated course details (replace with actual API call or data retrieval logic)
    useEffect(() => {
        // Simulated API call to fetch course details based on courseId
        // For demonstration, setting simulated course details after a delay
        const timer = setTimeout(() => {
            const simulatedDetails = {
                title: 'Introduction to React Native',
                creator: creator,
                startTime: startTime,
                description: 'This course covers the basics of React Native development.',
                imageUrl: require('../../assets/images/4.jpg'),
                // Add more course details as needed
            };
            setCourseDetails(simulatedDetails);
        }, 1000);

        return () => clearTimeout(timer); // Clear timeout on component unmount
    }, [courseId]);

    // Function to handle joining the live course
    const handleJoinCourse = () => {
        // Implement logic to join the live course
        console.log(`Joining live ID: ${courseId}`);
    };

    // Render course details if available, otherwise show loading indicator
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {courseDetails ? (
                <>
                    <Text style={styles.header}>{courseDetails.title}</Text>
                    <Text style={styles.subHeader}>By: {courseDetails.creator}</Text>
                    <Text style={styles.subHeader}>Start Time: {courseDetails.startTime}</Text>
                    <Text style={styles.description}>{courseDetails.description}</Text>
                    <Image source={courseDetails.imageUrl} style={styles.image} />
                    {/* Add interactive components or multimedia content here */}
                    <TouchableOpacity onPress={handleJoinCourse} style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>Join Live</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>Loading Live details...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
});

export default Course;
