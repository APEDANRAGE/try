import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { ThumbUp, ThumbDown, Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import './VideoPlayer.css';

const API_BASE_URL = 'http://localhost:3001';

interface Comment {
  id: number;
  user_id: number;
  username: string;
  profile_pic_url: string;
  comment: string;
  upload_date: string;
}

interface VideoDetails {
  video: {
    id: number;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    user_id: number;
    views: number;
    upload_date: string;
  };
  likes: number;
  dislikes: number;
  userLikeStatus: number;
  comments: Comment[];
}

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));
  const [randomVideos, setRandomVideos] = useState<any[]>([]);
  const [uploader, setUploader] = useState<any>(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/video/me/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setVideoDetails(response.data.data.videoDetails);
      setComments(response.data.data.videoDetails.comments);
      setRandomVideos(response.data.data.randomVideos || []);
      setUploader(response.data.data.videoDetails.user || null);
      // Update watch history if user is logged in
      if (token) {
        try {
          await axios.post(`${API_BASE_URL}/api/history/`, 
            { video_id: id },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (error) {
          console.error('Error updating watch history:', error);
        }
      }
    } catch (error: any) {
      console.error('Error fetching video:', error);
      setError(error.response?.data?.message || 'Error loading video');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
    // Show thumbnail for 1.5 seconds, then play video
    setShowThumbnail(true);
    const timer = setTimeout(() => {
      setShowThumbnail(false);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [id]);

  const handleLike = async (likeStatus: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/likes/`,
        { video_id: id, like_status: likeStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchVideo(); // Re-fetch video details to update like/dislike counts and status
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/comments/`,
        { 
          video_id: id,
          comment: newComment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewComment('');
      fetchVideo(); // re-fetch comments
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/comments/`,
        { video_id: id, comment: editCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditCommentText('');
      fetchVideo(); // re-fetch comments
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  // Helper to get correct image URLs
  const getProfilePicUrl = (filename: string) => filename ? `${API_BASE_URL}/profile_pics/${filename.replace(/^.*[\\\/]/, '')}` : '';
  const getBackgroundPicUrl = (filename: string) => filename ? `${API_BASE_URL}/background_pics/${filename.replace(/^.*[\\\/]/, '')}` : '';
  const getThumbnailUrl = (filename: string) => filename ? `${API_BASE_URL}/thumbnails/${filename.replace(/^.*[\\\/]/, '')}` : '';

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !videoDetails) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error || 'Video not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {/* Uploader info */}
            {uploader && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={getProfilePicUrl(uploader.profile_pic_url)}
                  sx={{ cursor: 'pointer', width: 48, height: 48 }}
                  onClick={() => navigate(`/profile/${uploader.id}`)}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => navigate(`/profile/${uploader.id}`)}
                >
                  {uploader.username}
                </Typography>
              </Box>
            )}
            <Box sx={{ position: 'relative', width: '100%', maxHeight: '70vh' }}>
              <img
                src={getThumbnailUrl(videoDetails.video.thumbnail_url)}
                alt="Video thumbnail"
                className={`video-thumbnail${showThumbnail ? ' show' : ' hide'}`}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover', borderRadius: 8, position: 'absolute', top: 0, left: 0, zIndex: 2, transition: 'opacity 0.7s' }}
              />
              <video
                ref={videoRef}
                controls
                autoPlay
                className={`video-player${showThumbnail ? ' hide' : ' show'}`}
                style={{ width: '100%', maxHeight: '70vh', borderRadius: 8, position: 'relative', zIndex: 1, opacity: showThumbnail ? 0 : 1, transition: 'opacity 0.7s' }}
                src={`${API_BASE_URL}${videoDetails.video.video_url}`}
                poster={getThumbnailUrl(videoDetails.video.thumbnail_url)}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ cursor: uploader ? 'pointer' : 'default' }}
                onClick={uploader ? () => navigate(`/profile/${uploader.id}`) : undefined}
              >
                {videoDetails.video.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {videoDetails.video.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <IconButton
                  color={videoDetails.userLikeStatus === 1 ? 'primary' : 'default'}
                  onClick={() => handleLike(videoDetails.userLikeStatus === 1 ? 0 : 1)}
                >
                  <ThumbUp />
                </IconButton>
                <Typography>{videoDetails.likes}</Typography>
                <IconButton
                  color={videoDetails.userLikeStatus === -1 ? 'error' : 'default'}
                  onClick={() => handleLike(videoDetails.userLikeStatus === -1 ? 0 : -1)}
                >
                  <ThumbDown />
                </IconButton>
                <Typography>{videoDetails.dislikes}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </Box>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar
                  src={getProfilePicUrl(comment.profile_pic_url)}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${comment.user_id}`)}
                />
                <Box>
                  <Typography variant="subtitle2">
                    {comment.username}
                  </Typography>
                  {editingCommentId === comment.id ? (
                    <>
                      <TextField
                        value={editCommentText}
                        onChange={e => setEditCommentText(e.target.value)}
                        size="small"
                        sx={{ mt: 1, mb: 1 }}
                      />
                      <Button size="small" onClick={() => handleEditComment(comment.id)} sx={{ mr: 1 }}>Save</Button>
                      <Button size="small" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2">{comment.comment}</Typography>
                      {comment.user_id === userId && (
                        <Button size="small" onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditCommentText(comment.comment);
                        }}>Edit</Button>
                      )}
                    </>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.upload_date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {randomVideos.map((video) => (
              <Box key={video.id} sx={{ display: 'flex', gap: 2, mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/video/${video.id}`)}>
                <img
                  src={getThumbnailUrl(video.thumbnail_url)}
                  alt={video.title}
                  style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }}
                />
                <Box>
                  <Typography variant="subtitle2" noWrap>{video.title}</Typography>
                  <Typography variant="body2" color="text.secondary">Views: {video.views}</Typography>
                  <Typography variant="body2" color="text.secondary">Likes: {video.likes} | Dislikes: {video.dislikes}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoPlayer; 