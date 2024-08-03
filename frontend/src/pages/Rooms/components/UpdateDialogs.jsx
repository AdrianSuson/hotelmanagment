import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../../state/config";

export const StatusDialog = ({
  open,
  currentStatus,
  onClose,
  onUpdate,
}) => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [newStatus, setNewStatus] = useState(currentStatus);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/status`);
        setStatusOptions(response.data.statusOptions);
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    };

    fetchStatusOptions();
  }, []);

  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const handleChange = (value) => {
    setNewStatus(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Room Status</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Status"
          value={newStatus}
          onChange={(e) => handleChange(e.target.value)}
          fullWidth
          margin="normal"
        >
          {statusOptions.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: status.color,
                      marginRight: 1,
                      color: status.text_color,
                    }}
                  />
                  {status.code} - {status.label}
                </Box>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onUpdate(newStatus)} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

StatusDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

StatusDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const RoomNumberDialog = ({
  open,
  newRoomNumber,
  onChange,
  onClose,
  onUpdate,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Update Room Number</DialogTitle>
    <DialogContent>
      <TextField
        label="Room Number"
        value={newRoomNumber}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onUpdate} color="primary">
        Update
      </Button>
    </DialogActions>
  </Dialog>
);

RoomNumberDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  newRoomNumber: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const RoomTypeDialog = ({
  open,
  roomTypeOptions,
  newRoomType,
  onChange,
  onClose,
  onUpdate,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Update Room Type</DialogTitle>
    <DialogContent>
      <TextField
        select
        label="Room Type"
        value={newRoomType}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        margin="normal"
      >
        {roomTypeOptions.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onUpdate} color="primary">
        Update
      </Button>
    </DialogActions>
  </Dialog>
);

RoomTypeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  roomTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  newRoomType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const RoomRateDialog = ({
  open,
  newRoomRate,
  onChange,
  onClose,
  onUpdate,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Update Room Rate</DialogTitle>
    <DialogContent>
      <TextField
        label="Room Rate"
        value={newRoomRate}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onUpdate} color="primary">
        Update
      </Button>
    </DialogActions>
  </Dialog>
);

RoomRateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  newRoomRate: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const ImageUpdateDialog = ({ open, onChange, onClose, onUpdate }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Update Room Image</DialogTitle>
    <DialogContent>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
        style={{ marginBottom: "16px" }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onUpdate} color="primary">
        Update
      </Button>
    </DialogActions>
  </Dialog>
);

ImageUpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const ImageDialog = ({ open, selectedImage, onClose, onUpdate }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogContent>
      <img
        src={selectedImage}
        alt="Room"
        style={{
          width: "80%",
          margin: "0 auto",
          display: "block",
          borderRadius: "10px",
        }}
      />
      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={onUpdate} size="small">
          Update Image
        </Button>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

ImageDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedImage: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export const DeleteDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this room?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
