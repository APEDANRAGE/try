import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon, Sparkles } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      let authHeader = response.headers['authorization'] || response.headers['Authorization'];
      if (!authHeader) {
        throw new Error('No token received');
      }
      const token = authHeader.replace(/^Bearer\s+/i, '');
      localStorage.setItem('token', token);
      localStorage.setItem('userId', response.data.data.user.id.toString());
      localStorage.setItem('username', response.data.data.user.username);

      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-container" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="auth-form"
        >
          <Paper
            elevation={0}
            sx={{
              p: 8,
              background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.9) 0%, rgba(30, 31, 67, 0.95) 100%)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 6,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #10B981 100%)',
              }}
            />
            
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    boxShadow: '0 16px 40px rgba(99, 102, 241, 0.4)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      right: -4,
                      bottom: -4,
                      background: 'linear-gradient(135deg, #6366F1, #EC4899, #10B981)',
                      borderRadius: '50%',
                      zIndex: -1,
                      animation: 'spin 3s linear infinite',
                    },
                  }}
                >
                  <LoginIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 2,
                  }}
                >
                  Welcome Back! 🎬
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                  Sign in to continue your video journey
                </Typography>
              </motion.div>
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Alert
                    severity="error"
                    sx={{
                      mb: 4,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#6366F1' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6366F1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366F1',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#6366F1',
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#6366F1' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#6366F1' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6366F1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366F1',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#6366F1',
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2,
                    mb: 3,
                    py: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      transition: 'left 0.6s',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F46E5 0%, #DB2777 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 40px rgba(99, 102, 241, 0.4)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&:disabled': {
                      background: 'rgba(99, 102, 241, 0.3)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={28} sx={{ color: 'white' }} />
                  ) : (
                    <>
                      <Sparkles sx={{ mr: 1 }} />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  Don't have an account?{' '}
                  <Box
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: '#6366F1',
                      textDecoration: 'none',
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#EC4899',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create one here ✨
                  </Box>
                </Typography>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;