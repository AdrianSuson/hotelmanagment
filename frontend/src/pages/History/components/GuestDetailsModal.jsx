import {
  Modal,
  Typography,
  Box,
  Button,
  useTheme,
  Divider,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";
import config from "../../../state/config";

const GuestDetailsModal = ({
  open,
  onClose,
  record,
  LoguserId,
  logUserAction,
  showSnackbar,
}) => {
  const theme = useTheme();

  if (!record) {
    return null;
  }

  const totalAmount =
    parseFloat(record.roomRate) + parseFloat(record.total_service_charges);

  const handlePrint = () => {
    const printContent = `
      <div style="width: 600px; padding: 20px;">
        <div style="text-align: center;">
          <img
            src="${config.API_URL}/id_picture/${record.guestIdPicture}" 
            alt="Profile Picture"
            style="width: 150px;"
          />
          <h3 style="color: ${theme.palette.primary[900]};">Guest Details</h3>
        </div>
        <hr>
        <h3 style="color: ${theme.palette.text.primary};">Personal Information</h3>
        <p><strong>Name:</strong> ${record.guestName}</p>
        <p><strong>Email:</strong> ${record.guestEmail}</p>
        <p><strong>Phone:</strong> ${record.guestPhone}</p>
        <hr>
        <h3 style="color: ${theme.palette.text.primary};">Room Details</h3>
        <p><strong>Room Number:</strong> ${record.room_number}</p>
        <p><strong>Room Type:</strong> ${record.roomTypeName}</p>
        <hr>
        <h3 style="color: ${theme.palette.text.primary};">Stay Information</h3>
        <p><strong>Check In:</strong> ${record.check_in}</p>
        <p><strong>Check Out:</strong> ${record.check_out}</p>
        <p><strong>Number of Guests:</strong> ${record.guestNumber}</p>
        <p><strong>Adults:</strong> ${record.adults}</p>
        <p><strong>Kids:</strong> ${record.kids}</p>
        <hr>
        <h3 style="color: ${theme.palette.text.primary};">Payment Information</h3>
        <p><strong>Room Rate:</strong> ${record.roomRate}</p>
        <p><strong>Service Charges:</strong> ${record.total_service_charges}</p>
        <p><strong>Total Amount:</strong> ${totalAmount}</p>
        <p><strong>Discount:</strong> ${record.discount_percentage}% (${record.discount_name})</p>
        <p><strong>Amount Paid:</strong> ${record.amount_paid}</p>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();

    logUserAction(LoguserId, `Printed guest details of ID: ${record.guestId}`);
    showSnackbar("Guest details printed successfully.", "success");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(5px)",
      }}
    >
      <Box
        sx={{
          width: 950,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={`${config.API_URL}/id_picture/${record.guestIdPicture}` || ""}
            alt="Profile Picture"
            style={{ width: 250 }}
          />
        </Box>

        <Typography
          variant="h5"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ color: theme.palette.primary[900] }}
        >
          Guest Details
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              Personal Information
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Name:</strong> {record.guestName}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Email:</strong> {record.guestEmail}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Phone:</strong> {record.guestPhone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              Room Details
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Room Number:</strong> {record.room_number}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Room Type:</strong> {record.roomTypeName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              Stay Information
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Check In:</strong> {record.check_in}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Check Out:</strong> {record.check_out}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Number of Guests:</strong> {record.guestNumber}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Adults:</strong> {record.adults}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Kids:</strong> {record.kids}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              Payment Information
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Room Rate:</strong> {record.roomRate}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Service Charges:</strong> {record.total_service_charges}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Total Amount:</strong> {totalAmount}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Discount:</strong> {record.discount_percentage}% (
              {record.discount_name})
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
            >
              <strong>Amount Paid:</strong> {record.amount_paid}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
            color="secondary"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Print
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

GuestDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  record: PropTypes.shape({
    guestId: PropTypes.number,
    guestIdPicture: PropTypes.string,
    guestName: PropTypes.string,
    guestEmail: PropTypes.string,
    guestPhone: PropTypes.string,
    room_number: PropTypes.string,
    roomRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    roomTypeName: PropTypes.string,
    status: PropTypes.string,
    check_in: PropTypes.string,
    check_out: PropTypes.string,
    adults: PropTypes.number,
    kids: PropTypes.number,
    guestNumber: PropTypes.number,
    amount_paid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total_service_charges: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    discount_percentage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    discount_name: PropTypes.string,
  }),
  logUserAction: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  LoguserId: PropTypes.string.isRequired,
};

export default GuestDetailsModal;
