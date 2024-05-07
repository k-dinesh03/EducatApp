import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Button, StatusBar, TouchableWithoutFeedback, Alert, } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SubscriptionScreen = () => {
    const [subscriptionPlan, setSubscriptionPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [paymentOption, setPaymentOption] = useState(null);
    const [creditCardInfo, setCreditCardInfo] = useState({ number: '', month: '', cvv: '' });
    const [upiID, setUpiID] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [subscriptionEnabled, setSubscriptionEnabled] = useState(true);


    useEffect(() => {
        AsyncStorage.getItem('subscriptionEnabled').then((value) => {
            if (value === 'false') {
                setSubscriptionEnabled(false);
            }
        });
    }, []);

    const plans = [
        { name: 'Basic', price: 100 },
        { name: 'Premium', price: 200 },
        { name: 'Pro', price: 300 },
    ];

    const handleSubscription = (plan) => {
        if (!subscriptionEnabled) return;
        setSubscriptionPlan(plan);
        setShowModal(true);
    };

    const handlePaymentOption = (option) => {
        setPaymentOption(option);
    };

    const handleCreditCardPayment = () => {
        // console.log('Credit Card Info:', creditCardInfo);
        setShowModal(false);
        setShowSuccessModal(true);
        disableSubscription();
        showAlert(`Subscribed to ${subscriptionPlan.name} Plan!`);
    };

    const handleUpiPayment = () => {
        // console.log('UPI ID:', upiID);
        setShowModal(false);
        setShowSuccessModal(true);
        disableSubscription();
        showAlert(`Subscribed to ${subscriptionPlan.name} Plan!`);
    };

    const disableSubscription = () => {
        AsyncStorage.setItem('subscriptionEnabled', 'false');
        AsyncStorage.setItem('subcriptionPlan', subscriptionPlan.name);
        setSubscriptionEnabled(false);
    };

    const showAlert = (message) => {
        Alert.alert(
            'Subscription Success',
            message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <Text style={styles.title}>Choose a Subscription Plan</Text>
            <View style={styles.planContainer}>
                {plans.map((plan, index) => (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={() => handleSubscription(plan)}
                    >
                        <View style={[styles.planCard, !subscriptionEnabled && styles.disabledPlan]}>
                            <Text style={styles.planName}>{plan.name} Plan</Text>
                            <Text style={styles.planPrice}>Rs.{' '}{plan.price}</Text>
                            <Text style={styles.subscribeText}>{subscriptionEnabled ? 'Subscribe' : 'Disabled'}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Payment Option</Text>
                        <TouchableOpacity
                            style={styles.paymentOption}
                            onPress={() => handlePaymentOption('Credit Card')}
                        >
                            <Text style={styles.paymentOptionText}>Credit Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.paymentOption}
                            onPress={() => handlePaymentOption('UPI')}
                        >
                            <Text style={styles.paymentOptionText}>UPI</Text>
                        </TouchableOpacity>
                        <View style={styles.inputContainer}>
                            {paymentOption === 'Credit Card' && (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Credit Card Number"
                                        value={creditCardInfo.number}
                                        onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, number: text })}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Expiration Month"
                                        value={creditCardInfo.month}
                                        onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, month: text })}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="CVV"
                                        value={creditCardInfo.cvv}
                                        onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, cvv: text })}
                                    />
                                    <Button title="Pay" onPress={handleCreditCardPayment} />
                                </>
                            )}
                            {paymentOption === 'UPI' && (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter UPI ID"
                                        value={upiID}
                                        onChangeText={(text) => setUpiID(text)}
                                    />
                                    <Button title="Submit" onPress={handleUpiPayment} />
                                </>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {subscriptionPlan && (
                <Text style={styles.subscriptionMessage}>
                    Subscribed to {subscriptionPlan.name} Plan!
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    planContainer: {
        flexDirection: 'col',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
        height: '55%',
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        elevation: 3,
    },
    disabledPlan: {
        opacity: 0.5,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    planPrice: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    subscribeText: {
        color: '#007bff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    paymentOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    paymentOptionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    inputContainer: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    successModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '50%',
    },
    successMessage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4caf50',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    okButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        width: '80%',
    },
    okButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    subscriptionMessage: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4caf50',
    },
});

export default SubscriptionScreen;
