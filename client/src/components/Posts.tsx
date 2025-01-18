import React, { useState } from 'react';
import { Card, CardActions, Typography, IconButton, TextField, Button, Avatar, Grid } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';

interface Post {
    id: number;
    content: string;
    likes: number;
    comments: string[];
    user: {
        name: string;
        avatar: string;
    };
    image?: string; // Optional image URL
}

const initialPosts: Post[] = [
    {
        id: 1,
        content: 'This is a placeholder post. The content goes here.',
        likes: 0,
        comments: ['Placeholder comment 1', 'Placeholder comment 2'],
        user: { name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        content: 'Another placeholder post for testing the layout.',
        likes: 0,
        comments: [],
        user: { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        content: 'Another placeholder post for testing the layout.',
        likes: 0,
        comments: [],
        user: { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 4,
        content: 'Another placeholder post for testing the layout.',
        likes: 0,
        comments: [],
        user: { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
        image: 'https://via.placeholder.com/150',
    },
];

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [comment, setComment] = useState<string>('');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const handleLike = (id: number) => {
        setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
    };

    const handleComment = (id: number) => {
        if (comment.trim()) {
            setPosts(posts.map(post => post.id === id ? { ...post, comments: [...post.comments, comment] } : post));
            setComment('');
            setSelectedPostId(null);
        }
    };

    return (
        <div style={{ padding: '16px', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {posts.map(post => (
                <Card
                    key={post.id}
                    style={{
                        marginBottom: '16px',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '16px',
                        alignItems: 'center',
                        width: '80%',
                    }}
                >
                    {/* Left side: User info and content */}
                    <Grid container spacing={2} style={{ flex: 1 }}>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <Avatar src={post.user.avatar} alt={post.user.name} style={{ marginRight: '8px' }} />
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                {post.user.name || 'Placeholder Name'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">{post.content || 'Placeholder content goes here.'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <CardActions>
                                <IconButton onClick={() => handleLike(post.id)}>
                                    <ThumbUp />
                                </IconButton>
                                <Typography variant="caption" style={{ marginLeft: '8px' }}>
                                    {post.likes || 0}
                                </Typography>
                                <IconButton onClick={() => setSelectedPostId(post.id)}>
                                    <Comment />
                                </IconButton>
                            </CardActions>
                        </Grid>
                    </Grid>

                    {/* Right side: Image */}
                    <div style={{ flexShrink: 0, marginLeft: '16px' }}>
                        <img
                            src={post.image || 'https://via.placeholder.com/150'}
                            alt="Post"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default Posts;