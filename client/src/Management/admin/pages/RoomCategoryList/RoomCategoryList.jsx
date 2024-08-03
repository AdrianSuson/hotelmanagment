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
import Header from "../../components/Header";
import RoomCard from "./RoomCard";
import config from "../../../../globalState/config";

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("");

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

  const filteredRooms = rooms.filter((room) => {
    if (filterType && room.type !== filterType) return false;
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
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" flexDirection="row" justifyContent="start">
        <Header title="Rooms Category" subtitle="view the list of Rooms" />
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="end">
        <FormControl sx={{ p: 2, width: 200 }}>
          <InputLabel id="type">Select type...</InputLabel>
          <Select
            labelId="type"
            label="Select type..."
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
