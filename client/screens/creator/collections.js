import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text } from 'react-native';

import Navigation from '../../components/Navigation';
import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';

const Collections = ({ navigation }) => {

    const bottomSheetRef = useRef(null);

    return (
        <SafeAreaView className='w-screen h-full flex pt-12'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation navigation={navigation} />

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            <ScrollView className='bg-red-300 h-full flex space-y-8 -z-10 self-center' style={{ width: '95%' }}>
                <Text>Collections</Text>
            </ScrollView>

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} navigation={navigation} />

        </SafeAreaView>
    );
};

export default Collections;

