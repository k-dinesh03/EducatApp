import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

//context
const PostContext = createContext()

const PostProvider = ({ children }) => {

    //state
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [allData, setAllData] = useState([]);

    //get posts
    const getAllPosts = async () => {
        setLoading(true);

        try {
            const { data } = await axios.get('/post/get-posts');
            setLoading(false);
            setPosts(data?.posts);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    //get quizzez
    const getAllQuizzes = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/post/get-quizzes');
            setQuizzes(data?.quizzes);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // get all data (posts and quizzes)
    const getAllData = async () => {
        await Promise.all([getAllPosts(), getAllQuizzes()]);
    };

    // initial data
    useEffect(() => {
        getAllData();
    }, []);

    // update allData when posts or quizzes change
    useEffect(() => {
        setAllData([...posts, ...quizzes]);
    }, [posts, quizzes]);

    return (
        <PostContext.Provider value={{ allData, setAllData, getAllData }}>
            {children}
        </PostContext.Provider>
    )

}

export { PostContext, PostProvider };