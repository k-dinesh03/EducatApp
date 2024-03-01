import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

import Navigation from '../../components/Navigation';
import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';

const Quizz = ({ route }) => {

    const bottomSheetRef = useRef(null);
    const quizSet = route.params?.quiz || {};
    console.log(JSON.stringify(quizSet));

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

                <View className='w-full h-full py-1 space-y-3'>

                    <Text className='text-lg font-semibold tracking-wider'>Quiz</Text>

                    <View>

                    </View>

                </View>

            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Quizz;

