import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner = ({ message = 'Loading...', size = 40 }: LoadingSpinnerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: '#1A237E',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Box
                sx={{
                  width: size * 0.3,
                  height: size * 0.3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1A237E 0%, #00796B 100%)',
                }}
              />
            </motion.div>
          </Box>
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default LoadingSpinner;