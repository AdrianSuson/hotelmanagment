import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import PropTypes from "prop-types";
import config from "../../../state/config";
import dayjs from "dayjs";
import RoomSelectionDialog from "./RoomSelectionDialog";
import {
  FormSectionArray,
  FormSectionFunction,
} from "../../../components/FormSection";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name should have at least 2 characters")
    .max(50, "First name should not exceed 50 characters")
    .matches(
      /^[a-zA-Z. ]+$/,
      "First name should only contain letters, spaces, and periods"
    ),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name should have at least 2 characters")
    .max(50, "Last name should not exceed 50 characters")
    .matches(
      /^[a-zA-Z. ]+$/,
      "Last name should only contain letters, spaces, and periods"
    ),
  phoneNumber: yup
    .string()
    .matches(
      /^0[0-9\s]*$/,
      "Phone number must start with 0 and contain only digits"
    )
    .min(10, "Phone number should be at least 10 digits")
    .max(15, "Phone number should not exceed 15 digits")
    .required("Phone number is required"),

  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  checkInDate: yup
    .date()
    .required("Check-in date is required")
    .min(
      dayjs().startOf("day").toDate(),
      "Check-in date cannot be in the past"
    ),
  checkOutDate: yup
    .date()
    .required("Check-out date is required")
    .min(
      yup.ref("checkInDate"),
      "Check-out date cannot be before check-in date"
    ),
  adults: yup
    .number()
    .min(1, "At least one adult is required")
    .max(10, "Number of adults cannot exceed 10")
    .required("Number of adults is required"),
  kids: yup
    .number()
    .min(0, "Number of kids cannot be negative")
    .max(10, "Number of kids cannot exceed 10"),
  room_id: yup.string().required("Room selection is required"),
});

const steps = ["Guest Information", "Reservation Details", "Review & Complete"];

