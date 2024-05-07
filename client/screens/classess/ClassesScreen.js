import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const ClassesScreen = () => {
    // Dummy data for classes
    const classes = [
        { id: 1, name: 'Mobile App Development', teacher: 'Mr. Smith', time: '9:00 AM - 10:30 AM' },
        { id: 2, name: 'Web Development', teacher: 'Ms. Johnson', time: '11:00 AM - 12:30 PM' },
        { id: 3, name: 'Data Science', teacher: 'Mr. Davis', time: '1:00 PM - 2:30 PM' },
        // Add more classes as needed
    ];

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            {classes.map((cls) => (
                <TouchableOpacity key={cls.id} onPress={() => navigation.navigate('ClassDetails', { class: cls })}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.className}>{cls.name}</ListItem.Title>
                            <ListItem.Subtitle style={styles.classInfo}>Teacher: {cls.teacher}</ListItem.Subtitle>
                            <ListItem.Subtitle style={styles.classInfo}>Time: {cls.time}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                </TouchableOpacity>
            ))}
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
        marginBottom: 20,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    classInfo: {
        fontSize: 16,
    },
});

export default ClassesScreen;
