import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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

const AIPostModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handlePostSubmit = () => {
    const postData = {
      content: postContent,
      image: previewImage,
    };
    console.log('New AI Post Data:', postData);
    setPostContent('');
    setImage(null);
    setPreviewImage(null);
    onClose(); // Close the modal after submission
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
    <Modal open={isOpen} onClose={onClose}>
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
            🤖 Add New AI Post
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
          {/* AI Generator Button */}
            <Box
            sx={{
                display: 'flex',
                justifyContent: 'center', // Center the button horizontally
                marginBottom: '24px',
            }}
            >
            <Button
                variant="contained"
                sx={{
                backgroundColor: '#6a0dad', // Purple button
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                '&:hover': {
                    backgroundColor: '#5e0cbe', // Slightly darker purple on hover
                },
                }}
                onClick={() => console.log('Post with AI Clicked')} // Replace with actual functionality
            >
                <RestartAltIcon />
                Post with AI
            </Button>
            </Box>

          {/* Text Area for Post Content */}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Upload a picture of your food and click the button to generate a post!"
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
                  width: '100%',
                  maxHeight: '300px',
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
              sx={{
                backgroundColor: '#6a0dad', // Purple button
                '&:hover': {
                  backgroundColor: '#5e0cbe', // Slightly darker purple on hover
                },
              }}
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

export default AIPostModal;