import { View, Text, StyleSheet, TouchableOpacity, Clipboard, ToastAndroid, StatusBar } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const ChatBubble = ({ role, text }) => {
    const handleCopyText = () => {
        Clipboard.setString(text);
        showToast();
    };

    const showToast = () => {
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
    };

    const renderCopyButton = () => {
        if (role === 'model') {
            return (
                <TouchableOpacity onPress={handleCopyText} style={styles.copyButton}>
                    <Ionicons name="copy" size={20} color="#fff" />
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <View>

            <View
                style={[
                    styles.chatItem,
                    role === "user" ? styles.userChatItem : styles.modelChatItem,
                ]}
            >
                <Text style={styles.chatText}>{text}</Text>
                {renderCopyButton()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        maxWidth: "99%",
        position: "relative",
    },
    userChatItem: {
        alignSelf: "flex-end",
        backgroundColor: "rgb(16 185 129)",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    modelChatItem: {
        alignSelf: "flex-start",
        backgroundColor: "#007AFF",
        maxWidth: "90%",
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    chatText: {
        fontSize: 16,
        color: "#fff"
    },
    copyButton: {
        alignSelf: "flex-end",
        marginTop: 15,
    },
});

export default ChatBubble;
