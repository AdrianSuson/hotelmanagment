import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import RoomCard from "./RoomCard";
import AddRoom from "./AddRoom"; // Import the AddRoom component

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/rooms");
        const data = response.data.map((room) => ({
          ...room,
          price: parseFloat(room.price), // Ensure price is a number
          imageUrl: room.imageUrl || "/assets/default-image.jpg", // Ensure imageUrl has a default value if missing
        }));
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRoomAdded = (newRoom) => {
    setRooms([...rooms, newRoom]);
    handleClose();
  };

  const handleRoomUpdated = (updatedRoom) => {
    setRooms(
      rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
    );
  };

  const handleRoomDeleted = (deletedRoomId) => {
    setRooms(rooms.filter((room) => room.id !== deletedRoomId));
  };

  return (
    <Box sx={{ m: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Room
        </Button>
      </Box>
      <Grid container spacing={2}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
            <RoomCard
              room={room}
              onRoomUpdated={handleRoomUpdated}
              onRoomDeleted={handleRoomDeleted}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Room</DialogTitle>
        <DialogContent>
          <AddRoom onRoomAdded={handleRoomAdded} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomPage;
