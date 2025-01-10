import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, TextField, Button } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';

interface Post {
    id: number;
    content: string;
    likes: number;
    comments: string[];
}

const initialPosts: Post[] = [
    { id: 1, content: 'This is the first post', likes: 0, comments: [] },
    { id: 2, content: 'This is the second post', likes: 0, comments: [] },
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
        <div style={{ padding: '16px', marginTop: '30px' }}>
            {posts.map(post => (
                <Card key={post.id} style={{ marginBottom: '16px' }}>
                    <CardContent>
                        <Typography variant="body1">{post.content}</Typography>
                        <div>
                            {post.comments.map((comment, index) => (
                                <Typography key={index} variant="body2">{comment}</Typography>
                            ))}
                        </div>
                    </CardContent>
                    <CardActions>
                        <div style={{ position: 'relative' }}>
                            <IconButton onClick={() => handleLike(post.id)}>
                                <ThumbUp />
                            </IconButton>
                            <Typography
                                variant="caption"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    transform: 'translate(50%, -50%)',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 6px',
                                }}
                            >
                                {post.likes}
                            </Typography>
                        </div>
                        <IconButton onClick={() => setSelectedPostId(post.id)}>
                            <Comment />
                        </IconButton>
                    </CardActions>
                    {selectedPostId === post.id && (
                        <CardContent style={{ backgroundColor: '#f0f2f5', borderTop: '1px solid #e0e0e0' }}>
                            <TextField
                                label="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                fullWidth
                                variant="outlined"
                                size="small"
                                style={{ marginBottom: '8px' }}
                            />
                            <Button 
                                onClick={() => handleComment(post.id)} 
                                variant="contained" 
                                color="primary"
                                size="small"
                            >
                                Submit
                            </Button>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default Posts;