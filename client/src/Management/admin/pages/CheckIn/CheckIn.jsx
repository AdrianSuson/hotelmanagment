import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

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

const CheckIn = () => {
  const [checkInData, setCheckInData] = useState({
    type: "",
    roomNumber: "",
    guestName: "",
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: "",
    guestDetails: "",
  });
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    if (checkInData.type) {
      fetchAvailableRooms(checkInData.type);
    }
  }, [checkInData.type]);

  const fetchAvailableRooms = async (type) => {
    try {
      const response = await axios.get(`http://localhost:3000/rooms?type=${type}`);
      const available = response.data.filter((room) => room.status !== "occupied");
      setAvailableRooms(available);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckInData({ ...checkInData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/checkin", checkInData);
      alert("Check-in successful");
    } catch (error) {
      console.error("Error checking in:", error);
      alert("Error checking in");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="type-select-label">Room Type</InputLabel>
        <Select
          labelId="type-select-label"
          name="type"
          value={checkInData.type}
          onChange={handleChange}
          label="Room Type"
        >
          {roomTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="roomNumber-select-label">Room Number</InputLabel>
        <Select
          labelId="roomNumber-select-label"
          name="roomNumber"
          value={checkInData.roomNumber}
          onChange={handleChange}
          label="Room Number"
        >
          {availableRooms.map((room) => (
            <MenuItem key={room.roomNumber} value={room.roomNumber}>
              {room.roomNumber}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Guest Name"
        name="guestName"
        value={checkInData.guestName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Guest Details"
        name="guestDetails"
        value={checkInData.guestDetails}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Check-In Date"
        name="checkInDate"
        type="date"
        value={checkInData.checkInDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Check-Out Date"
        name="checkOutDate"
        type="date"
        value={checkInData.checkOutDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Check In
      </Button>
    </Box>
  );
};

export default CheckIn;
