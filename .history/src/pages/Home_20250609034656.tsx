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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
}

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [recommendations, setRecommendations] = useState<Video[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Fetch random videos
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/video/');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    // Fetch recommendations if authenticated
    const fetchRecommendations = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/video/recommendations', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecommendations(response.data);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }
    };

    fetchVideos();
    fetchRecommendations();
  }, []);

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Create an account to unlock personalized recommendations and more features!
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => navigate('/register')}
          >
            Sign Up Now
          </Button>
        </Alert>
      )}

      {isAuthenticated && recommendations.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recommended for You
          </Typography>
          <Grid container spacing={3}>
            {recommendations.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleVideoClick(video.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnail_url}
                    alt={video.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>
        {isAuthenticated ? 'More Videos' : 'Featured Videos'}
      </Typography>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card
              sx={{ cursor: 'pointer' }}
              onClick={() => handleVideoClick(video.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={video.thumbnail_url}
                alt={video.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 