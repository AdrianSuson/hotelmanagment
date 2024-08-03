import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";

const ReservationDialog = ({
  open,
  onClose,
  onReservation,
  room,
  customerInfo,
  onInputChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reservation Details for Room {room.roomNumber}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={customerInfo.name}
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          id="contactNumber"
          name="contactNumber"
          label="Contact Number"
          type="text"
          fullWidth
          value={customerInfo.contactNumber}
          onChange={onInputChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <DatePicker fullWidth label="Check In" sx={{ mt: 1, mr: .5 }} />
            <DatePicker
              label="Checkout"
              value={customerInfo.checkout}
              sx={{ mt: 1, ml:.5 }}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onReservation} variant="contained" color="primary">
          Reserve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReservationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReservation: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
  customerInfo: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default ReservationDialog;
