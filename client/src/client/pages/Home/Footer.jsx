import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{
      p: 3,
      color: 'common.white', 
      textAlign: 'center', 
      left: 0,
      bottom: 0,
    }}>
      <Typography variant="body2">
        © 2024 Your Company Name. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer;
