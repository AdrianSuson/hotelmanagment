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
  IconButton,
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
import DiscountIcon from "@mui/icons-material/Discount";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
  const [cashTendered, setCashTendered] = useState("");
  const [change, setChange] = useState(0);
  const [services, setServices] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [servicesDialogOpen, setServicesDialogOpen] = useState(false);
  const [addDiscountDialogOpen, setAddDiscountDialogOpen] = useState(false);

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
        totalAmount: prev.roomCharges + additionalServicesCharges,
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
  }, [open, fetchServices, fetchDiscounts]);

  const discountAmount = useMemo(() => {
    const selectedDiscount = discounts.find(
      (discount) => discount && discount.id === discountId
    );
    return selectedDiscount
      ? (billDetails.roomCharges + billDetails.additionalServicesCharges) *
          (selectedDiscount.percentage / 100)
      : 0;
  }, [discountId, discounts, billDetails]);

  const totalAmountAfterDiscount = useMemo(() => {
    return (
      billDetails.roomCharges +
      billDetails.additionalServicesCharges -
      discountAmount
    );
  }, [billDetails, discountAmount]);

  const handleApplyDiscount = () => {
    const selectedDiscount = discounts.find(
      (discount) => discount && discount.id === discountId
    );
    if (!selectedDiscount) {
      showSnackbar("Invalid discount selected", "error");
      return;
    }
    setBillDetails((prev) => ({
      ...prev,
      discount: discountAmount,
      totalAmount: totalAmountAfterDiscount,
      discountName: selectedDiscount.name,
    }));
    setDiscountId("");
  };

  const handleRemoveDiscount = () => {
    setBillDetails((prev) => ({
      ...prev,
      discount: 0,
      totalAmount: prev.roomCharges + prev.additionalServicesCharges,
      discountName: null,
    }));
    showSnackbar("Discount removed successfully", "success");
  };

  const handlePaymentAndStatusChange = async () => {
    try {
      await onChangeRoomStatus(selectedRoomId, roomStatusCheckOut);

      const payload = {
        amount: billDetails.totalAmount,
        payment_method: "cash",
        total_service_charges: billDetails.additionalServicesCharges,
        discount_percentage: billDetails.discount
          ? (billDetails.discount /
              (billDetails.roomCharges +
                billDetails.additionalServicesCharges)) *
            100
          : 0,
        discount_name: billDetails.discountName || null,
      };

      await axios.post(
        `${config.API_URL}/stay_records/${selectedStayRecordId}/payment`,
        payload
      );

      showSnackbar("Payment processed successfully", "success");
      logUserAction(
        userId,
        `Processed payment for stay record ID: ${selectedStayRecordId}`
      );

      fetchStayRecords();
      onClose();
    } catch (error) {
      showSnackbar("Payment or status update failed", "error");
    }
  };

  const handleAddDiscount = (newDiscount) => {
    setDiscounts((prev) => [...prev, newDiscount]);
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/discounts/${id}`);
      setDiscounts((prev) =>
        prev.filter((discount) => discount && discount.id !== id)
      );
      showSnackbar("Discount deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete discount", "error");
    }
  };

  const numberOfDays = useMemo(() => {
    return dayjs(checkOutDate).diff(dayjs(checkInDate), "day") || 1;
  }, [checkOutDate, checkInDate]);

  const roomRatePerDay = useMemo(() => {
    return (billDetails.roomCharges / numberOfDays).toFixed(2);
  }, [billDetails.roomCharges, numberOfDays]);

  const handleCashTenderedChange = (e) => {
    const cash = parseFloat(e.target.value) || 0;
    const changeAmount = cash - billDetails.totalAmount;
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
          <Box mb={0.5}>
            <Typography color="primary" variant="h6">
              Stay Duration: {numberOfDays} {numberOfDays > 1 ? "days" : "day"}{" "}
              @ ₱{roomRatePerDay} per day
            </Typography>
          </Box>
          <Paper variant="outlined" sx={{ p: 1, mb: 0.5 }}>
            <Typography variant="body1">
              <strong>Room Charges:</strong> ₱
              {(billDetails.roomCharges ?? 0).toFixed(2)}
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
              <Grid item xs={11}>
                <Box display="flex" flex="row" justifyContent="space-between">
                  <Typography variant="body1">
                    <strong>Discount:</strong> -₱
                    {(billDetails.discount ?? 0).toFixed(2)}
                  </Typography>
                  {billDetails.discount > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleRemoveDiscount}
                      sx={{ mt: 1 }}
                    >
                      Remove Discount
                    </Button>
                  )}
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
                              <IconButton
                                onClick={() =>
                                  handleDeleteDiscount(discount.id)
                                }
                                edge="end"
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
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
              <Grid item xs={1} sx={{ marginTop: 3.5 }}>
                <IconButton
                  variant="contained"
                  onClick={() => setAddDiscountDialogOpen(true)}
                  color="primary"
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={handleApplyDiscount}
              fullWidth
              sx={{ mt: 1 }}
              endIcon={<DiscountIcon />}
            >
              Apply Discount
            </Button>
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
              <strong>Total Due:</strong> ₱
              {(billDetails.totalAmount ?? 0).toFixed(2)}
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
