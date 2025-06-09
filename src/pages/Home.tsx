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
import { PlayArrow, Visibility, ThumbUp, ThumbDown, Star } from '@mui/icons-material';
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          cursor: 'pointer',
          height: '100%',
          width: '100%',
          background: 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 25px 50px rgba(26, 35, 126, 0.3)',
            border: '1px solid rgba(26, 35, 126, 0.4)',
          },
        }}
        onClick={onClick}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              height={200}
              animation="wave"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
          )}
          <CardMedia
            component="img"
            height="200"
            image={`${API_BASE_URL}${video.thumbnail_url}`}
            alt={video.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(26, 35, 126, 0.8) 0%, rgba(0, 121, 107, 0.8) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <PlayArrow sx={{ fontSize: 40 }} />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <CardContent sx={{ p: 2.5 }}>
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
              mb: 1,
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
              mb: 2,
              lineHeight: 1.4,
            }}
          >
            {video.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Visibility sx={{ fontSize: 16 }} />}
              label={video.views.toLocaleString()}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            />
            <Chip
              icon={<ThumbUp sx={{ fontSize: 16 }} />}
              label={video.likes}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(76, 175, 80, 0.5)',
                color: 'success.main',
                fontSize: '0.75rem',
              }}
            />
            <Chip
              icon={<ThumbDown sx={{ fontSize: 16 }} />}
              label={video.dislikes}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'rgba(244, 67, 54, 0.5)',
                color: 'error.main',
                fontSize: '0.75rem',
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
      <Container maxWidth="lg\" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ background: 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)' }}>
                <Skeleton variant="rectangular" height={200} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" height={32} animation="wave" />
                  <Skeleton variant="text" height={20} animation="wave" />
                  <Skeleton variant="text" height={20} width="60%" animation="wave" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Alert
              severity="info"
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.1) 0%, rgba(0, 121, 107, 0.1) 100%)',
                border: '1px solid rgba(26, 35, 126, 0.3)',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#1A237E',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  Create an account to unlock personalized recommendations and more features!
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      background: 'linear-gradient(135deg, #1A237E 0%, #3F51B5 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0D47A1 0%, #1A237E 100%)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: '#1A237E',
                      color: '#1A237E',
                      '&:hover': {
                        borderColor: '#0D47A1',
                        backgroundColor: 'rgba(26, 35, 126, 0.1)',
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
            background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Login Required
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Please log in or create an account to watch videos and access all features.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3 }}>
          <Button onClick={() => setShowLoginDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleLoginClick}
            variant="outlined"
            sx={{
              borderColor: '#1A237E',
              color: '#1A237E',
              '&:hover': {
                borderColor: '#0D47A1',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
              },
            }}
          >
            Login
          </Button>
          <Button
            onClick={handleRegisterClick}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1A237E 0%, #3F51B5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0D47A1 0%, #1A237E 100%)',
              },
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Star sx={{ color: '#FFB300', mr: 1, fontSize: 28 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1A237E 0%, #00796B 50%, #FFB300 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Recommended for You
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {recommendations.slice(0, 6).map((video, index) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #E0E0E0 0%, #A0A0A0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {isAuthenticated ? 'More Videos' : 'Featured Videos'}
        </Typography>
        <Grid container spacing={3}>
          {videos.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <VideoCard
                video={video}
                onClick={() => handleVideoClick(video.id)}
                index={index + (recommendations.length > 0 ? 6 : 0)}
              />
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Home;