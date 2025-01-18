import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Posts from '../components/Posts';
import { deleteCookieData } from '../utils/cookie';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUserData } from '../store/authSlice';
import { usePostAuthLogoutMutation, useGetAuthGetProfileQuery, ProviderSchema } from '../store/serverApi'
import { RootState } from '../store/store';

interface UserProfile {
  email: string;
  name: string;
  avatar?: string;
}

const Profile: React.FC = () => {
  const {userData, refreshToken, provider } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserProfile>(userData ? userData : {email: '', name: '', avatar: ''});
  const [serverLogout] = usePostAuthLogoutMutation();
  
  const navigate = useNavigate();
  
  const { refetch, data } = useGetAuthGetProfileQuery(
    { provider: provider as ProviderSchema }, // Ensure provider is of type ProviderSchema
    { skip: !provider } // Skip the query if provider is not available
  );
  
  const dispatch = useDispatch()

  useEffect(() => {
    if (data) {
      dispatch(setUserData(data))
      console.log('User data:', userData);
    }
  }
  , [data])


  const handleLogout = async () => {
    deleteCookieData('user')
    await serverLogout({body: {refreshToken, provider}})
    dispatch(logout())
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    


    setIsEditing(false);
    console.log('User updated:', updatedUser);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (updatedUser) {
      setUpdatedUser({ ...updatedUser, [field]: value });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (updatedUser) {
          setUpdatedUser({ ...updatedUser, avatar: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!userData) return <Typography sx={{ color: 'white' }}>Loading...</Typography>;

  return (
    <Box sx={{ padding: 4, textAlign: 'center', color: 'white', position: 'relative' }}>
      {/* Logout Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'white',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
        onClick={handleLogout}
      >
        <LogoutIcon />
      </IconButton>

      <Avatar
        alt="Profile Picture"
        src={userData.avatar}
        sx={{ width: 100, height: 100, margin: '16px auto' }}
      />
      <Typography variant="h4" sx={{ color: 'white' }}>
        Hi {userData.name ? userData.name : userData.email}
      </Typography>
      {!isEditing ? (
        <>
          <Button variant="contained" onClick={handleEditClick} sx={{ mt: 2 }}>
            Edit
          </Button>
          <Posts />
        </>
      ) : (
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            width: '33%',
            mx: 'auto',
            mt: 4,
            p: 4,
            boxShadow: 3,
          }}
        >
          <TextField
            label="Name"
            value={updatedUser?.name || userData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Avatar URL"
              value={updatedUser?.avatar || userData.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black' } }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ marginTop: '8px' }}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={handleSaveClick}
            sx={{ mt: 2, marginRight: 2 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Profile;