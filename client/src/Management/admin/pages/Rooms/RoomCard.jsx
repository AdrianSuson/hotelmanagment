import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";
import config from "../../../../globalState/config";

const RoomCard = ({ room, onRoomUpdated, onRoomDeleted }) => {
  const theme = useTheme();
  const [openEdit, setOpenEdit] = useState(false);
  const [roomData, setRoomData] = useState({
    type: room.type,
    price: room.price,
    roomNumber: room.roomNumber,
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState(null);

  const imageUrl = room.imageUrl
    ? `${config.API_URL}${room.imageUrl}`
    : "/assets/default-image.jpg";

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:3000/rooms/${room.id}`);
      onRoomDeleted(room.id);
    } catch (error) {
      console.error("Error deleting room:", error);
      setError("Failed to delete room. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file.name);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", roomData.type);
    formData.append("price", roomData.price);
    formData.append("roomNumber", roomData.roomNumber);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:3000/rooms/${room.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onRoomUpdated({
        ...room,
        ...roomData,
        imageUrl: image ? URL.createObjectURL(image) : room.imageUrl,
      });
      handleEditClose();
    } catch (error) {
      console.error("Error updating room:", error);
      setError("Failed to update room. Please try again later.");
    }
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          position: "relative",
          mb: 3,
          boxShadow: theme.shadows[3],
          borderRadius: theme.shape.borderRadius,
          transition: "transform 0.3s",
          "&:hover": {
            boxShadow: theme.shadows[10],
            transform: "scale(1.05)",
            "& .MuiCardContent-root": {
              opacity: 1,
            },
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="250"
            image={imageUrl}
            alt={`Room ${room.roomNumber}`}
            sx={{
              borderTopLeftRadius: theme.shape.borderRadius,
              borderTopRightRadius: theme.shape.borderRadius,
            }}
          />
          <CardContent
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: theme.palette.common.white,
              padding: theme.spacing(2),
              opacity: 0,
              transition: "opacity 0.3s",
            }}
          >
            <Typography gutterBottom variant="h5" component="div">
              Room {room.roomNumber}
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
              Type: {room.type}
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
              Price: ${room.price}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleEditOpen}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>

      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Type"
                  name="type"
                  value={roomData.type}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="Enter room type"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={roomData.price}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="Enter room price"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Room Number"
                  name="roomNumber"
                  type="text"
                  value={roomData.roomNumber}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="Enter room number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {imageName && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    {imageName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {error && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  onRoomUpdated: PropTypes.func.isRequired,
  onRoomDeleted: PropTypes.func.isRequired,
};

export default RoomCard;
