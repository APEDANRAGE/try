import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VideoPlayer from './pages/VideoPlayer';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import UploadVideo from './pages/UploadVideo';
import './styles/animations.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F0F23',
      paper: '#1A1B3A',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    success: {
      main: '#10B981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '4rem',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.8) 0%, rgba(30, 31, 67, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 20,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
          },
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: '0 32px 64px rgba(99, 102, 241, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.4)',
            border: '1px solid rgba(99, 102, 241, 0.5)',
            '&::before': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '14px 28px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.6s',
          },
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #DB2777 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.9) 0%, rgba(30, 31, 67, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 20,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 27, 58, 0.95) 100%)',
          backdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/history" element={<History />} />
                <Route path="/liked" element={<LikedVideos />} />
                <Route path="/upload" element={<UploadVideo />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;