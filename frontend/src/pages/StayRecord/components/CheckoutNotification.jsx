import { useState, useEffect, useCallback } from "react";
import {
  Snackbar,
  Alert,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Fab,
  styled,
} from "@mui/material";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import axios from "axios";
import config from "../../../state/config";

const StyledFab = styled(Fab)(({ theme }) => ({
  color: theme.palette.secondary[100],
  background: theme.palette.primary.main,
  fontSize: "0.75rem",
  position: "fixed",
  bottom: 5,
  right: 16,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  width: "48px",
  height: "48px",
  minHeight: "48px",
  "&:hover": {
    transform: "scale(1.1)",
    color: theme.palette.primary[700],
    background: theme.palette.secondary.main,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogTitle-root": {
    background: "linear-gradient(135deg, #F5F7FAA9, #99c199)",
    color: theme.palette.primary[900],
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  "& .MuiDialogContent-root": {
    background: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));
const CheckoutNotification = ({ showSnackbar, setStayRecords }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [checkoutTodayRecords, setCheckoutTodayRecords] = useState([]);

  const fetchStayRecords = useCallback(async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD");

      const { data } = await axios.get(`${config.API_URL}/stay_records`);
      const stayRecordsWithServices = await Promise.all(
        data.stay_records.map(async (stayRecord) => {
          const formattedCheckIn = dayjs(stayRecord.check_in).format(
            "YYYY-MM-DD"
          );
          const formattedCheckOut = dayjs(stayRecord.check_out).format(
            "YYYY-MM-DD"
          );

          return {
            id: stayRecord.id,
            ...stayRecord,
            check_in: formattedCheckIn,
            check_out: formattedCheckOut,
          };
        })
      );
      setStayRecords(stayRecordsWithServices);

      const checkoutToday = stayRecordsWithServices.filter(
        (record) => record.check_out === today
      );
      setCheckoutTodayRecords(checkoutToday);
      if (checkoutToday.length > 0) {
        setNotificationOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch stay records:", error);
      showSnackbar("Failed to fetch data. Please try again.", "error");
    }
  }, [showSnackbar, setStayRecords]);

  useEffect(() => {
    fetchStayRecords();
  }, [fetchStayRecords]);

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleNotificationDialogOpen = () => {
    setNotificationDialogOpen(true);
  };

  const handleNotificationDialogClose = () => {
    setNotificationDialogOpen(false);
  };

  return (
    <>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          There are rooms that are due for checkout today!
        </Alert>
      </Snackbar>
      <StyledFab onClick={handleNotificationDialogOpen}>
        <Badge badgeContent={checkoutTodayRecords.length} color="error">
          <NotificationImportantIcon />
        </Badge>
      </StyledFab>
      <StyledDialog
        open={notificationDialogOpen}
        onClose={handleNotificationDialogClose}
      >
        <DialogTitle>Rooms Due for Checkout Today</DialogTitle>
        <DialogContent>
          <List>
            {checkoutTodayRecords.map((record) => (
              <StyledListItem key={record.id}>
                <ListItemText
                  primary={`Room ${record.room_number}`}
                  secondary={`Guest: ${record.guestName}`}
                />
              </StyledListItem>
            ))}
          </List>
        </DialogContent>
      </StyledDialog>
    </>
  );
};

CheckoutNotification.propTypes = {
  showSnackbar: PropTypes.func.isRequired,
  setStayRecords: PropTypes.func.isRequired,
};

export default CheckoutNotification;
