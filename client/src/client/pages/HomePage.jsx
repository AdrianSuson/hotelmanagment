import {Box } from "@mui/material";
import Home from "./Home/Home";
import Rooms from "./Home/Rooms";
import Footer from "./Home/Footer";

function HomePage() {
  return (
    <Box>
      <Home/>
      <Rooms />
      <Footer/>
    </Box>
  );
}

export default HomePage;
