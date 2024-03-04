import React, { useRef, useContext, useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, RefreshControl } from 'react-native';

import { PostContext } from '../context/postContext';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';
import PostCard from '../components/postCard';

const Explore = () => {

    //global state
    const { posts, getAllPosts } = useContext(PostContext);
    const [refreshing, setRefreshing] = useState(false);

    const bottomSheetRef = useRef(null);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAllPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView className='w-screen h-full flex bg-white'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="light-content"
                translucent={true}
            />

            <ScrollView
                className='h-full self-center -z-10'
                style={{ width: '97%' }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <PostCard posts={posts} />

            </ScrollView>

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Explore;