const ReservationForm = ({
  onClose,
  onAddReservation,
  showSnackbar,
  roomSelection,
}) => {
  const [rooms, setRooms] = useState([]);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/rooms`);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleNumberInputChange = (field, event) => {
    const value = event.target.value;
    formik.setFieldValue(field, formatPhoneNumber(value));
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return value;
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      checkInDate: null,
      checkOutDate: null,
      adults: 1,
      kids: 0,
      room_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${config.API_URL}/makeNewReservation`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            room_id: values.room_id,
            check_in: dayjs(values.checkInDate).format("YYYY-MM-DD"),
            check_out: dayjs(values.checkOutDate).format("YYYY-MM-DD"),
            adults: values.adults,
            kids: values.kids,
          }
        );

        if (response.data.success) {
          showSnackbar("Reservation created successfully!", "success");
          onAddReservation();
          onClose();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Reservation Error:", error);
        showSnackbar(
          error.response?.data?.message ||
            "An error occurred during reservation.",
          error.response?.data?.message === "Email already exists."
            ? "warning"
            : "error"
        );
      }
    },
  });

  const shouldDisableDate = (date) => {
    return dayjs(date).isBefore(dayjs(), "day");
  };

  const handleSelectRoom = (roomId) => {
    formik.setFieldValue("room_id", roomId);
    const room = rooms.find((room) => room.id === roomId);
    setSelectedRoom(room);
    setOpenRoomDialog(false);
  };

  const handleNextGuestInfo = async () => {
    const guestInfoErrors = await formik.validateForm();

    if (
      !guestInfoErrors.firstName &&
      !guestInfoErrors.lastName &&
      !guestInfoErrors.phoneNumber &&
      !guestInfoErrors.email
    ) {
      try {
        // Check if the email already exists
        const response = await axios.post(`${config.API_URL}/checkEmail`, {
          email: formik.values.email,
        });

        if (response.data.exists) {
          formik.setFieldError(
            "email",
            "Email is already registered. Please use a different email."
          );
          showSnackbar(
            "Email is already registered. Please use a different email.",
            "error"
          );
        } else {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      } catch (error) {
        console.error("Error checking email:", error);
        showSnackbar(
          "An error occurred while checking the email. Please try again.",
          "error"
        );
      }
    } else {
      formik.setTouched({
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
      });
      showSnackbar("Please fill all required fields correctly.", "error");
    }
  };

  const handleNextReservationDetails = async () => {
    const reservationDetailsErrors = await formik.validateForm();
    if (
      !reservationDetailsErrors.checkInDate &&
      !reservationDetailsErrors.checkOutDate &&
      !reservationDetailsErrors.adults &&
      !reservationDetailsErrors.kids &&
      !reservationDetailsErrors.room_id
    ) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      formik.setTouched({
        checkInDate: true,
        checkOutDate: true,
        adults: true,
        kids: true,
        room_id: true,
      });
      showSnackbar("Please fill all required fields correctly.", "error");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (activeStep === 0) {
      handleNextGuestInfo();
    } else if (activeStep === 1) {
      handleNextReservationDetails();
    } else if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    }
  };

  const calculateTotalRate = (checkInDate, checkOutDate, roomRate) => {
    const checkIn = dayjs(checkInDate);
    const checkOut = dayjs(checkOutDate);
    var numberOfDays;
    if (checkIn.isSame(checkOut)) numberOfDays = 1;
    else numberOfDays = checkOut.diff(checkIn, "day");
    return numberOfDays * roomRate;
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography>Reservation Details</Typography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <FormSectionArray>
                  <Typography variant="h6" gutterBottom>
                    Guest Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        type="text"
                        variant="outlined"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.firstName &&
                          Boolean(formik.errors.firstName)
                        }
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        variant="outlined"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.lastName &&
                          Boolean(formik.errors.lastName)
                        }
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="dense"
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        variant="outlined"
                        value={formik.values.phoneNumber}
                        onChange={(e) =>
                          handleNumberInputChange("phoneNumber", e)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.phoneNumber &&
                          Boolean(formik.errors.phoneNumber)
                        }
                        helperText={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                  </Grid>
                </FormSectionArray>
              </Grid>
            )}
            {activeStep === 1 && (
              <Grid container spacing={2} mt="1px">
                <FormSectionFunction>
                  {() => (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Reservation Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Check-in Date"
                            value={formik.values.checkInDate}
                            onChange={(newValue) =>
                              formik.setFieldValue("checkInDate", newValue)
                            }
                            onBlur={() =>
                              formik.setFieldTouched("checkInDate", true)
                            }
                            slotProps={{
                              textField: {
                                error:
                                  formik.touched.checkInDate &&
                                  Boolean(formik.errors.checkInDate),
                                helperText:
                                  formik.touched.checkInDate &&
                                  formik.errors.checkInDate,
                              },
                            }}
                            shouldDisableDate={shouldDisableDate}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Check-out Date"
                            value={formik.values.checkOutDate}
                            onChange={(newValue) =>
                              formik.setFieldValue("checkOutDate", newValue)
                            }
                            onBlur={() =>
                              formik.setFieldTouched("checkOutDate", true)
                            }
                            slotProps={{
                              textField: {
                                error:
                                  formik.touched.checkOutDate &&
                                  Boolean(formik.errors.checkOutDate),
                                helperText:
                                  formik.touched.checkOutDate &&
                                  formik.errors.checkOutDate,
                              },
                            }}
                            shouldDisableDate={shouldDisableDate}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            margin="dense"
                            name="adults"
                            label="Number of Adults"
                            type="number"
                            variant="outlined"
                            value={formik.values.adults}
                            onChange={(e) =>
                              handleNumberInputChange("adults", e)
                            }
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            error={
                              formik.touched.adults &&
                              Boolean(formik.errors.adults)
                            }
                            helperText={
                              formik.touched.adults && formik.errors.adults
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            margin="dense"
                            name="kids"
                            label="Number of Kids"
                            type="number"
                            variant="outlined"
                            value={formik.values.kids}
                            onChange={(e) => handleNumberInputChange("kids", e)}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            error={
                              formik.touched.kids && Boolean(formik.errors.kids)
                            }
                            helperText={
                              formik.touched.kids && formik.errors.kids
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box mt={2}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setOpenRoomDialog(true)}
                              fullWidth
                            >
                              Select Room
                            </Button>
                            {formik.touched.room_id &&
                              formik.errors.room_id && (
                                <Typography color="error" mt={1}>
                                  {formik.errors.room_id}
                                </Typography>
                              )}
                            {selectedRoom && (
                              <Typography mt={2}>
                                <strong>Selected Room:</strong>{" "}
                                {selectedRoom.room_number} -{" "}
                                {selectedRoom.room_type} - ₱{selectedRoom.rate}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </FormSectionFunction>
              </Grid>
            )}
            {activeStep === 2 && (
              <Grid container spacing={2} mt="1px">
                <FormSectionFunction>
                  {() => (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Review & Complete
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>First Name:</strong>{" "}
                            {formik.values.firstName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Last Name:</strong> {formik.values.lastName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Phone Number:</strong>{" "}
                            {formik.values.phoneNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Email:</strong> {formik.values.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Check-in Date:</strong>{" "}
                            {dayjs(formik.values.checkInDate).format(
                              "YYYY-MM-DD"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Check-out Date:</strong>{" "}
                            {dayjs(formik.values.checkOutDate).format(
                              "YYYY-MM-DD"
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Number of Adults:</strong>{" "}
                            {formik.values.adults}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Number of Kids:</strong>{" "}
                            {formik.values.kids}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Selected Room:</strong>{" "}
                            {selectedRoom
                              ? `${selectedRoom.room_number} - ${selectedRoom.room_type}`
                              : "No room selected"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <strong>Total Rate:</strong> ₱
                            {selectedRoom
                              ? calculateTotalRate(
                                  formik.values.checkInDate,
                                  formik.values.checkOutDate,
                                  selectedRoom.rate
                                )
                              : "0"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </FormSectionFunction>
              </Grid>
            )}
            <DialogActions>
              {activeStep !== 0 && (
                <Button
                  onClick={handleBack}
                  color="secondary"
                  variant="contained"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={
                  activeStep === steps.length - 1 &&
                  (!formik.isValid || !formik.dirty)
                }
              >
                {activeStep === steps.length - 1
                  ? "Complete Reservation"
                  : "Next"}
              </Button>
              {activeStep === 2 && (
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
              )}
            </DialogActions>
          </form>
        </LocalizationProvider>
      </DialogContent>
      <RoomSelectionDialog
        roomSelection={roomSelection}
        open={openRoomDialog}
        onClose={() => setOpenRoomDialog(false)}
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
      />
    </Dialog>
  );
};

ReservationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddReservation: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  roomSelection: PropTypes.number.isRequired,
};

export default ReservationForm;
