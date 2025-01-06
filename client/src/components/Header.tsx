import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, TextField } from '@mui/material';
import AssistantIcon from '@mui/icons-material/Assistant';
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useTheme } from '@mui/material/styles';


const Header = () => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const [activeTab, setActiveTab] = useState('home');
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AppBar position="static" color="default" style={{ height: '58px', padding: '0 20px' }}>
      <Toolbar>
        <img src="food-by-me-icon.png" alt="logo" style={{ height: '40px', width: '40px', marginRight: 10 }} />
        <Typography variant="h4" style={{ padding: '0 20px', fontFamily: 'Pacifico, cursive' }}>
          Food-By-Me
        </Typography>
        <div style={{ flexGrow: 1 }} />
        {/* Home Button */}
        <IconButton
          edge="start"
          aria-label="home"
          onClick={() => handleTabClick('home')}
        >
          {activeTab === 'home' ? <HomeIcon style={{ color: iconColor }} /> : <HomeOutlinedIcon style={{ color: iconColor }} />}
          <Typography variant="caption" style={{marginLeft: 4 }}>
            Home
          </Typography>
        </IconButton>

        {/* Add New Post Button */}
        <IconButton
          aria-label="add new post"
          onClick={() => handleTabClick('addPost')}
        >
        {activeTab === 'addPost' ? <AddCircleRoundedIcon style={{ color: iconColor }} /> : <AddCircleOutlineRoundedIcon style={{ color: iconColor }} />}
          <Typography variant="caption" style={{marginLeft: 4 }}>
            New Post
          </Typography>
        </IconButton>

        {/* AI New Post Button */}
        <IconButton
          aria-label="add AI post"
          onClick={() => handleTabClick('addAIPost')}
        >
        {activeTab === 'addAIPost' ? <AssistantIcon style={{ color: iconColor }} /> : <AssistantOutlinedIcon style={{ color: iconColor }} />}

          <Typography variant="caption" style={{marginLeft: 4 }}>
            AI Post
          </Typography>
        </IconButton>

        {/* Profile */}
        <IconButton
          edge="end"
          aria-label="profile"
          onClick={() => handleTabClick('profile')}
        >
        {activeTab === 'profile' ? <PersonIcon style={{ color: iconColor }} /> : <PersonOutlinedIcon style={{ color: iconColor }} />}
          <Typography variant="caption" style={{marginLeft: 4 }}>
            Profile
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;