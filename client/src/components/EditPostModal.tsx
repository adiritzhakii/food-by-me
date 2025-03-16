import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { IPostBox } from './PostBox';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updatePost, deletePost } from '../store/postsSlice';
import { SERVER_API, SERVER_PORT } from '../consts';

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

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: IPostBox;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ open, onClose, post }) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(post.picture || null);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put(`https://${SERVER_API}:${SERVER_PORT}/api/posts/${post._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
      });

      const userResponse = await axios.get(`https://${SERVER_API}:${SERVER_PORT}/api/auth/getUserById/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const userInfo = userResponse.data;

      const updatedPost = {
        ...response.data,
        user: {
          name: userInfo.name,
          avatar: userInfo.avatar,
        }
      };

      dispatch(updatePost(updatedPost));
      onClose();
    } catch (error: any) {
      console.log(`Update failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://${SERVER_API}:${SERVER_PORT}/api/posts/${post._id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      dispatch(deletePost(post._id));
      onClose();
    } catch (error: any) {
      console.log(`Delete failed: ${error.response?.data?.message || error.message}`);
    }
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
    <Modal open={open} onClose={onClose}>
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
            ✏️ Edit Post
          </Typography>
          <IconButton
            onClick={onClose}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            sx={{ marginBottom: '24px' }}
          />
          {/* Text Area for Post Content */}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What did you ate recently?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
                  width: '40%',
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
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!content && !previewImage}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPostModal;