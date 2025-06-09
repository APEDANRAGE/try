import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu as MenuIcon, VideoLibrary, Person, History, Favorite, Upload, Logout } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setUserId(localStorage.getItem('userId'));
    };
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const triggerAuthChange = () => {
    window.dispatchEvent(new Event('authChange'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserId(null);
    triggerAuthChange();
    navigate('/login');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'History', path: '/history', icon: <History /> },
    { label: 'Liked Videos', path: '/liked', icon: <Favorite /> },
    { label: 'Upload', path: '/upload', icon: <Upload /> },
    { label: 'Profile', path: `/profile/${userId}`, icon: <Person /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1A237E 0%, #00796B 50%, #FFB300 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <VideoLibrary sx={{ color: '#1A237E', fontSize: 28 }} />
            VideoStream
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(26, 35, 126, 0.2)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mt: 1,
                }
              }}
            >
              {isAuthenticated ? (
                [
                  ...navItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        handleMenuClose();
                      }}
                      sx={{
                        gap: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 35, 126, 0.2)',
                          transform: 'translateX(8px)',
                        }
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </MenuItem>
                  )),
                  <MenuItem
                    key="logout"
                    onClick={handleLogout}
                    sx={{
                      gap: 2,
                      color: 'error.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    <Logout />
                    Logout
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem
                    key="login"
                    onClick={() => {
                      navigate('/login');
                      handleMenuClose();
                    }}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.2)',
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    Login
                  </MenuItem>,
                  <MenuItem
                    key="register"
                    onClick={() => {
                      navigate('/register');
                      handleMenuClose();
                    }}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.2)',
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    Register
                  </MenuItem>
                ]
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAuthenticated ? (
              <>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        mx: 0.5,
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 35, 126, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    color="error"
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    sx={{
                      mx: 0.5,
                      borderRadius: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    sx={{
                      mx: 0.5,
                      borderRadius: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                      }
                    }}
                    onClick={triggerAuthChange}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                    sx={{
                      mx: 0.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1A237E 0%, #3F51B5 100%)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0D47A1 0%, #1A237E 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(26, 35, 126, 0.4)',
                      }
                    }}
                    onClick={triggerAuthChange}
                  >
                    Register
                  </Button>
                </motion.div>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;