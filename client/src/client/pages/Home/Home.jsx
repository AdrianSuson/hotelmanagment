import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const backgroundUrl = "../../../assets/BG.jpg";

const Home = () => {
  const navigate = useNavigate(); 

  const handleCheckAvailability = () => {
    navigate('/availability'); 
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          boxShadow:
            "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        Welcome to SBA Hotel
      </Typography>
      <Typography
        variant="body1"
        sx={{
          boxShadow:
            "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        Experience the best in hospitality and comfort at our premier hotel.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: 2,
          boxShadow: "0px 4px 6px -2px rgba(0,0,0,0.3)",
        }}
        onClick={handleCheckAvailability} 
      >
        Check Availability
      </Button>
    </Box>
  );
};

export default Home;
