import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

export default function Launch() {

    const navigation = useNavigation();

    return (
        <View style={styles.container} className='h-screen flex justify-between mt-10'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <Image
                className='w-80 h-60 self-center'
                source={require('../../assets/images/Educat-logo.png')}
            />

            <Image
                className='w-full h-96'
                source={require('../../assets/images/launchPage.png')}
            />

            <View style={styles.buttonContainer} className='self-center py-16'>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => navigation.navigate('Register')}
                    className='flex justify-center items-center'
                >
                    <Text style={styles.register} className='text-emerald-500'>Register</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={() => navigation.navigate('SignIn')}
                    className='bg-emerald-500 flex justify-center items-center'
                >
                    <Text style={styles.signin}>Sign in</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    appLogo: {
        width: '100%',
        height: '30%',
        backgroundColor: 'green'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-around',
    },
    registerButton: {
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingHorizontal: 20,
        elevation: 3,
    },
    signInButton: {
        borderRadius: 50,
        paddingHorizontal: 20,
        elevation: 3
    },
    signin: {
        fontSize: 19,
        color: 'white',
        padding: 8,
        paddingHorizontal: 16,
        fontWeight: 'bold',
        letterSpacing: 0.8
    },
    register: {
        fontSize: 19,
        padding: 8,
        paddingHorizontal: 16,
        fontWeight: 'bold',
        letterSpacing: 0.8
    }
});
