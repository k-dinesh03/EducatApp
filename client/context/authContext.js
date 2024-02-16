import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';

//context
const AuthContext = createContext();

//provider
const AuthProvider = ({ children }) => {

    //globel state
    const [state, setState] = useState({
        user: null,
        token: ""
    });

    //initial local storage data
    useEffect(() => {
        const loadLocalStorageData = async () => {
            let data = await AsyncStorage.getItem('@auth');
            let loginData = JSON.parse(data);
            setState({ ...state, user: loginData?.user, token: loginData?.token });
        };
        loadLocalStorageData();
    }, [])

    let token = state && state.token;

    //default axios settings
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.baseURL = 'http://192.168.226.128:8000/api/v1'

    return (
        <AuthContext.Provider value={{ state, setState }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider }