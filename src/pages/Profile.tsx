import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

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

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
  profile_pic_url: string;
  backround_pic_url: string;
}

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const isOwnProfile = !userId || userId === currentUserId;
  const API_BASE_URL = 'http://localhost:3001';

  const fetchProfile = async (token: string, userId?: string) => {
    try {
      let response;
      if (userId) {
        response = await axios.get(
          `http://localhost:3001/api/profile?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.get(
          'http://localhost:3001/api/profile/',
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const data = response.data.data;
      setProfile(data.userDetail[0]);
      setVideos(data.userVideos);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile(token, userId);

    if (isOwnProfile) {
      const fetchLikedVideos = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/likes/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setVideos(response.data.data);
        } catch (error) {
          console.error('Error fetching liked videos:', error);
        }
      };

      const fetchHistory = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/history/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setVideos(response.data.data);
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      };

      fetchLikedVideos();
      fetchHistory();
    }
  }, [navigate, userId, isOwnProfile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('profile_pic', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.put('http://localhost:3001/api/profile/pic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchProfile(token, userId);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundPicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('background_pic', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.put('http://localhost:3001/api/profile/background', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchProfile(token, userId);
    } catch (error) {
      console.error('Error updating background picture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/video/delete/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the page to update the video list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      await axios.delete('http://localhost:3001/api/auth/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      // Dispatch authChange event to update navbar
      window.dispatchEvent(new Event('authChange'));
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // Helper to get correct image URLs
  const getProfilePicUrl = (filename: string) => filename ? `${API_BASE_URL}/profile_pics/${filename.replace(/^.*[\\\/]/, '')}` : '';
  const getBackgroundPicUrl = (filename: string) => {
    console.log('Background filename:', filename);
    const url = filename ? `${API_BASE_URL}/background_pics/${filename.replace(/^.*[\\\/]/, '')}` : '';
    console.log('Constructed background URL:', url);
    return url;
  };
  const getThumbnailUrl = (filename: string) => filename ? `${API_BASE_URL}/thumbnails/${filename.replace(/^.*[\\\/]/, '')}` : '';

  if (!profile) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  console.log('Profile data:', profile);
  const backgroundUrl = getBackgroundPicUrl(profile?.backround_pic_url || '');
  console.log('Final background URL:', backgroundUrl);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          position: 'relative',
          backgroundImage: backgroundUrl ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})` : 'none',
          backgroundColor: backgroundUrl ? 'transparent' : '#1976d2', // Fallback color if no image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200px',
          color: 'white',
        }}
        key={profile?.backround_pic_url}
      >
        {isOwnProfile && (
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundPicChange}
              style={{ display: 'none' }}
              id="background-pic-input"
            />
            <label htmlFor="background-pic-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<EditIcon />}
                disabled={loading}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } }}
              >
                Change Background
              </Button>
            </label>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={getProfilePicUrl(profile?.profile_pic_url || '')}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Typography variant="h4">{profile?.username}</Typography>
        </Box>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Videos" />
          <Tab label="Liked Videos" />
          <Tab label="History" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getThumbnailUrl(video.thumbnail_url)}
                      alt={video.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
          )}
          {activeTab === 1 && (
            <Grid container spacing={2}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getThumbnailUrl(video.thumbnail_url)}
                      alt={video.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
          )}
          {activeTab === 2 && (
            <Grid container spacing={2}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getThumbnailUrl(video.thumbnail_url)}
                      alt={video.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
          )}
        </Box>
      </Paper>
      {isOwnProfile && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default Profile; 