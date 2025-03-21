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
import Pagination from '../components/Pagination';
import { setUserPosts } from '../store/postsSlice';
import { setActiveTab } from '../store/headerSlice';
import { SERVER_API, SERVER_PORT } from '../consts';

const POSTS_PER_PAGE = 3;

const Profile: React.FC = () => {
  const { userData, refreshToken, provider, userId, token } = useSelector((state: RootState) => state.auth);
  const userPosts = useSelector((state: RootState) => state.posts.userPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [serverLogout] = usePostAuthLogoutMutation();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !token) return;
      
      try {
        const response = await axios.get(`https://${SERVER_API}:${SERVER_PORT}/api/auth/getUserById/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        dispatch(setUserData({
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar
        }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId, token, dispatch]);

  const fetchUserPosts = async () => {
    if (!userId || !userData) return;
    
    try {
      const response = await axios.get(`https://${SERVER_API}:${SERVER_PORT}/api/posts?owner=${userId}`);
      const rawPosts = response.data;

      const userResponse = await axios.get(`https://${SERVER_API}:${SERVER_PORT}/api/auth/getUserById/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const userInfo = userResponse.data;

      const processedPosts = rawPosts.map((post: any) => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        likes: post.likes,
        picture: post.picture || '',
        user: {
          name: userInfo.name,
          avatar: userInfo.avatar,
        },
      }));

      const sortedPosts = processedPosts.sort((a: IPostBox, b: IPostBox) => {
        return b._id.localeCompare(a._id);
      });

      dispatch(setUserPosts(sortedPosts));
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [userId, userData, token]);

  useEffect(() => {
    const handleFocus = () => {
      fetchUserPosts();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId, userData, token]);

  useEffect(() => {
    if (userPosts.some(post => !post.user?.name || !post.user?.avatar)) {
      fetchUserPosts();
    }
  }, [userPosts]);

  const handleLogout = async () => {
    deleteCookieData('user');
    await serverLogout({ body: { refreshToken, provider } });
    dispatch(logout());
    dispatch(setActiveTab('home'));
    navigate('/login');
  };

  const totalPages = Math.ceil(userPosts.length / POSTS_PER_PAGE);
  const currentPosts = userPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <Typography variant="h4" sx={{ color: 'white' }}>{userData.name || userData.email}</Typography>

      {!isEditing ? (
        <>
          <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>Edit</Button>
          {loading ? (
            <Typography sx={{ mt: '20px', color: 'white' }}>Loading posts...</Typography>
          ) : userPosts.length > 0 ? (
            <>
              {currentPosts.map((post) => <PostBox key={post._id} post={post} isEditable={true} />)}
              <Box display="flex" justifyContent="center" alignItems="center" mr={"10%"} mt={4} mb={4}>
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
              </Box>
            </>
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