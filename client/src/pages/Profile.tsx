import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PostBox, { IPostBox } from '../components/PostBox';
import { deleteCookieData } from '../utils/cookie';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUserData } from '../store/authSlice';
import { usePostAuthLogoutMutation, useGetAuthGetProfileQuery, ProviderSchema } from '../store/serverApi';
import { RootState } from '../store/store';
import { EditProfile } from '../components/editProfile';
import axios from 'axios';

const Profile: React.FC = () => {
  const { userData, refreshToken, provider, userId, token } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [serverLogout] = usePostAuthLogoutMutation();
  const [userPosts, setUserPosts] = useState<IPostBox[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data } = useGetAuthGetProfileQuery({ provider: provider as ProviderSchema });

  useEffect(() => {
    if (data) {
      dispatch(setUserData(data));
    }
  }, [data]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts?owner=${userId}`);
        const rawPosts = response.data;

        const postPromises = rawPosts.map(async (post: any) => {
          return {
            _id: post._id,
            title: post.title,
            content: post.content,
            likes: post.likes,
            picture: post.picture || '',
            user: {
              name: userData?.name || 'Unknown User',
              avatar: userData?.avatar || 'https://via.placeholder.com/150',
            },
          } as IPostBox;
        });

        const processedPosts = await Promise.all(postPromises);
        setUserPosts(processedPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserPosts();
  }, [userId]);

  const handleLogout = async () => {
    deleteCookieData('user');
    await serverLogout({ body: { refreshToken, provider } });
    dispatch(logout());
    navigate('/login');
  };

  if (!userData) return <Typography sx={{ color: 'white' }}>Loading...</Typography>;

  return (
    <Box sx={{ padding: 4, textAlign: 'center', color: 'white', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' } }}
        onClick={handleLogout}
      >
        <LogoutIcon />
      </IconButton>

      <Avatar alt="Profile Picture" src={userData.avatar} sx={{ width: 100, height: 100, margin: '16px auto' }} />
      <Typography variant="h4" sx={{ color: 'white' }}>Hi {userData.name || userData.email}</Typography>

      {!isEditing ? (
        <>
          <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>Edit</Button>
          {loading ? (
            <Typography sx={{ mt: '20px', color: 'white' }}>Loading posts...</Typography>
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => <PostBox key={post._id} post={post} />)
          ) : (
            <Typography variant="h1" sx={{ mt: '20px', color: 'white' }}>No posts yet! 😢</Typography>
          )}
        </>
      ) : (
        <EditProfile isEditing={isEditing} setIsEditing={setIsEditing} />
      )}
    </Box>
  );
};

export default Profile;
