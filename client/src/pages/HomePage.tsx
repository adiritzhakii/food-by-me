import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Posts, { IPostBox } from '../components/PostBox';
import { RootState } from '../store/store';
import axios from 'axios';
import PostBox from '../components/PostBox';
import Pagination from '../components/Pagination';
import { Box } from '@mui/material';

type Post = {
    _id: string;
    title: string;
    content: string;
    owner: string;
    likes: number;
    picture?: string;
}

const POSTS_PER_PAGE = 3;

const HomePage: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [posts, setPosts] = useState<IPostBox[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/posts');
                const rawPosts = response.data; // Assuming it's an array

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
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token]);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const currentPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {loading ? (
                <p>Loading posts...</p>
            ) : (
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