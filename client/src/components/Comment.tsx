import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

interface CommentProps {
  avatar: string;
  name: string;
  content: string;
}

const Comment: React.FC<CommentProps> = ({ avatar, name, content }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        borderBottom: '1px solid #ddd',
      }}
    >
      <Avatar src={avatar} />
      <Box>
        <Typography variant="subtitle1" color='black' sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Typography variant="body2" color='black'>{content}</Typography>
      </Box>
    </Box>
  );
};

export default Comment;