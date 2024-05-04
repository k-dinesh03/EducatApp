import React, { useRef, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import MenuBtn from '../../components/menuBtn';
import BottomSheetNav from '../../components/bottomSheetNav';
import { Agenda } from 'react-native-calendars';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

const Meetings = () => {

    const bottomSheetRef = useRef(null);

    const [items, setItems] = useState({})

    const renderItem = ({ name }) => {
        return (
            <TouchableOpacity className='bg-red-500 mr-5 mt-10'>
                <View className='shadow-lg shadow-black flex-1 bg-white h-12'>
                    <View className='flex-row justify-between items-center bg-yellow-200'>
                        <Text>
                            {name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView className='w-screen h-full flex bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            <View className='h-full w-[97%] self-center -z-10'>

                <Agenda
                    items={items}
                    selected={'2017-05-16'}
                    showClosingKnob={true}
                    renderItem={renderItem}
                />

            </View>

            <View className='h-10 w-10 rounded-full bg-white border shadow-md shadow-slate-600'>

            </View>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Meetings;

