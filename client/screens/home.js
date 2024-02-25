import React, { useRef, useContext, useCallback } from 'react';
import { SafeAreaView, ScrollView, StatusBar, RefreshControl } from 'react-native';

import { PostContext } from '../context/postContext';

import Navigation from '../components/Navigation';
import MenuBtn from '../components/menuBtn';
import BottomSheetNav from '../components/bottomSheetNav';
import PostCard from '../components/postCard';

const Home = () => {

    //global state
    const { posts, getAllPosts } = useContext(PostContext);
    const [refreshing, setRefreshing] = useContext(false);

    const bottomSheetRef = useRef(null);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAllPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView className='w-screen h-full flex pt-10 bg-slate-100'>

            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Top navigation */}
            <Navigation />

            <MenuBtn handleOpen={() => bottomSheetRef.current?.snapToIndex(0)} />

            <ScrollView
                className='h-full self-center -z-10'
                style={{ width: '95%' }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <PostCard posts={posts} />

            </ScrollView>

            {/* Bottom Sheet navigation */}
            <BottomSheetNav bottomSheetRef={bottomSheetRef} />

        </SafeAreaView>
    );
};

export default Home;

