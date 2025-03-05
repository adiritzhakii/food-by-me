import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Posts, { IPostBox } from '../components/PostBox';
import { RootState } from '../store/store';
import axios from 'axios';
import { useGetPostsQuery, useGetAuthGetUserByIdByIdQuery } from '../store/serverApi';
import PostBox from '../components/PostBox';

type Post = {
    _id: string;
    title: string;
    content: string;
    owner: string;
    likes: number;
    picture?: string;
}


const HomePage: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [posts, setPosts] = useState<IPostBox[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/posts');
                const rawPosts = response.data; // Assuming it's an array
                console.log("Posts from server:", rawPosts);

                const postPromises = rawPosts.map(async (post: Post) => {
                    const userResponse = await axios.get(
                        `http://localhost:3000/auth/getUserById/${post.owner}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        }
                    );

                    return {
                        _id: post._id,
                        title: post.title,
                        content: post.content,
                        likes: post.likes,
                        picture: post.picture || '',
                        user: {
                            name: userResponse?.data?.name,
                            avatar: userResponse?.data?.avatar,
                        },
                    } as IPostBox;
                });

                const processedPosts = await Promise.all(postPromises);
                setPosts(processedPosts);
                console.log("Updated posts:", processedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token]);

    console.log(posts);

    return (
        <>
            {loading ? (
                <p>Loading posts...</p>
            ) : (
                posts.map((post) => <PostBox key={post._id} post={post} />)
            )}
        </>
    );
};

export default HomePage;