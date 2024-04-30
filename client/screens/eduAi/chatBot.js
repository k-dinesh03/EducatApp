import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const GeminiChat = () => {
  const [userMsg, setUserMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
    loadMessages();
  }, []);

  useEffect(() => {
    // Save messages whenever the messages state changes
    saveMessages();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chatMessages');
      if (savedMessages !== null) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (userMsg.trim() === '' || sending) return;

    setSending(true);

    setMessages((prevMessages) => [...prevMessages, { text: userMsg, sender: 'user' }]);

    setUserMsg('');
    try {
      const geminiResponse = await fetchGeminiResponse(userMsg);

      setMessages((prevMessages) => [...prevMessages, { text: geminiResponse, sender: 'gemini' }]);
    } catch (error) {
      console.error('Error receiving Gemini response:', error);
      setMessages((prevMessages) => [...prevMessages, { text: 'An error occurred while processing your request.', sender: 'gemini' }]);
    }

    setSending(false);
  };

  const fetchGeminiResponse = async (userMsg) => {
    try {
      const response = await fetch('http://192.168.117.138:8000/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMsg, conversationHistory: [] }),
      });
      const data = await response.json();
      return data.content;
    } catch (error) {
      throw new Error('Error calling Gemini API:', error);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
  };

  const toggleSpeech = async (index) => {
    if (speakingMessageIndex === index) {
      await Speech.stop();
      setSpeakingMessageIndex(null);
    } else {
      Speech.speak(messages[index].text, { language: 'en', voiceIOS: 'com.apple.ttsbundle.Daniel-compact' });
      setSpeakingMessageIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              { alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start' },
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                { backgroundColor: message.sender === 'user' ? '#007AFF' : '#000' },
                { paddingBottom: message.sender === 'gemini' ? 30 : 10, },
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
              {message.sender === 'gemini' && (
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => copyToClipboard(message.text)}>
                    <FontAwesome name="copy" size={20} color="#fff" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleSpeech(index)}>
                    <FontAwesome name={speakingMessageIndex === index ? "volume-up" : "volume-off"} size={24} color="#fff" style={styles.icon} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here"
          value={userMsg}
          onChangeText={setUserMsg}
        />
        <TouchableWithoutFeedback
        onPress={handleSendMessage}
        disabled={userMsg.trim() === '' || sending}
        >
          <View style={{ backgroundColor:'green', paddingHorizontal:12, borderRadius:50, paddingVertical:12}}>
          <FontAwesome name="send" size={20} color="#fff" />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {sending && <ActivityIndicator style={styles.loader} color="#000" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '95%',
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  loader: {
    alignSelf: 'center',
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    left: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    gap: 10,
  },
  icon: {
    marginLeft: 10,
  },
});

export default GeminiChat;
