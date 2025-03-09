import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import { IEnrichedComments } from './CommentsModal';

interface CreateCommentProps {
    postId: string;
    token: string;
    onCreate: (newComment: IEnrichedComments) => void;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, token, onCreate }) => {
  const [comment, setComment] = useState('');

  const handleCreate = async () => {
    if (comment.trim()) {
      try {
        const response = await axios.post(
          'http://localhost:3000/comments',
          { postId, comment },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onCreate(response.data);
        setComment('');
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '90%',
        bgcolor: 'background.paper',
        p: 2,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
        margin: '10px 0px 50px 10px',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          sx={{ height: '40px'}}
        >
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CreateComment;