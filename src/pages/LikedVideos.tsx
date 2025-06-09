import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  liked_at: string;
  views: number;
  likes: number;
  dislikes: number;
}

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:3001';
  const getThumbnailUrl = (filename: string) => filename ? `${API_BASE_URL}/thumbnails/${filename.replace(/^.*[\\\/]/, '')}` : '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/likes/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedVideos(response.data.data);
      } catch (error) {
        console.error('Error fetching liked videos:', error);
      }
    };

    fetchLikedVideos();
  }, [navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Liked Videos
        </Typography>
        
        {likedVideos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No liked videos yet
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {likedVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id} component="div">
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/video/${video.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getThumbnailUrl(video.thumbnail_url)}
                    alt={video.title}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/video/${video.id}`)}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {video.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Views: {video.views}</Typography>
                    <Typography variant="body2" color="text.secondary">Likes: {video.likes} | Dislikes: {video.dislikes}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Liked on {new Date(video.liked_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default LikedVideos; 