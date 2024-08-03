import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  Button,
  Container,
  Modal,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ButtonGroup,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import config from "../../state/config";
import UserLoginInfo from "./UserLoginInfo";
import useSnackbar from "../Snackbar/useSnackbar";
import CustomSnackbar from "../Snackbar/CustomSnackbar";

const UserProfile = ({ userId, open, onClose, fetchUser, fetchProfile }) => {
  const theme = useTheme();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const [userLogs, setUserLogs] = useState([]);
  const [logLoading, setLogLoading] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loginInfoOpen, setLoginInfoOpen] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/profile/${userId}`);
        setProfile(response.data.profile);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    if (userId && open) {
      fetchProfileData();
    }
  }, [userId, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setProfile({
      ...profile,
      image_url: URL.createObjectURL(file),
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("firstName", profile.first_name);
    formData.append("lastName", profile.last_name);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phone_number);
    formData.append("address", profile.address);
    if (selectedImage) {
      formData.append("profilePic", selectedImage);
    }

    try {
      await axios.put(
        `${config.API_URL}/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showSnackbar("Profile updated successfully", "success");
      setEditing(false);
      fetchProfile();
      fetchUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      showSnackbar("Failed to update profile", "error");
    }
  };

  const handleLogOpen = async () => {
    setLogOpen(true);
    setLogLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/user_log/${userId}`);
      setUserLogs(response.data.logs);
      setLogLoading(false);
    } catch (error) {
      console.error("Error fetching user logs:", error);
      setLogLoading(false);
    }
  };

  const handleLogClose = () => {
    setLogOpen(false);
  };

  const handlePrintDialogOpen = () => {
    setPrintDialogOpen(true);
  };

  const handlePrintDialogClose = () => {
    setPrintDialogOpen(false);
  };

  const handlePrint = () => {
    let filteredLogs;
    switch (filterType) {
      case "year":
        filteredLogs = userLogs.filter((log) => {
          const actionDate = new Date(log.action_time);
          return actionDate.getFullYear() === startDate.year();
        });
        break;
      case "month":
        filteredLogs = userLogs.filter((log) => {
          const actionDate = new Date(log.action_time);
          return (
            actionDate.getFullYear() === startDate.year() &&
            actionDate.getMonth() === startDate.month()
          );
        });
        break;
      case "day":
        filteredLogs = userLogs.filter((log) => {
          const actionDate = new Date(log.action_time);
          return (
            actionDate.getFullYear() === startDate.year() &&
            actionDate.getMonth() === startDate.month() &&
            actionDate.getDate() === startDate.date()
          );
        });
        break;
      case "range":
        filteredLogs = userLogs.filter((log) => {
          const actionDate = new Date(log.action_time);
          return (
            (!startDate || actionDate >= startDate.toDate()) &&
            (!endDate || actionDate <= endDate.toDate())
          );
        });
        break;
      default:
        filteredLogs = userLogs;
    }

    const printContent = `
      <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead style="background-color: #f1f1f1;">
          <tr>
            <th style="padding: 8px;">Action</th>
            <th style="padding: 8px;">Time</th>
          </tr>
        </thead>
        <tbody>
          ${filteredLogs
            .map(
              (log) => `
            <tr>
              <td style="padding: 8px;">${log.action}</td>
              <td style="padding: 8px;">${new Date(
                log.action_time
              ).toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "PRINT", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f1f1f1; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    handlePrintDialogClose();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Container
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ color: theme.palette.primary[900] }}
            >
              User Profile
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : `${config.API_URL}/profile_pictures/${profile.image_url}`
              }
              alt={`${profile.first_name} ${profile.last_name}`}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            {editing && (
              <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Change Image
                <input
                  type="file"
                  hidden
                  onChange={handleImageChange}
                  name="profilePic"
                />
              </Button>
            )}
            {editing ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="First Name"
                      name="first_name"
                      value={profile.first_name || ""}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Last Name"
                      name="last_name"
                      value={profile.last_name || ""}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      name="email"
                      value={profile.email || ""}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Phone Number"
                      name="phone_number"
                      value={profile.phone_number || ""}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Address"
                  name="address"
                  value={profile.address || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: theme.palette.primary[900] }}
                >
                  {profile.first_name} {profile.last_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: theme.palette.primary[900] }}
                >
                  {profile.email}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: theme.palette.primary[900] }}
                >
                  {profile.phone_number}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: theme.palette.primary[900] }}
                >
                  {profile.address}
                </Typography>
              </>
            )}
          </Box>
          <Box
            sx={{ my: 2, display: "flex", justifyContent: "center", gap: 1 }}
          >
            <ButtonGroup
              variant="contained"
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {editing ? (
                <Button
                  onClick={handleUpdate}
                  startIcon={<SaveIcon />}
                  sx={{
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  onClick={() => setEditing(true)}
                  startIcon={<EditIcon />}
                  sx={{
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  Edit
                </Button>
              )}
              <Button onClick={handleLogOpen}>View Logs</Button>
              <Button onClick={() => setLoginInfoOpen(true)}>
                Update Login Info
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
              onClick={onClose}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </Box>

          <Dialog open={logOpen} onClose={handleLogClose}>
            <DialogTitle>User Logs</DialogTitle>
            <DialogContent>
              {logLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={handlePrintDialogOpen}
                    sx={{ mb: 2 }}
                  >
                    Print Logs
                  </Button>
                  <List>
                    {userLogs.map((log) => (
                      <ListItem key={log.log_id}>
                        <ListItemText
                          primary={log.action}
                          secondary={new Date(log.action_time).toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLogClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={printDialogOpen} onClose={handlePrintDialogClose}>
            <DialogTitle>Print Filters</DialogTitle>
            <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl variant="outlined" sx={{ minWidth: 200, my: 2 }}>
                  <InputLabel>Filter Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Filter Type"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="year">By Year</MenuItem>
                    <MenuItem value="month">By Month</MenuItem>
                    <MenuItem value="day">By Day</MenuItem>
                    <MenuItem value="range">By Range</MenuItem>
                  </Select>
                </FormControl>

                {filterType !== "all" && filterType !== "range" && (
                  <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                    <DatePicker
                      views={
                        filterType === "year"
                          ? ["year"]
                          : filterType === "month"
                          ? ["year", "month"]
                          : ["year", "month", "day"]
                      }
                      label={`Select ${
                        filterType.charAt(0).toUpperCase() + filterType.slice(1)
                      }`}
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} sx={{ my: 2 }} />
                      )}
                    />
                  </Stack>
                )}

                {filterType === "range" && (
                  <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} sx={{ mb: 2 }} />
                      )}
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} sx={{ mb: 2 }} />
                      )}
                    />
                  </Stack>
                )}
              </LocalizationProvider>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handlePrint} color="primary">
                Print
              </Button>
              <Button
                variant="contained"
                onClick={handlePrintDialogClose}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Modal>
      <UserLoginInfo
        loggedInUserId={loggedInUserId}
        showSnackbar={showSnackbar}
        open={loginInfoOpen}
        onClose={() => setLoginInfoOpen(false)}
      />
      <CustomSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
};

export default UserProfile;
