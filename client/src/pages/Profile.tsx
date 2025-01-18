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
import { EditProfile } from '../components/editProfile';

const Profile: React.FC = () => {
  const {userData, refreshToken, provider } = useSelector((state: RootState) => state.auth);
  console.log(userData)
  const [isEditing, setIsEditing] = useState(false);
  const [serverLogout] = usePostAuthLogoutMutation();
  const dispatch = useDispatch()
  
  const navigate = useNavigate();
  
  const { refetch, data } = useGetAuthGetProfileQuery(
    { provider: provider as ProviderSchema }, // Ensure provider is of type ProviderSchema
     // Skip the query if provider is not available
  );

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
          <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
            Edit
          </Button>
          <Posts />
        </>
      ) : (
        <EditProfile isEditing={isEditing} setIsEditing={setIsEditing}/>
      )}
    </Box>
  );
};

export default Profile;