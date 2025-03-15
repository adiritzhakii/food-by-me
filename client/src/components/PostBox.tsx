import React, { useState, useEffect } from 'react';
import { Card, CardActions, Typography, IconButton, Avatar, Box, Badge } from '@mui/material';
import { ThumbUp, Comment, Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import EditPostModal from './EditPostModal';
import CommentsModal from './CommentsModal';
import axios from 'axios';

export interface IPostBox {
  _id: string;
  title: string;
  content: string;
  likes: string[];
  user: {
    name: string;
    avatar: string;
  };
  picture?: string;
}

interface PostBoxProps {
  post: IPostBox;
  isEditable?: boolean;
}

const PostBox: React.FC<PostBoxProps> = ({ post, isEditable = false }) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes.includes(userId || ''));
  const [likes, setLikes] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(0);

  const fetchCommentCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/comments?postId=${post._id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, [post._id, token]);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleCommentsClick = () => {
    setCommentsModalOpen(true);
  };

  const handleCloseCommentsModal = () => {
    setCommentsModalOpen(false);
  };

  const handleCommentUpdate = (newCount: number) => {
    setCommentCount(newCount);
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/posts/${post._id}/like`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setIsLiked(!isLiked);
      setLikes(response.data.likes.length);
      console.log('Liked the post:', response.data.likes);
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

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
              marginTop: 'auto',
            }}
          >
            <Badge badgeContent={likes} color={isLiked ? 'primary' : 'default'}>
              <IconButton onClick={handleLikeClick} color={isLiked ? 'primary' : 'default'}>
                <ThumbUp />
              </IconButton>
            </Badge>
            <Badge badgeContent={commentCount} color="primary">
              <IconButton onClick={handleCommentsClick}>
                <Comment />
              </IconButton>
            </Badge>
            {isEditable && (
              <IconButton onClick={handleEditClick}>
                <Edit />
              </IconButton>
            )}
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

      {isEditable && (
        <EditPostModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          post={post}
        />
      )}

      <CommentsModal
        open={isCommentsModalOpen}
        onClose={handleCloseCommentsModal}
        postId={post._id}
        userToken={token || ''}
        onCommentUpdate={handleCommentUpdate}
      />
    </div>
  );
};

export default PostBox;