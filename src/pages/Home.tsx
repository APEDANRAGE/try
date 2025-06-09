import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Fade,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayArrow, Visibility, ThumbUp, ThumbDown, Star, TrendingUp, Whatshot } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  user_id: number;
  views: number;
  likes: number;
  dislikes: number;
}

const VideoCard = ({ video, onClick, index }: { video: Video; onClick: () => void; index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="stagger-item"
    >
      <Card
        sx={{
          cursor: 'pointer',
          height: '100%',
          width: '100%',
          background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.8) 0%, rgba(30, 31, 67, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 5,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
        }}
        onClick={onClick}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              height={220}
              animation="wave"
              sx={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
                }
              }}
            />
          )}
          <CardMedia
            component="img"
            height="220"
            image={`${API_BASE_URL}${video.thumbnail_url}`}
            alt={video.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      width: 80,
                      height: 80,
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 50 }} />
                  </IconButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1.5,
              fontSize: '1.1rem',
            }}
          >
            {video.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2.5,
              lineHeight: 1.5,
            }}
          >
            {video.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<Visibility sx={{ fontSize: 16 }} />}
              label={video.views.toLocaleString()}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: '#6366F1',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            />
            <Chip
              icon={<ThumbUp sx={{ fontSize: 16 }} />}
              label={video.likes}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(16, 185, 129, 0.5)',
                color: '#10B981',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                },
              }}
            />
            <Chip
              icon={<ThumbDown sx={{ fontSize: 16 }} />}
              label={video.dislikes}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#EF4444',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [recommendations, setRecommendations] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/video/`);
        setVideos(response.data.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        if (!token) {
          const response = await axios.get(`${API_BASE_URL}/api/video/`);
          setRecommendations(response.data.data);
        } else {
          const response = await axios.get(`${API_BASE_URL}/api/video/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecommendations(response.data.data);
        }
      } catch (error: any) {
        console.error('Error fetching recommendations:', error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        setError(error.response?.data?.message || 'Error loading recommendations');
        try {
          const response = await axios.get(`${API_BASE_URL}/api/video/`);
          setRecommendations(response.data.data);
        } catch (fallbackError) {
          console.error('Error fetching public videos:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    fetchRecommendations();
  }, [navigate]);

  const handleVideoClick = (videoId: number) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    navigate(`/video/${videoId}`);
  };

  const handleLoginClick = () => {
    setShowLoginDialog(false);
    navigate('/login');
  };

  const handleRegisterClick = () => {
    setShowLoginDialog(false);
    navigate('/register');
  };

  if (loading) {
    return (
      <Box className="container-wide" sx={{ mt: 6, px: { xs: 2, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Grid container spacing={4}>
            {[...Array(9)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ 
                  background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.8) 0%, rgba(30, 31, 67, 0.9) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    height={220} 
                    animation="wave"
                    sx={{ 
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      '&::after': {
                        background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
                      }
                    }}
                  />
                  <CardContent>
                    <Skeleton variant="text" height={32} animation="wave" />
                    <Skeleton variant="text" height={20} animation="wave" />
                    <Skeleton variant="text" height={20} width="60%" animation="wave" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        </motion.div>
      </Container>
    );
  }

  return (
    <Box className="container-wide page-enter" sx={{ mt: 6, mb: 6, px: { xs: 2, md: 4 } }}>
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Alert
              severity="info"
              sx={{
                mb: 6,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                '& .MuiAlert-icon': {
                  color: '#6366F1',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
                <Typography variant="body1" sx={{ flex: 1, fontSize: '1.1rem' }}>
                  🚀 Create an account to unlock personalized recommendations and exclusive features!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                      px: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #DB2777 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      },
                    }}
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: '#6366F1',
                      color: '#6366F1',
                      px: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(26, 27, 58, 0.95) 0%, rgba(30, 31, 67, 0.95) 100%)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 4,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            🎬 Login Required
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4, px: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Please log in or create an account to watch videos and access all amazing features.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, px: 4 }}>
          <Button onClick={() => setShowLoginDialog(false)} color="inherit" sx={{ px: 3 }}>
            Cancel
          </Button>
          <Button
            onClick={handleLoginClick}
            variant="outlined"
            sx={{
              borderColor: '#6366F1',
              color: '#6366F1',
              px: 3,
              '&:hover': {
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Login
          </Button>
          <Button
            onClick={handleRegisterClick}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #4F46E5 0%, #DB2777 100%)',
              },
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star sx={{ color: '#F59E0B', mr: 2, fontSize: 36 }} />
              </motion.div>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mr: 2,
                }}
              >
                Recommended for You
              </Typography>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Whatshot sx={{ color: '#EF4444', fontSize: 32 }} />
              </motion.div>
            </Box>
            <Grid container spacing={4}>
              {recommendations.slice(0, 8).map((video, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard
                    video={video}
                    onClick={() => handleVideoClick(video.id)}
                    index={index}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp sx={{ color: '#6366F1', mr: 2, fontSize: 36 }} />
          </motion.div>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {isAuthenticated ? 'More Amazing Videos' : 'Featured Videos'}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {videos.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <VideoCard
                video={video}
                onClick={() => handleVideoClick(video.id)}
                index={index + (recommendations.length > 0 ? 8 : 0)}
              />
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Home;