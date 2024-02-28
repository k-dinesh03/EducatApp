import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';

import Navigation from '../components/Navigation';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';

const Quiz = ({ route }) => {

    const bottomSheetRef = useRef(null);
    const questions = route.params?.questions || [];

    return (
        <SafeAreaView className='w-screen h-full flex pt-10 bg-slate-100'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation />

            <ScrollView
                className='h-full self-center -z-10'
                style={{ width: '95%' }}
                showsVerticalScrollIndicator={false}
            >


            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Quiz;

