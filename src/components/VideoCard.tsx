import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { PlayArrow, Visibility, ThumbUp, ThumbDown } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  views: number;
  likes: number;
  dislikes: number;
}

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  index: number;
  apiBaseUrl: string;
}

const VideoCard = ({ video, onClick, index, apiBaseUrl }: VideoCardProps) => {
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
            image={`${apiBaseUrl}${video.thumbnail_url}`}
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

export default VideoCard;