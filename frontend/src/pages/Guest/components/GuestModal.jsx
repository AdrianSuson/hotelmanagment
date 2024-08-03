import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Box,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../state/config";
import NewStayRecordForm from "./NewStayRecordForm";
import NewReservationForm from "./NewReservationForm";
import HistoryDialog from "./HistoryDialog";

const GuestModal = ({
  open,
  onClose,
  guest,
  showSnackbar,
  roomStatus,
  roomSelection,
  logUserAction,
  LogUserId,
}) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [isStayRecordFormOpen, setIsStayRecordFormOpen] = useState(false);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [hasStayRecord, setHasStayRecord] = useState(false);
  const [hasReservation, setHasReservation] = useState(false);

  useEffect(() => {
    if (guest && guest.id_picture) {
      setPreviewUrl(`${config.API_URL}/id_picture/${guest.id_picture}`);
    }
  }, [guest]);

  useEffect(() => {
    const fetchStayRecords = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/stay_records/guest/${guest.id}`
        );
        if (response.data.success && response.data.stay_records.length > 0) {
          setHasStayRecord(true);
        } else {
          setHasStayRecord(false);
        }
      } catch (error) {
        console.error("Error fetching stay records:", error);
        showSnackbar("Failed to fetch stay records.", "error");
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/reservations/guest/${guest.id}`
        );
        if (response.data.success && response.data.reservations.length > 0) {
          setHasReservation(true);
        } else {
          setHasReservation(false);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
        showSnackbar("Failed to fetch reservations.", "error");
      }
    };

    if (guest && guest.id) {
      fetchStayRecords();
      fetchReservations();
    }
  }, [guest, showSnackbar]);

  const handleOpenStayRecordForm = () => {
    setIsStayRecordFormOpen(true);
  };

  const handleOpenReservationForm = () => {
    setIsReservationFormOpen(true);
  };

  const handleCloseStayRecordForm = () => {
    setIsStayRecordFormOpen(false);
  };

  const handleCloseReservationForm = () => {
    setIsReservationFormOpen(false);
  };

  const handleOpenHistoryDialog = () => {
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Guest Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textPrimary">
                <strong>First Name:</strong> {guest.first_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textPrimary">
                <strong>Last Name:</strong> {guest.last_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textPrimary">
                <strong>Phone Number:</strong> {guest.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textPrimary">
                <strong>Email:</strong> {guest.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textPrimary">
                <strong>ID Picture:</strong>
              </Typography>
              {previewUrl && (
                <Box mt={2} textAlign="center">
                  <img
                    src={previewUrl}
                    alt="ID"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            {hasStayRecord && (
              <Alert severity="info">This guest is currently checked in.</Alert>
            )}
            {hasReservation && (
              <Alert severity="info">
                This guest has an active reservation.
              </Alert>
            )}
            {!hasStayRecord && !hasReservation && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenReservationForm}
                >
                  Reservation
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenStayRecordForm}
                >
                  Check-in
                </Button>
              </>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenHistoryDialog}
            >
              View History
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <NewStayRecordForm
        open={isStayRecordFormOpen}
        onClose={handleCloseStayRecordForm}
        roomStatus={roomStatus}
        roomSelection={roomSelection}
        initialGuestData={guest}
        showSnackbar={showSnackbar}
        logUserAction={logUserAction}
        LogUserId={LogUserId}
      />
      <NewReservationForm
        open={isReservationFormOpen}
        onClose={handleCloseReservationForm}
        roomStatus={roomStatus}
        roomSelection={roomSelection}
        initialGuestData={guest}
        showSnackbar={showSnackbar}
        logUserAction={logUserAction}
        LogUserId={LogUserId}
      />
      {guest && guest.id && (
        <HistoryDialog
          open={isHistoryDialogOpen}
          onClose={handleCloseHistoryDialog}
          guestId={guest.id}
          showSnackbar={showSnackbar}
        />
      )}
    </>
  );
};

GuestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  guest: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    id_picture: PropTypes.string,
  }),
  showSnackbar: PropTypes.func.isRequired,
  roomStatus: PropTypes.number.isRequired,
  roomSelection: PropTypes.number.isRequired,
  logUserAction: PropTypes.func.isRequired,
  LogUserId: PropTypes.string.isRequired,
};

export default GuestModal;