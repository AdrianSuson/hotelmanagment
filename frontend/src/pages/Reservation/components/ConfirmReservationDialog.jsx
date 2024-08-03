import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { FormSectionObject } from "../../../components/FormSection";
import Webcam from "react-webcam";
import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import config from "../../../state/config";

const ConfirmReservationDialog = ({
  userId,
  logUserAction,
  confirmDialogOpen,
  handleCloseConfirmDialog,
  handleFileChange,
  roomStatus,
  setReservations,
  reservations,
  showSnackbar,
  fetchReservations,
  currentRow,
  roomId,
  setConfirmDialogOpen,
  setFile,
  setPreviewUrl,
  handleChangeRoomStatus,
}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const webcamRef = useRef(null);

  const fetchReservationDetails = useCallback(async (reservationId) => {
    try {
      const response = await axios.get(`${config.API_URL}/reservation/${reservationId}`);
      if (response.data.success && response.data.reservation.id_picture) {
        const imageUrl = `${config.API_URL}/id_picture/${response.data.reservation.id_picture}`;
        setExistingImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching reservation details:", error);
      showSnackbar("Failed to fetch reservation details.", "error");
    }
  }, [showSnackbar]);

  useEffect(() => {
    if (confirmDialogOpen && currentRow?.id) {
      fetchReservationDetails(currentRow.id);
      console.log(roomStatus)
    }
  }, [confirmDialogOpen, currentRow, fetchReservationDetails,roomStatus]);

  const capture = useCallback(() => {
    const dataURLToBlob = (dataURL) => {
      try {
        const parts = dataURL.split(";base64,");
        if (parts.length !== 2) {
          throw new Error("Invalid base64 data");
        }
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(":")[1];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
      } catch (error) {
        console.error("Error converting data URL to Blob:", error);
        showSnackbar("Failed to process captured image.", "error");
        return null;
      }
    };

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    const file = dataURLToBlob(imageSrc);
    handleFileChange(file);
  }, [webcamRef, handleFileChange, showSnackbar]);

  const recapture = () => {
    setCapturedImage(null);
    setExistingImage(null);
  };

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const submitConfirmation = async () => {
    if (!currentRow) {
      showSnackbar("No reservation selected for confirmation.", "error");
      return;
    }

    const formData = new FormData();
    if (capturedImage) {
      const dataURLToBlob = (dataURL) => {
        try {
          const parts = dataURL.split(";base64,");
          if (parts.length !== 2) {
            throw new Error("Invalid base64 data");
          }
          const byteString = atob(parts[1]);
          const mimeString = parts[0].split(":")[1];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ab], { type: mimeString });
        } catch (error) {
          console.error("Error converting data URL to Blob:", error);
          showSnackbar("Failed to process captured image.", "error");
          return null;
        }
      };

      const blob = dataURLToBlob(capturedImage);
      const randomFilename = `${generateRandomString(16)}.jpg`;
      if (blob) {
        formData.append("id_picture", blob, randomFilename);
      } else {
        showSnackbar("Failed to process captured image.", "error");
        return;
      }
    }

    try {
      const response = await axios.post(
        `${config.API_URL}/confirmReservation/${currentRow.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setReservations(
          reservations.map((reservation) =>
            reservation.id === currentRow.id
              ? { ...reservation, confirmed: true }
              : reservation
          )
        );
        showSnackbar("Reservation confirmed successfully.", "success");
        handleChangeRoomStatus(roomId, roomStatus);
      } else {
        showSnackbar(
          response.data.message || "Unexpected error occurred",
          "error"
        );
      }
      fetchReservations();
      logUserAction(
        userId,
        `Confirm a Reservation of Guest ID: ${currentRow.guest_id}`
      );
    } catch (error) {
      console.error("Error confirming reservation:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to confirm reservation.",
        "error"
      );
    } finally {
      setConfirmDialogOpen(false);
      setCapturedImage(null);
      setPreviewUrl(null);
      setFile(null);
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setExistingImage(null);
    setFile(null);
    setPreviewUrl(null);
    handleCloseConfirmDialog();
  };

  return (
    <Dialog
      open={confirmDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="confirm-dialog-title">Confirm Reservation</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormSectionObject>
              {{
                header: null,
                content: (
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    textAlign={"center"}
                    alignItems={"center"}
                  >
                    <DialogContentText>
                      {existingImage
                        ? "This guest already has an ID picture on file."
                        : "Please capture a valid ID to confirm the reservation."}
                    </DialogContentText>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {existingImage ? (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            ID Picture
                          </Typography>
                          <img
                            src={existingImage}
                            alt="Existing ID"
                            style={{
                              maxWidth: "80%",
                              maxHeight: "150px",
                              marginTop: "10px",
                            }}
                          />
                        </>
                      ) : (
                        capturedImage && (
                          <>
                            <Typography variant="subtitle1" gutterBottom>
                              ID Picture
                            </Typography>
                            <img
                              src={capturedImage}
                              alt="Captured ID"
                              style={{
                                maxWidth: "80%",
                                maxHeight: "150px",
                                marginTop: "10px",
                              }}
                            />
                            <Button
                              onClick={recapture}
                              color="primary"
                              variant="contained"
                              style={{ marginTop: "10px" }}
                            >
                              Recapture
                            </Button>
                          </>
                        )
                      )}
                      {!existingImage && !capturedImage && (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{ width: "100%", maxWidth: "450px" }}
                          />
                          <Button
                            onClick={capture}
                            color="primary"
                            variant="contained"
                            style={{ marginTop: "10px" }}
                          >
                            Capture
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                ),
              }}
            </FormSectionObject>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={submitConfirmation}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmReservationDialog.propTypes = {
  confirmDialogOpen: PropTypes.bool.isRequired,
  handleCloseConfirmDialog: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  roomStatus: PropTypes.number.isRequired,
  setReservations: PropTypes.func.isRequired,
  reservations: PropTypes.array.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  currentRow: PropTypes.object,
  roomId: PropTypes.number.isRequired,
  guestId: PropTypes.number.isRequired,
  setConfirmDialogOpen: PropTypes.func.isRequired,
  setFile: PropTypes.func.isRequired,
  setPreviewUrl: PropTypes.func.isRequired,
  handleChangeRoomStatus: PropTypes.func.isRequired,
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.instanceOf(Blob),
  ]),
  previewUrl: PropTypes.string,
  userId: PropTypes.string.isRequired,
  logUserAction: PropTypes.func.isRequired,
};

export default ConfirmReservationDialog;
