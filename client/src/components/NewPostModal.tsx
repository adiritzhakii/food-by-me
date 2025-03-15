import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../store/store';
import { addPost } from '../store/postsSlice';
import { restorePreviousTab } from '../store/headerSlice';
import {SERVER_ADDR, SERVER_PORT} from '../../const'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  overflow: 'hidden',
};

const NewPostModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { token, userData, userId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(restorePreviousTab());
    onClose();
  };

  const handlePostSubmit = async () => {
    const postData = {
      title: postTitle,
      content: postContent,
      image: image,
    };

    try {
      const response = await axios.post(`http://${SERVER_ADDR}:${SERVER_PORT}/posts`, postData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
      });
      
      const userResponse = await axios.get(`http://localhost:3000/auth/getUserById/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const userInfo = userResponse.data;

      const newPost = {
        ...response.data,
        user: {
          name: userInfo.name,
          avatar: userInfo.avatar,
        }
      };

      dispatch(addPost(newPost));
    } catch (error: any) {
        alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }

    setPostTitle('');
    setPostContent('');
    setImage(null);
    setPreviewImage(null);
    handleClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Title Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid #ddd',
            bgcolor: '#242525',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
            }}
          >
            🍔 Add New Post
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
                color: 'red',
                '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                },
            }}
            >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ padding: '24px' }}>
        <TextField
            fullWidth
            multiline
            rows={1}
            placeholder="Post Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: '24px' }}
          />
          {/* Text Area for Post Content */}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What did you ate recently?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: '24px' }}
          />

          {/* Image Upload Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '24px',
              border: '1px dashed #ccc',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: '30%',
                  maxHeight: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No image selected
              </Typography>
            )}
            <Button
              variant="contained"
              component="label"
              sx={{ marginTop: '16px' }}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePostSubmit}
              disabled={!postContent && !previewImage}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewPostModal;