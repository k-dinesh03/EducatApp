import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, StatusBar } from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const ClassDetailsScreen = ({ route }) => {
    // Extracting class details from route params
    const { class: cls } = route.params;

    // Dummy video URL and class notes content (replace with actual data)
    const teacherVideos = {
        'Mr. Smith': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'Ms. Johnson': 'https://example.com/ms-johnson-video.mp4',
        'Mr. Davis': 'https://example.com/mr-davis-video.mp4',
    };

    const teacherClassNotes = {
        'Mr. Smith': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod vitae felis nec sodales. Duis ut odio risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras vestibulum risus ut erat rutrum lacinia. Ut auctor bibendum metus. Nullam at mi vel mauris ullamcorper ullamcorper. Ut euismod augue vel quam finibus lacinia. Morbi id dui in sapien lobortis dictum. Fusce ullamcorper, turpis non lobortis fringilla, eros orci accumsan felis, et gravida enim sem eget nisi. Donec congue, dolor sit amet rutrum dapibus, est urna commodo libero, nec fringilla nisi elit ac leo. Sed id lectus eget leo feugiat egestas. Integer eu sodales orci, et gravida velit. Mauris rutrum aliquam fermentum. Duis nec ante et nisi elementum suscipit in eu justo. Duis et felis id augue condimentum rhoncus. Donec fringilla nunc nec volutpat. Donec eu mi tristique, lobortis odio vitae, molestie mi. Vivamus tincidunt ex vitae erat tempus, et dapibus arcu rhoncus.',
        'Ms. Johnson': 'Sed euismod vitae felis nec sodales. Vivamus aliquet mi vel nulla faucibus pharetra. Vestibulum aliquam nisi in consequat venenatis. Maecenas congue tempus odio. Duis lacinia, odio sed ultricies fringilla, lorem risus aliquet urna, sed vehicula purus tortor non felis. In hac habitasse platea dictumst. Nunc et diam ut eros convallis eleifend non a dolor. Nulla rhoncus, nunc in suscipit luctus, libero mauris luctus felis, at auctor enim sem eget purus. Sed ullamcorper ex at posuere consectetur. Aliquam fringilla diam eu eleifend efficitur.',
        'Mr. Davis': 'Duis ut odio risus. Phasellus et imperdiet mi. Morbi quis dapibus magna. Suspendisse potenti. Nulla facilisi. Fusce maximus ante in nulla aliquet, ut pharetra felis dapibus. Duis vel leo ut odio ullamcorper dignissim non vitae risus. Duis blandit massa a nibh fringilla, in iaculis ipsum venenatis. Cras sollicitudin, purus in viverra dictum, nisi neque elementum quam, sit amet tincidunt arcu metus et dolor. Curabitur ac felis ac erat consequat aliquam. Proin finibus ex a purus accumsan, a feugiat enim dictum. Nullam dictum, magna sit amet consectetur tempus, purus purus iaculis risus, vitae commodo odio arcu nec ex. Fusce in purus quis est commodo consectetur a sed ipsum. Ut at felis in ex interdum dignissim id id metus. Sed auctor nisl et fermentum facilisis. Donec finibus aliquet lectus sit amet mattis. Aenean ut odio suscipit, efficitur lorem sit amet, mattis enim.',
    };

    // State to track whether to show full class notes
    const [showFullClassNotes, setShowFullClassNotes] = useState(false);

    // Function to toggle full class notes visibility
    const toggleClassNotes = () => {
        setShowFullClassNotes(!showFullClassNotes);
    };

    // Get video URL and class notes for the selected teacher
    const videoUrl = teacherVideos[cls.teacher];
    const initialClassNotes = teacherClassNotes[cls.teacher];

    // Slice class notes to show only a portion
    const classNotes = showFullClassNotes ? initialClassNotes : initialClassNotes.split('.').slice(0, 8).join('.') + '.';

    // Function to handle PDF file download
    const handleDownloadPDF = async () => {
        const pdfUri = 'http://www.pdf995.com/samples/pdf.pdf'; // Replace with the actual PDF URL
        const fileUri = FileSystem.documentDirectory + 'class_notes.pdf';
        await FileSystem.downloadAsync(pdfUri, fileUri);
        Linking.openURL(fileUri);
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <View style={styles.classDetailsContainer}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classInfo}>Teacher: {cls.teacher}</Text>
                <Text style={styles.classInfo}>Time: {cls.time}</Text>
            </View>
            <View style={styles.classDetailsContainer}>
                <Text style={styles.sectionHeader}>Video</Text>
                <Video
                    source={{ uri: videoUrl }}
                    style={styles.videoPlayer}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    shouldPlay
                />
            </View>
            <View style={styles.classDetailsContainer}>
                <Text style={styles.sectionHeader}>Class Notes</Text>
                <Text style={styles.classNotes}>{classNotes}</Text>
                {!showFullClassNotes && (
                    <TouchableOpacity onPress={toggleClassNotes}>
                        <Text style={styles.seeMore}>See More</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleDownloadPDF}>
                    <Text style={styles.downloadPDF}>Download PDF</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    },
    classDetailsContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    className: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    classInfo: {
        fontSize: 16,
        marginBottom: 5,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    videoPlayer: {
        height: 200,
        marginBottom: 10,
    },
    classNotes: {
        fontSize: 16,
    },
    seeMore: {
        color: 'blue',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    downloadPDF: {
        color: 'blue',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});

export default ClassDetailsScreen;
