import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import Comment from './Comment';
import CloseIcon from '@mui/icons-material/Close';
import CreateComment from './CreateComment';
import {SERVER_API, SERVER_PORT} from '../consts';

interface IComments {
  _id: string;
  comment: string;
  owner: string;
  postId: string;
}

export interface IEnrichedComments extends IComments {
  user: {
    avatar: string;
    name: string;
  };
}

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  userToken: string;
  onCommentUpdate?: (count: number) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ open, onClose, postId, userToken, onCommentUpdate }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [comments, setComments] = useState<IEnrichedComments[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://${SERVER_API}:${SERVER_PORT}/comments?postId=${postId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const commentsData = response.data;

        const enrichedComments = await Promise.all(
          commentsData.map(async (comment: IComments) => {
            const userResponse = await axios.get(`http://${SERVER_API}:${SERVER_PORT}/auth/getUserById/${comment.owner}`, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });
            const userData = userResponse.data;
            return {
              ...comment,
              user: {
                avatar: userData.avatar,
                name: userData.name,
              },
            };
          })
        );

        setComments(enrichedComments);
        onCommentUpdate?.(enrichedComments.length);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (open) {
      fetchComments();
    } else {
      setComments([]);
    }
  }, [open, postId, userToken, onCommentUpdate]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 400);
  };

  const handleCreateComment = async (newComment: IComments) => {
    try {
      const userResponse = await axios.get(`http://${SERVER_API}:${SERVER_PORT}/auth/getUserById/${newComment.owner}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const userData = userResponse.data;
      const enrichedComment: IEnrichedComments = {
        ...newComment,
        user: {
          avatar: userData.avatar,
          name: userData.name,
        },
      };
      const updatedComments = [...comments, enrichedComment];
      setComments(updatedComments);
      onCommentUpdate?.(updatedComments.length);
    } catch (error) {
      console.error('Error fetching user data for new comment:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Box
        sx={{
          width: '45%',
          height: '100%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          position: 'relative',
          animation: `${isClosing ? 'slideOut' : 'slideIn'} 0.9s ease-out`,
          '@keyframes slideIn': {
            from: {
              transform: 'translateX(100%)',
            },
            to: {
              transform: 'translateX(0)',
            },
          },
          '@keyframes slideOut': {
            from: {
              transform: 'translateX(0)',
            },
            to: {
              transform: 'translateX(170%)',
            },
          },
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 55,
            left: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ marginTop: 8 }} color={"black"}>
          <Typography variant="h4">Comments</Typography>
        </Box>
        <Box sx={{ marginTop: 4, overflowY: 'auto', height: 'calc(100% - 280px)' }}>
        {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                avatar={comment.user.avatar}
                name={comment.user.name}
                content={comment.comment}
              />
            ))
          ) : (
            <Typography variant="h3" sx={{ mt: '20px', color: 'black' }}>No comments yet! 😢</Typography>
          )}
        </Box>
        <CreateComment postId={postId} token={userToken} onCreate={handleCreateComment} />
      </Box>
    </Modal>
  );
};

export default CommentsModal;