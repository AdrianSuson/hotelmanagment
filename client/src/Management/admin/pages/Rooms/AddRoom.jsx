import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import PropTypes from "prop-types";

// Define the room types and status options
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

const statusOptions = ["Available", "Occupied", "Maintenance"];

const AddRoom = ({ onRoomAdded }) => {
  // State for room data and image
  const [roomData, setRoomData] = useState({
    room_number: "",
    room_type_id: "",
    rate: "",
    status_code_id: "",
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file ? file.name : "");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic form validation
    if (!roomData.room_number || !roomData.room_type_id || !roomData.rate) {
      setError("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    // Append room data to form data
    Object.entries(roomData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Append image to form data
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/rooms",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Room added successfully");
      onRoomAdded(response.data);

      // Reset form after successful submission
      setRoomData({ room_number: "", room_type_id: "", rate: "", status_code_id: "" });
      setImage(null);
      setImageName("");
    } catch (error) {
      console.error("Error adding room:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Room Number"
        id="room_number"
        name="room_number"
        type="text"
        value={roomData.room_number}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label="Room Type"
        id="room_type_id"
        name="room_type_id"
        value={roomData.room_type_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {roomTypes.map((type, index) => (
          <MenuItem key={index} value={index + 1}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Rate"
        id="rate"
        name="rate"
        type="number"
        value={roomData.rate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label="Status"
        id="status_code_id"
        name="status_code_id"
        value={roomData.status_code_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statusOptions.map((status, index) => (
          <MenuItem key={index} value={index + 1}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      <label htmlFor="image">{imageName || "Choose Image"}</label>
      <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Room
      </Button>
    </Box>
  );
};

AddRoom.propTypes = {
  onRoomAdded: PropTypes.func.isRequired,
};

export default AddRoom;
