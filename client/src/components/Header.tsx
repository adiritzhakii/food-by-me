import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import AssistantIcon from '@mui/icons-material/Assistant';
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setActiveTab, tabType } from '../store/headerSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({
  onNewPostClick,
  onAIPostClick,
}: {
  onNewPostClick: () => void;
  onAIPostClick: () => void;
}) => {
  const theme = useTheme();
  const { activeTab } = useSelector((state: RootState) => state.header);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const iconColor = theme.palette.primary.main;

  const handleTabClick = (tab: tabType) => {
    dispatch(setActiveTab(tab));
    if (tab === 'newPost') {
      onNewPostClick(); // Trigger the New Post Modal
    } else if (tab === 'AIPost') {
      onAIPostClick(); // Trigger the AI Post Modal
    } else {
      navigate(`/${tab}`);
    }
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
          <Typography variant="caption" style={{ marginLeft: 4 }}>
            Home
          </Typography>
        </IconButton>

        {/* Add New Post Button */}
        <IconButton
          aria-label="add new post"
          onClick={() => handleTabClick('newPost')}
        >
          {activeTab === 'newPost' ? <AddCircleRoundedIcon style={{ color: iconColor }} /> : <AddCircleOutlineRoundedIcon style={{ color: iconColor }} />}
          <Typography variant="caption" style={{ marginLeft: 4 }}>
            New Post
          </Typography>
        </IconButton>

        {/* AI New Post Button */}
        <IconButton
          aria-label="add AI post"
          onClick={() => handleTabClick('AIPost')}
        >
          {activeTab === 'AIPost' ? <AssistantIcon style={{ color: iconColor }} /> : <AssistantOutlinedIcon style={{ color: iconColor }} />}
          <Typography variant="caption" style={{ marginLeft: 4 }}>
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
          <Typography variant="caption" style={{ marginLeft: 4 }}>
            Profile
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;