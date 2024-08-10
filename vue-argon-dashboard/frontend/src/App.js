import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HotelIcon from '@mui/icons-material/Hotel';
import PoolIcon from '@mui/icons-material/Pool';
import CloseIcon from '@mui/icons-material/Close'; 
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import images
import image1 from './assets/carousel/image.png';
import image2 from './assets/carousel/image1.png';
import image3 from './assets/carousel/image2.png';
import image4 from './assets/carousel/image3.png';

import Login from './Login';  // Import the Login component



// Sample data for activity chart
const data = [
  { time: '12:00', index: 10 },
  { time: '12:15', index: 20 },
  { time: '12:30', index: 15 },
  { time: '12:45', index: 30 },
  { time: '13:00', index: 25 },
  { time: '13:15', index: 40 },
];

function App() {
  const [bottomNavValue, setBottomNavValue] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false); 

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Categories
        </Typography>
      </Box>
      <Divider />
      <List>
        {/* Support Category */}
        <ListItem>
          <ListItemText primary="Support" sx={{ fontWeight: 'bold' }} />
        </ListItem>
        <ListItem button>
          <ListItemText primary="AI Chatbot" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Contacts" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Help" />
        </ListItem>
        <Divider />

        {/* Accommodation Category */}
        <ListItem>
          <ListItemText primary="Accommodation" sx={{ fontWeight: 'bold' }} />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Shopping Mall" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Facilities" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Transportation" />
        </ListItem>
        <Divider />

        {/* Announcement Category */}
        <ListItem>
          <ListItemText primary="Announcement" sx={{ fontWeight: 'bold' }} />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Weather Forecast" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Emergency News" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Videos" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ bgcolor: '#FF4081', width: '100%' }}>
          <Toolbar sx={{ width: '100%' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
              GoYeBang
            </Box>
            <IconButton edge="end" color="inherit">
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        

        {/* Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>

        {/* Search Bar */}
        <Box sx={{ p: 2 }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="오늘은 뭐해볼까?" 
            InputProps={{ 
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />, 
              style: { borderRadius: 50 } 
            }} 
          />
        </Box>

        {/* Icon Grid */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <HotelIcon sx={{ fontSize: 40, color: '#FF4081' }} />
                <Box>잘자기</Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <PoolIcon sx={{ fontSize: 40, color: '#FF4081' }} />
                <Box>운동</Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <LocalOfferIcon sx={{ fontSize: 40, color: '#FF4081' }} />
                <Box>할 일</Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <PersonIcon sx={{ fontSize: 40, color: '#FF4081' }} />
                <Box>친구</Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Image Carousel */}
        <Box sx={{ p: 2 }}>
          <Slider {...settings}>
            <div>
              <img src={image1} alt="Slide 1" style={{ width: '100%' }} />
            </div>
            <div>
              <img src={image2} alt="Slide 2" style={{ width: '100%' }} />
            </div>
            <div>
              <img src={image3} alt="Slide 3" style={{ width: '100%' }} />
            </div>
            <div>
              <img src={image4} alt="Slide 4" style={{ width: '100%' }} />
            </div>
          </Slider>
        </Box>

        {/* Activity Meter */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Activity Meter
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="index" stroke="#FF4081" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Bottom Navigation */}
        <BottomNavigation
          value={bottomNavValue}
          onChange={(event, newValue) => setBottomNavValue(newValue)}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            bgcolor: '#f5f5f5',
          }}
        >
          <BottomNavigationAction label="지역" icon={<ExploreIcon />} />
          <BottomNavigationAction label="내주변" icon={<HomeIcon />} />
          <BottomNavigationAction 
            label="" 
            icon={<Box sx={{ bgcolor: '#FF4081', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Go!</Box>} 
          />
          <BottomNavigationAction label="찜" icon={<FavoriteIcon />} />
          <BottomNavigationAction 
            label="마이" 
            icon={<PersonIcon />} 
            component={Link} 
            to="/login"  // Navigate to login page
          />
        </BottomNavigation>
      </Box>
    </Router>
  );
}

export default App;
