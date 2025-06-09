import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu as MenuIcon, VideoLibrary, Person, History, Favorite, Upload, Logout, PlayCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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
        background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 27, 58, 0.95) 100%)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 6 }, py: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        >
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <PlayCircle sx={{ color: '#6366F1', fontSize: 36 }} />
            </motion.div>
            VideoStream
          </Typography>
        </motion.div>

        {isMobile ? (
          <>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.95) 0%, rgba(30, 31, 67, 0.95) 100%)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 3,
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
                        py: 1.5,
                        px: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
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
                      py: 1.5,
                      px: 3,
                      color: 'error.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
                      py: 1.5,
                      px: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
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
                      py: 1.5,
                      px: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to={item.path}
                      startIcon={item.icon}
                      className="nav-item"
                      sx={{
                        mx: 0.5,
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
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
                  whileHover={{ y: -2 }}
                >
                  <Button
                    color="error"
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    sx={{
                      mx: 0.5,
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
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
                  whileHover={{ y: -2 }}
                >
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    sx={{
                      mx: 1,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
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
                  whileHover={{ y: -2 }}
                >
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                    sx={{
                      mx: 1,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #DB2777 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
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