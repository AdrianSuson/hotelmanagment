import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import axios from "axios";
import config from "../../../state/config";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GuestDetailsModal from "./GuestDetailsModal";
import PrintIcon from "@mui/icons-material/Print";

const HistoryTable = ({ logUserAction, showSnackbar, LoguserId }) => {
  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  const [checkIns, setCheckIns] = useState([]);
  const [filteredCheckIns, setFilteredCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState("");
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const fetchCheckins = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${config.API_URL}/stay_records_history`
      );
      const formattedCheckIns = data.stay_records_history.map((checkin) => ({
        id: checkin.id,
        guestId: checkin.guest_id,
        ...checkin,
        check_in: dayjs(checkin.check_in).format("YYYY-MM-DD"),
        check_out: dayjs(checkin.check_out).format("YYYY-MM-DD"),
      }));
      setCheckIns(formattedCheckIns);
      setFilteredCheckIns(formattedCheckIns);
    } catch (error) {
      console.error("Failed to fetch stay records:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const handleViewClick = (record) => {
    setCurrentRecord(record);
    setModalOpen(true);
    logUserAction(LoguserId, `Viewed details of ID:'${record.id}'`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePrintDialogOpen = useCallback(() => {
    setPrintDialogOpen(true);
  }, []);

  const handlePrintDialogClose = () => {
    setPrintDialogOpen(false);
  };

  const handlePrint = () => {
    let filteredCheckIns;
    switch (filterType) {
      case "year":
        filteredCheckIns = checkIns.filter((checkin) => {
          const checkInDate = dayjs(checkin.check_in);
          return checkInDate.isSame(startDate, "year");
        });
        break;
      case "month":
        filteredCheckIns = checkIns.filter((checkin) => {
          const checkInDate = dayjs(checkin.check_in);
          return checkInDate.isSame(startDate, "month");
        });
        break;
      case "day":
        filteredCheckIns = checkIns.filter((checkin) => {
          const checkInDate = dayjs(checkin.check_in);
          return checkInDate.isSame(startDate, "day");
        });
        break;
      case "range":
        filteredCheckIns = checkIns.filter((checkin) => {
          const checkInDate = dayjs(checkin.check_in);
          return (
            (!startDate ||
              checkInDate.isAfter(startDate) ||
              checkInDate.isSame(startDate, "day")) &&
            (!endDate ||
              checkInDate.isBefore(endDate) ||
              checkInDate.isSame(endDate, "day"))
          );
        });
        break;
      default:
        filteredCheckIns = checkIns;
    }

    const printContent = `
      <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead style="background-color: #f1f1f1;">
          <tr>
            <th style="padding: 8px;">Guest ID</th>
            <th style="padding: 8px;">Guest Name</th>
            <th style="padding: 8px;">Room No.</th>
            <th style="padding: 8px;">Check In</th>
            <th style="padding: 8px;">Check Out</th>
            <th style="padding: 8px;">Guest No.</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCheckIns
            .map(
              (checkin) => `
            <tr>
              <td style="padding: 8px;">${checkin.guestId}</td>
              <td style="padding: 8px;">${checkin.guestName}</td>
              <td style="padding: 8px;">${checkin.room_number}</td>
              <td style="padding: 8px;">${checkin.check_in}</td>
              <td style="padding: 8px;">${checkin.check_out}</td>
              <td style="padding: 8px;">${checkin.guestNumber}</td>
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
    logUserAction(LoguserId, "Printed stay records history");
  };

  const handleSearchChange = useCallback(
    (event) => {
      const value = event.target.value.toLowerCase();
      setSearch(value);
      setFilteredCheckIns(
        checkIns.filter(
          (checkin) =>
            checkin.id.toString().toLowerCase().includes(value) ||
            checkin.guestName.toLowerCase().includes(value) ||
            checkin.room_number.toLowerCase().includes(value) ||
            checkin.check_in.toLowerCase().includes(value) ||
            checkin.check_out.toLowerCase().includes(value) ||
            checkin.guestNumber.toString().toLowerCase().includes(value)
        )
      );
    },
    [checkIns]
  );

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: theme.palette.primary[900],
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "guestName",
      headerName: "Guest Name",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: theme.palette.primary[900],
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "room_number",
      headerName: "Room No.",
      flex: 1,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: theme.palette.primary[900],
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "check_in",
      headerName: "Check In",
      flex: 1,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: theme.palette.primary[900],
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "check_out",
      headerName: "Check Out",
      flex: 1,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: theme.palette.primary[900],
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "guestNumber",
      headerName: "Guest No.",
      flex: 1,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: theme.palette.primary[900],
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "view",
      headerName: "View",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            color: theme.palette.secondary[100],
            background: theme.palette.primary.main,
            "&:hover": {
              transform: "scale(1.1)",
              color: theme.palette.primary[700],
              background: theme.palette.secondary.main,
            },
          }}
          onClick={() => handleViewClick(params.row)}
          startIcon={<RemoveRedEyeIcon />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box
              gridColumn="span 12"
              height={isMediumOrLarger ? "75vh" : "60vh"}
              sx={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                "& .MuiDataGrid-root": {
                  background: "linear-gradient(135deg, #F5F7FAA9, #99c199)",
                  border: "none",
                  borderRadius: "10px",
                },
                "& .MuiDataGrid-cell": {
                  backgroundColor: theme.palette.primary[200],
                  borderBottom: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.75rem",
                },
                "& .MuiDataGrid-columnHeaders": {
                  background: "linear-gradient(135deg, #F5F7FAA9, #99c199)",
                  borderBottom: "none",
                  fontSize: "0.75rem",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  fontSize: "0.75rem",
                },
                "& .MuiDataGrid-footerContainer": {
                  fontSize: "0.75rem",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: theme.palette.primary.dark,
                  fontSize: "0.75rem",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon":
                  {
                    fontSize: "0.75rem",
                  },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                my={1}
                mx={2}
              >
                <TextField
                  label="Search"
                  variant="outlined"
                  value={search}
                  size="small"
                  onChange={handleSearchChange}
                  sx={{ width: "300px" }}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handlePrintDialogOpen}
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
              </Stack>
              <DataGrid rows={filteredCheckIns} columns={columns} />
            </Box>
          </Box>
        </>
      )}
      {currentRecord && (
        <GuestDetailsModal
          open={modalOpen}
          record={currentRecord}
          onClose={handleCloseModal}
          logUserAction={logUserAction}
          LoguserId={LoguserId}
          showSnackbar={showSnackbar}
        />
      )}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

HistoryTable.propTypes = {
  logUserAction: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  LoguserId: PropTypes.string.isRequired,
};

export default HistoryTable;
