import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LiveCoursesScreen = () => {
    const [liveCourses, setLiveCourses] = useState([]);
    const navigation = useNavigation();

    // Simulated data of live courses (replace with actual API call)
    const fetchLiveCourses = () => {
        // Simulated API call
        const simulatedLiveCourses = [
            { id: 1, title: 'Introduction to React Native', creator: 'John Doe', startTime: '10:00 AM' },
            { id: 2, title: 'Advanced JavaScript Techniques', creator: 'Jane Smith', startTime: '11:30 AM' },
            { id: 3, title: 'Mastering CSS', creator: 'Alice Johnson', startTime: '1:00 PM' },
            // Add more live courses as needed
        ];

        setLiveCourses(simulatedLiveCourses);
    };

    useEffect(() => {
        fetchLiveCourses();
    }, []);

    const handleJoinCourse = (courseId, creator, startTime) => {
        // Navigate to the live course screen
        navigation.navigate('Cource', { courseId, creator, startTime });
    };

    const renderItem = ({ item }) => (
        <Pressable onPress={() => handleJoinCourse(item.id, item.creator, item.startTime)} style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseInfo}>By: {item.creator}</Text>
            <Text style={styles.courseInfo} className='items-center'><View className='bg-red-500 rounded-full h-3 w-3' />{'  '}Live Running </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <FlatList
                data={liveCourses}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

export default LiveCoursesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    courseItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    courseInfo: {
        fontSize: 16,
        marginTop: 5,
    },
    joinButton: {
        alignSelf: 'flex-end',
        color: '#fff',
        backgroundColor: '#007bff',
        padding: 4,
        borderRadius: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        width: 100,
    },
});
