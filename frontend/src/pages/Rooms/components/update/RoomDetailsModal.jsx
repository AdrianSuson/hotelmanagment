import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Modal,
  TextField,
  Input,
  Typography,
  Grid,
  FormControl,
  Alert,
  Autocomplete,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import config from "../../../../state/config";
import {
  FormSectionArray,
  FormSectionObject,
} from "../../../../components/FormSection";

const RoomDetailsModal = ({
  open,
  onClose,
  room,
  roomTypes,
  statusOptions,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    room_number: "",
    room_type: "",
    rate: "",
    status: "",
    imageUrl: "",
  });
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [roomTypeInputValue, setRoomTypeInputValue] = useState("");
  const [statusInputValue, setStatusInputValue] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);

  useEffect(() => {
    if (room) {
      setFormData({
        room_number: room.room_number || "",
        room_type: room.room_type || "",
        rate: room.rate || "",
        status: room.status || "",
        imageUrl: room.imageUrl || "",
      });
      setPreviewUrl(
        room.imageUrl ? `${config.API_URL}/assets/${room.imageUrl}` : null
      );
      setRoomTypeInputValue(room.room_type || "");
      setStatusInputValue(room.status || "");
      const selectedStatus = statusOptions.find(
        (status) => status.label === room.status
      );
      setStatusColor(selectedStatus ? selectedStatus.color : "");
      console.log(
        "Initial Status Color:",
        selectedStatus ? selectedStatus.color : ""
      );
    }
  }, [room, statusOptions]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.room_number = formData.room_number
      ? ""
      : "Room number is required.";
    tempErrors.rate = formData.rate ? "" : "Rate is required.";
    tempErrors.room_type = formData.room_type ? "" : "Room type is required.";
    tempErrors.status = formData.status ? "" : "Status is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    const updatedRoom = new FormData();
    for (const key in formData) {
      updatedRoom.append(key, formData[key]);
    }
    if (selectedImage) {
      updatedRoom.append("image", selectedImage);
    }

    // Log FormData for debugging
    for (let pair of updatedRoom.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    onSave(updatedRoom);
    handleCloseConfirmDialog();
  };

  const handleRoomNumberChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({ ...prevState, room_number: value }));
  };

  const handleRoomTypeChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      room_type: newValue ? newValue.name : "",
    }));
    setRoomTypeInputValue(newValue ? newValue.name : "");
  };

  const handleRateChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({ ...prevState, rate: value }));
  };

  const handleStatusChange = (event, newValue) => {
    setFormData((prevState) => ({
      ...prevState,
      status: newValue ? newValue.label : "",
    }));
    setStatusInputValue(newValue ? newValue.label : "");
    setStatusColor(newValue ? newValue.color : "");
    console.log("Selected Status Color:", newValue ? newValue.color : "");
  };

  useEffect(() => {
    console.log("Status Input Value:", statusInputValue);
  }, [statusInputValue]);

  useEffect(() => {
    console.log("Status Color:", statusColor);
  }, [statusColor]);

  const handleOpenConfirmDialog = (action) => {
    setConfirmDialogAction(action);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmDialogAction(null);
  };

  const handleConfirmDialogAction = () => {
    if (confirmDialogAction === "save") {
      handleSave();
    } else if (confirmDialogAction === "delete") {
      onDelete(room.id);
    }
    handleCloseConfirmDialog();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.primary[900] }}
          >
            Edit Room Details
          </Typography>
          {previewUrl && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="Room Image Preview"
                sx={{ width: 200, borderRadius: 1 }}
              />
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: theme.palette.primary[900] }}
              >
                Current Image
              </Typography>
            </Box>
          )}
          <FormSectionObject>
            {{
              header: null,
              content: (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      margin="dense"
                      name="room_number"
                      label="Room Number"
                      value={formData.room_number}
                      onChange={handleRoomNumberChange}
                      fullWidth
                      error={!!errors.room_number}
                      helperText={errors.room_number}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      margin="dense"
                      name="rate"
                      label="Rate"
                      value={formData.rate}
                      onChange={handleRateChange}
                      fullWidth
                      error={!!errors.rate}
                      helperText={errors.rate}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="dense">
                      <Autocomplete
                        key={roomTypeInputValue}
                        options={roomTypes}
                        getOptionLabel={(option) => option.name}
                        value={
                          roomTypes.find(
                            (type) => type.name === formData.room_type
                          ) || null
                        }
                        onChange={handleRoomTypeChange}
                        inputValue={roomTypeInputValue}
                        onInputChange={(event, newInputValue) => {
                          setRoomTypeInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Room Type"
                            margin="dense"
                            error={!!errors.room_type}
                            helperText={errors.room_type}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      margin="dense"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: statusColor,
                          },
                          "& fieldset": {
                            borderColor: statusColor,
                          },
                        },
                      }}
                    >
                      <Autocomplete
                        key={statusInputValue}
                        options={statusOptions}
                        getOptionLabel={(option) => option.label}
                        value={
                          statusOptions.find(
                            (status) => status.label === formData.status
                          ) || null
                        }
                        onChange={handleStatusChange}
                        inputValue={statusInputValue}
                        onInputChange={(event, newInputValue) => {
                          setStatusInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Status"
                            margin="dense"
                            error={!!errors.status}
                            helperText={errors.status}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormSectionArray>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ color: theme.palette.primary[900] }}
                      >
                        Upload New Image
                      </Typography>
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        fullWidth
                      />
                    </FormSectionArray>
                  </Grid>
                </Grid>
              ),
            }}
          </FormSectionObject>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              onClick={() => handleOpenConfirmDialog("delete")}
              color="secondary"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Delete
            </Button>
            <Button
              onClick={() => handleOpenConfirmDialog("save")}
              color="primary"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
          {Object.values(errors).some((error) => error) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Please fix the errors above.
            </Alert>
          )}
        </Box>
      </Modal>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {confirmDialogAction === "save" ? "Confirm Save" : "Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {confirmDialogAction === "save"
              ? "Are you sure you want to save these changes?"
              : "Are you sure you want to delete this room?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDialogAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

RoomDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.shape({
    room_number: PropTypes.string,
    room_type: PropTypes.string,
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    imageUrl: PropTypes.string,
    id: PropTypes.number.isRequired,
  }).isRequired,
  roomTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      text_color: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RoomDetailsModal;
