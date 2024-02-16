import React, { useRef, useContext } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';
import { AuthContext } from '../context/authContext';

import Navigation from '../components/Navigation';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';

const Home = ({ navigation }) => {

    //global state
    const { state } = useContext(AuthContext)
    const bottomSheetRef = useRef(null)

    return (
        <SafeAreaView className='w-screen h-full flex pt-10'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation navigation={navigation} />

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            <ScrollView className='h-full bg-red-400 self-center -z-10' style={{ width: '95%' }}>

                <Text>{JSON.stringify(state, null, 4)}</Text>

            </ScrollView>

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} navigation={navigation} />

        </SafeAreaView>
    );
};

export default Home;

