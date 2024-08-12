import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import your components and pages
import Login from "./Login";
import SplashScreen from "./pages/SplashScreen";
import RecentViews from "./RecentViews";
import MainPage from "./MainPage";
import ExplorePage from "./ExplorePage";
import FavoritesPage from "./FavoritesPage";
import ProfilePage from "./ProfilePage";
import GoPage from "./GoPage"; // Add this if you have a Go page


// Import images
import image1 from "./assets/carousel/image.png";
import image2 from "./assets/carousel/image1.png";
import image3 from "./assets/carousel/image2.png";
import image4 from "./assets/carousel/image3.png";

const data = [
  { time: "12:00", index: 10 },
  { time: "12:15", index: 20 },
  { time: "12:30", index: 15 },
  { time: "12:45", index: 30 },
  { time: "13:00", index: 25 },
  { time: "13:15", index: 40 },
];

function App() {
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (newValue) => {
    setBottomNavValue(newValue);

    switch (newValue) {
      case 0:
        navigate('/explore');
        break;
      case 1:
        navigate('/home');
        break;
      case 2:
        navigate('/go');
        break;
      case 3:
        navigate('/favorites');
        break;
      case 4:
        navigate('/login');
        break;
      default:
        navigate('/');
    }
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

  const [recentItems, setRecentItems] = useState([
    { image: "/path/to/image1.jpg", alt: "Item 1", title: "Item 1" },
    { image: "/path/to/image2.jpg", alt: "Item 2", title: "Item 2" },
    // Add more recent items here
  ]);
  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
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
          <ListItemText primary="Support" sx={{ fontWeight: "bold" }} />
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
          <ListItemText primary="Accommodation" sx={{ fontWeight: "bold" }} />
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
          <ListItemText primary="Announcement" sx={{ fontWeight: "bold" }} />
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
    <>
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Main Content */}
      {!showSplash && (
        <Box sx={{ flexGrow: 1 }}>
          {/* Top Navigation Bar */}
          <AppBar position="static" sx={{ bgcolor: "#FF4081", width: "100%" }}>
            <Toolbar sx={{ width: "100%" }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                GoYeBang
              </Box>
              <IconButton edge="end" color="inherit">
                <span onClick={toggleDrawer} style={{ cursor: "pointer" }}>
                  🛒
                </span>
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
                style: { borderRadius: 50 },
              }}
            />
          </Box>

          {/* Image Carousel */}
          <Box sx={{ p: 2 }}>
            <Slider {...settings}>
              <div>
                <img src={image1} alt="Slide 1" style={{ width: "100%" }} />
              </div>
              <div>
                <img src={image2} alt="Slide 2" style={{ width: "100%" }} />
              </div>
              <div>
                <img src={image3} alt="Slide 3" style={{ width: "100%" }} />
              </div>
              <div>
                <img src={image4} alt="Slide 4" style={{ width: "100%" }} />
              </div>
            </Slider>
          </Box>

          <div className="app-container">
            <RecentViews recentItems={recentItems} />
          </div>

          {/* 1 by 2 Grid Below Carousel */}
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Card 1
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                      Content for the first card goes here. You can add any
                      content you like.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Card 2
                    </Typography>
                    <Typography sx={{ mt: 1.5 }}>
                      Content for the second card goes here. You can add any
                      content you like.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
            onChange={(event, newValue) => handleNavigation(newValue)}
            showLabels
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              bgcolor: "#f5f5f5",
            }}
          >
            <BottomNavigationAction label="Explore" icon={<ExploreIcon />} />
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction
              icon={
                <Box
                  sx={{
                    bgcolor: "#FF4081",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Go!
                </Box>
              }
            />

            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
          </BottomNavigation>
        </Box>
      )}
    </>
  );
}

export default App;
