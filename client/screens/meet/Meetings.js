import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
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

    const loadItems = (day) => {

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }

            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });

            setItems(newItems)

        }, 1000);
    }

    const renderItem = ({ name, height }) => {
        return (
            <TouchableOpacity className='bg-red-500 mr-5 mt-10'>
                <View className='shadow-lg shadow-black flex-1 bg-white' style={{ height: height }}>
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

            <View
                className='h-full self-center -z-10'
                style={{ width: '97%' }}
            >

                <Agenda
                    items={items}
                    loadItemsForMonth={loadItems}
                    selected={'2017-05-16'}
                    showClosingKnob={true}
                    renderItem={renderItem}
                />

            </View>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Meetings;

