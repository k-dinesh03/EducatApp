import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text } from 'react-native';

import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';
import { useNavigation } from '@react-navigation/native';

const Collections = () => {

    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);

    return (
        <SafeAreaView className='w-screen h-full flex bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <ScrollView className='h-full flex space-y-8 -z-10 self-center' style={{ width: '97%' }} showsVerticalScrollIndicator={false}>
                <Text>Collections</Text>
            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Collections;

