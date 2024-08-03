import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import config from "../../../globalState/config";
import RoomCard from "./RoomCard";
import Header from "../../components/Header";

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${config.API_URL}/rooms`);
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        const availableRooms = data.filter(
          (room) => room.status === "Available"
        );
        setRooms(availableRooms);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handlePriceChange = (event) => {
    setFilterPrice(event.target.value);
  };

  const filteredRooms = rooms.filter((room) => {
    if (filterType && room.type !== filterType) return false;
    if (filterPrice && room.price > parseInt(filterPrice)) return false;
    return true;
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box m={5} mt={10}>
      <Box display="flex" flexDirection="row" justifyContent="start">
        <Header title="Available Rooms" subtitle="Book a Room now" />
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="end">
        <FormControl sx={{ marginBottom: 2, width: "10rem" }}>
          <InputLabel id="type">Setect Type....</InputLabel>
          <Select
            labelId="type"
            label="Setect Type...."
            value={filterType}
            onChange={handleTypeChange}
            variant="outlined"
            sx={{ marginRight: 2 }}
          >
            <MenuItem value="">All Types</MenuItem>
            {roomTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ marginBottom: 2, width: "10rem" }}>
          <InputLabel id="price">Setect Price....</InputLabel>
          <Select
            labelId="price"
            label="Setect Price...."
            value={filterPrice}
            onChange={handlePriceChange}
            variant="outlined"
          >
            <MenuItem value="">All Prices</MenuItem>
            <MenuItem value="100">$100 and below</MenuItem>
            <MenuItem value="200">$200 and below</MenuItem>
            <MenuItem value="300">$300 and below</MenuItem>
            <MenuItem value="400">$400 and below</MenuItem>
            <MenuItem value="500">$500 and below</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableRooms;

const roomTypes = [
  "Single Room",
  "Double Room",
  "Twin Room",
  "Suite",
  "Deluxe Room",
  "Family Room",
  "Studio Room",
  "Accessible Room",
  "Presidential Suite",
];
