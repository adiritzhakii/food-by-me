import React from 'react';
import { Card, CardActions, Typography, IconButton, Avatar, Box } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export interface IPostBox {
  _id: string;
  title: string;
  content: string;
  likes: number;
  user: {
    name: string;
    avatar: string;
  };
  picture?: string;
}

interface PostBoxProps {
  post: IPostBox;
}

const PostBox: React.FC<PostBoxProps> = ({ post }) => {


  return (
    <div
      style={{
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Name and Avatar Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#242525',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          width: '80%',
        }}
      >
        <Avatar src={post.user?.avatar || 'https://via.placeholder.com/150'} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {post.user?.name || 'Placeholder Name'}
        </Typography>
      </Box>

      <Card
        style={{
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'row',
          width: '80%',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          minHeight: '300px',
        }}
      >
        {/* Left Section: Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}
        >
          {/* Post Title */}
          <Typography
            variant="h6"
            style={{
              fontWeight: 'bold',
              textAlign: 'left',
              marginBottom: '16px',
            }}
          >
            {post.title || 'Placeholder Title'}
          </Typography>

          {/* Post Content */}
          <Typography variant="h6" style={{ marginBottom: '16px' }}>
            {post.content || 'Placeholder content goes here.'}
          </Typography>

          {/* Like and Comment Section at the Bottom */}
          <CardActions
            sx={{
              display: 'flex',
              gap: '16px',
              marginTop: 'auto', // Push to the bottom
            }}
          >
            <IconButton onClick={() => alert('Liked!')}>
              <ThumbUp />
            </IconButton>
            <Typography variant="caption">{post.likes || 0}</Typography>
            <IconButton onClick={() => alert('Commented!')}>
              <Comment />
            </IconButton>
          </CardActions>
        </Box>

        {/* Right Section: Image */}
        <Box
          sx={{
            flexShrink: 0,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderLeft: '1px solid #ddd',
          }}
        >
        <img
          src={
            post.picture && !post.picture.endsWith("undefined")
              ? post.picture
              : "food-by-me-icon.png"
          }
          alt="Post"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        </Box>
      </Card>
    </div>
  );
};

export default PostBox;