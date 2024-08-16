import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../state/config";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddDiscountDialog from "./AddDiscountDialog";

const BillingDialog = ({
  open,
  onClose,
  billDetails,
  setBillDetails,
  onChangeRoomStatus,
  selectedRoomId,
  selectedStayRecordId,
  checkInDate,
  checkOutDate,
  roomStatusCheckOut,
  userId,
  logUserAction,
  fetchStayRecords,
  showSnackbar,
}) => {
  const [discountId, setDiscountId] = useState("");
  const [previousDiscountApplied, setPreviousDiscountApplied] = useState(false);
  const [cashTendered, setCashTendered] = useState("");
  const [change, setChange] = useState(0);
  const [services, setServices] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [servicesDialogOpen, setServicesDialogOpen] = useState(false);
  const [addDiscountDialogOpen, setAddDiscountDialogOpen] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);

  const fetchServices = useCallback(async () => {
    if (!selectedStayRecordId) return;
    try {
      const { data } = await axios.get(
        `${config.API_URL}/stay_records/${selectedStayRecordId}/services`
      );
      const additionalServicesCharges = data.services.reduce(
        (total, service) => total + parseFloat(service.price),
        0
      );
      setServices(data.services);
      setBillDetails((prev) => ({
        ...prev,
        additionalServicesCharges,
      }));
    } catch (error) {
      showSnackbar("Failed to fetch services", "error");
    }
  }, [selectedStayRecordId, setBillDetails, showSnackbar]);

  const fetchDiscounts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${config.API_URL}/discounts`);
      setDiscounts(data.discounts);
    } catch (error) {
      showSnackbar("Failed to fetch discounts", "error");
    }
  }, [showSnackbar]);

  useEffect(() => {
    if (!open) return;
    fetchDiscounts();
    fetchServices();
    setIsOvertime(dayjs().isAfter(dayjs(checkOutDate), "day"));
  }, [open, fetchDiscounts, fetchServices, checkOutDate]);

  const discountAmount = useMemo(() => {
    const selectedDiscount = discounts.find(
      (discount) => discount && discount.id === discountId
    );
    return selectedDiscount
      ? (billDetails.roomCharges + billDetails.additionalServicesCharges) *
          (selectedDiscount.percentage / 100)
      : 0;
  }, [discountId, discounts, billDetails]);

  const totalAmount = useMemo(() => {
    const totalServiceCharges = billDetails.additionalServicesCharges || 0;
    const totalDiscount = discountAmount || 0;

    const total =
      parseFloat(billDetails.roomCharges) + totalServiceCharges - totalDiscount;

    console.log(
      "roomCharges:",
      billDetails.roomCharges,
      "totalServiceCharges:",
      totalServiceCharges,
      "totalDiscount:",
      totalDiscount,
      "totalAmount:",
      total
    );

    return total;
  }, [
    billDetails.roomCharges,
    billDetails.additionalServicesCharges,
    discountAmount,
  ]);

  const handleApplyDiscount = useCallback(() => {
    const selectedDiscount = discounts.find(
      (discount) => discount && discount.id === discountId
    );
    if (!selectedDiscount) {
      showSnackbar("Invalid discount selected", "error");
      return;
    }
    setPreviousDiscountApplied(true);
    setBillDetails((prev) => ({
      ...prev,
      discount: discountAmount,
      totalAmount: totalAmount,
      discountName: selectedDiscount.name,
    }));
  }, [
    discountId,
    discounts,
    discountAmount,
    totalAmount,
    setBillDetails,
    showSnackbar,
  ]);

  const handleRemoveDiscount = useCallback(() => {
    if (previousDiscountApplied) {
      showSnackbar("Discount removed successfully", "success");
      setPreviousDiscountApplied(false);
    }
    setBillDetails((prev) => ({
      ...prev,
      discount: 0,
      totalAmount: prev.roomCharges + prev.additionalServicesCharges,
      discountName: null,
    }));
  }, [setBillDetails, showSnackbar, previousDiscountApplied]);

  useEffect(() => {
    if (discountId === "" && open) {
      handleRemoveDiscount();
    } else if (open) {
      handleApplyDiscount();
    }
  }, [discountId, handleApplyDiscount, handleRemoveDiscount, open]);

  const handlePaymentAndStatusChange = async () => {
    try {
      // Prepare the payload for the payment request
      const payload = {
        amount: totalAmount, // Ensure this is a number
        payment_method: "cash",
        total_service_charges: billDetails.additionalServicesCharges,
        discount_percentage: discountAmount
          ? (discountAmount /
              (parseFloat(billDetails.roomCharges) +
                parseFloat(billDetails.additionalServicesCharges))) *
            100
          : 0,
        discount_name: billDetails.discountName || null,
      };

      // Send the payment request to the backend
      await axios.post(
        `${config.API_URL}/stay_records/${selectedStayRecordId}/payment`,
        payload
      );

      // Show success message
      showSnackbar("Payment processed successfully", "success");

      // Log user action for audit purposes
      logUserAction(
        userId,
        `Processed payment for stay record ID: ${selectedStayRecordId}`
      );

      // Update the room status after payment is successful
      await onChangeRoomStatus(selectedRoomId, roomStatusCheckOut);

      // Refresh the stay records to reflect the changes
      fetchStayRecords();

      // Close the billing dialog
      onClose();
    } catch (error) {
      // Show error message if something goes wrong
      showSnackbar("Payment or status update failed", "error");
    }
  };

  const handleAddDiscount = (newDiscount) => {
    setDiscounts((prev) => [...prev, newDiscount]);
  };

  // Calculate the number of days of the stay
  const numberOfDays = useMemo(() => {
    const days = dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
    return days > 0 ? days : 1; // Ensure at least 1 day
  }, [checkOutDate, checkInDate]);

  // Calculate the room rate per day
  const roomRatePerDay = useMemo(() => {
    return parseFloat(billDetails.roomRate).toFixed(2);
  }, [billDetails.roomRate]);

  // Calculate the total room charges based on the number of days
  const roomCharges = useMemo(() => {
    const rate = parseFloat(billDetails.roomRate) || 0;
    const charges = rate * numberOfDays;

    console.log(
      "roomRate:",
      rate,
      "numberOfDays:",
      numberOfDays,
      "roomCharges:",
      charges
    );

    return charges;
  }, [billDetails.roomRate, numberOfDays]);

  useEffect(() => {
    setBillDetails((prev) => ({
      ...prev,
      roomCharges: roomCharges,
    }));
  }, [roomCharges, setBillDetails]);

  const handleCashTenderedChange = (e) => {
    const cash = parseFloat(e.target.value) || 0;
    const changeAmount = cash - totalAmount;
    setCashTendered(cash);
    setChange(changeAmount >= 0 ? changeAmount : 0);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="billing-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
            border: "1px solid #000",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            id="billing-modal-title"
            align="center"
            gutterBottom
          >
            Billing Details
          </Typography>

          {isOvertime && (
            <Typography variant="h6" color="error" align="center" gutterBottom>
              Overtime: Extra Day Added
            </Typography>
          )}

          <Box mb={0.5}>
            <Typography color="primary" variant="h6">
              Stay Duration: {numberOfDays} {numberOfDays > 1 ? "days" : "day"}{" "}
              @ ₱{roomRatePerDay} per day
            </Typography>
          </Box>
          <Paper variant="outlined" sx={{ p: 1, mb: 0.5 }}>
            <Typography variant="body1">
              <strong>Room Charges:</strong> ₱{roomCharges ?? 0}
            </Typography>
            <Typography variant="body1">
              <strong>Additional Services:</strong> ₱
              {(billDetails.additionalServicesCharges ?? 0).toFixed(2)}
            </Typography>
            <Button
              onClick={() => setServicesDialogOpen(true)}
              fullWidth
              sx={{ mt: 1 }}
              endIcon={<VisibilityIcon />}
            >
              View Services
            </Button>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1, mb: 0.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Box display="flex" flex="row" justifyContent="space-between">
                  <Typography variant="body1">
                    <strong>Discount:</strong> -₱
                    {(billDetails.discount ?? 0).toFixed(2)}
                  </Typography>
                </Box>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="discount-select-label">
                    Select Discount
                  </InputLabel>
                  <Select
                    labelId="discount-select-label"
                    label="Select Discount"
                    value={discountId}
                    onChange={(e) => setDiscountId(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>No Discount</em>
                    </MenuItem>
                    {discounts.length > 0 ? (
                      discounts.map((discount) =>
                        discount ? (
                          <MenuItem key={discount.id} value={discount.id}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {discount.name} ({discount.percentage}%)
                              </Box>
                            </Box>
                          </MenuItem>
                        ) : null
                      )
                    ) : (
                      <MenuItem disabled>No discounts available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1, mb: 0.5 }}>
            <TextField
              fullWidth
              label="Cash Tendered"
              type="text"
              value={cashTendered}
              onChange={handleCashTenderedChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <Typography variant="h4" sx={{ mt: 2 }}>
              <strong>Total Due:</strong> ₱{totalAmount ?? 0}
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography variant="h4">
              <strong>Change:</strong> ₱{change.toFixed(2)}
            </Typography>
          </Paper>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Button onClick={onClose} variant="contained" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handlePaymentAndStatusChange}
              variant="contained"
              color="primary"
              disabled={!roomStatusCheckOut}
            >
              Pay
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={servicesDialogOpen}
        onClose={() => setServicesDialogOpen(false)}
        aria-labelledby="services-dialog-title"
      >
        <DialogTitle id="services-dialog-title">Services</DialogTitle>
        <DialogContent dividers>
          {services.length > 0 ? (
            <List dense>
              {services.map((service) => (
                <ListItem key={service.id}>
                  <ListItemText
                    primary={service.name}
                    secondary={`₱${service.price}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No services available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServicesDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <AddDiscountDialog
        open={addDiscountDialogOpen}
        onClose={() => setAddDiscountDialogOpen(false)}
        onAddDiscount={handleAddDiscount}
        fetchDiscounts={fetchDiscounts}
      />
    </>
  );
};

BillingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  billDetails: PropTypes.shape({
    roomCharges: PropTypes.number,
    additionalServicesCharges: PropTypes.number,
    discount: PropTypes.number,
    totalAmount: PropTypes.number,
    discountName: PropTypes.string,
    roomRate: PropTypes.string,
  }).isRequired,
  setBillDetails: PropTypes.func.isRequired,
  onChangeRoomStatus: PropTypes.func.isRequired,
  selectedRoomId: PropTypes.number.isRequired,
  selectedStayRecordId: PropTypes.number.isRequired,
  checkInDate: PropTypes.string.isRequired,
  checkOutDate: PropTypes.string.isRequired,
  roomStatusCheckOut: PropTypes.number.isRequired,
  fetchStayRecords: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  logUserAction: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

export default BillingDialog;
