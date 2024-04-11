import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { PostContext } from '../context/postContext';
import PostCard from './postCard';

const GetUsersPosts = () => {

    const { allData, getAllData } = useContext(PostContext);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAllData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View>
            <ScrollView
                className='h-full w-full self-center -z-10'
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <PostCard allData={allData} />

            </ScrollView>
        </View>
    )
}

export default GetUsersPosts