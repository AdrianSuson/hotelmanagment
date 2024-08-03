import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  useMediaQuery,
  useTheme,
  DialogContent,
  Dialog,
  Container,
} from "@mui/material";
import PropTypes from "prop-types";
import AddRoomForm from "./components/AddRoomForm";
import RoomTable from "./components/RoomTable";
import config from "../../state/config";
import useSnackbar from "../../components/Snackbar/useSnackbar";
import CustomSnackbar from "../../components/Snackbar/CustomSnackbar";

const RoomPage = ({ logUserAction, defaultRoomStatus }) => {
  const [rooms, setRooms] = useState([]);
  const userId = localStorage.getItem("userId");
  const [open, setOpen] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery(theme.breakpoints.up("md"));

  const fetchRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${config.API_URL}/rooms`);
      console.log("Rooms fetched:", response.data.rooms); // Debugging log
      setRooms(
        response.data.rooms.map((room) => ({
          ...room,
          id: room.id,
          roomNumber: room.room_number,
          roomType: room.room_type,
          status: room.status,
          rate: parseFloat(room.rate),
          imageUrl: room.imageUrl || "/assets/default-image.jpg",
          textColor: room.text_color,
          color: room.color,
        }))
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleRoomAdded = () => {
    showSnackbar("Room added successfully!", "success");
    logUserAction(userId, `Added room successfully!`);
    fetchRooms();
    setOpen(false);
  };

  return (
    <Container>
      <Box>
        <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{ fontSize: isNonMediumScreens ? "1rem" : "0.8rem" }}
          >
            Add Room
          </Button>
        </Box>

        <RoomTable
          showSnackbar={showSnackbar}
          logUserAction={logUserAction}
          LoguserId={userId}
          rooms={rooms}
          roomfetch={fetchRooms}
          defaultRoomStatus={defaultRoomStatus}
        />

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <AddRoomForm
              onRoomAdded={handleRoomAdded}
              fetchRooms={fetchRooms}
              showSnackbar={showSnackbar}
              onCancel={() => setOpen(false)} // Pass the onCancel prop here
            />
          </DialogContent>
        </Dialog>
        <CustomSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    </Container>
  );
};

RoomPage.propTypes = {
  defaultRoomStatus: PropTypes.number.isRequired,
  logUserAction: PropTypes.func.isRequired,
};

export default RoomPage;
