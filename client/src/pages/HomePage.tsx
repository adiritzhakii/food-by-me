import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IPostBox } from '../components/PostBox';
import { RootState } from '../store/store';
import axios from 'axios';
import PostBox from '../components/PostBox';
import Pagination from '../components/Pagination';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setPosts } from '../store/postsSlice'

type Post = {
    _id: string;
    title: string;
    content: string;
    owner: string;
    likes: [];
    picture?: string;
}

const POSTS_PER_PAGE = 3;

const HomePage: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { posts } = useSelector((state: RootState) => state.posts)
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/posts');
            const rawPosts = response.data;

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
            // Sort posts by newest first (assuming _id contains timestamp)
            const sortedPosts = processedPosts.sort((a: IPostBox, b: IPostBox) => {
                return b._id.localeCompare(a._id);
            });
            dispatch(setPosts(sortedPosts));
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPosts();
    }, [token]);

    // Re-fetch when posts change or when returning to the page
    useEffect(() => {
        const handleFocus = () => {
            fetchPosts();
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [token]);

    // Re-fetch when posts array changes (new post added, edited, or deleted)
    useEffect(() => {
        if (posts.some(post => !post.user?.name || !post.user?.avatar)) {
            fetchPosts();
        }
    }, [posts]);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const currentPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {loading ? (
                <p>Loading posts...</p>
            ) : (posts.length == 0) ? <h1>No Posts Exist</h1> : (
                <>
                    {currentPosts.map((post) => <PostBox key={post._id} post={post} />)}
                    <Box display="flex" justifyContent="center" alignItems="center" mr={"10%"} mt={4} mb={4}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                </>
            )}
        </>
    );
};

export default HomePage;