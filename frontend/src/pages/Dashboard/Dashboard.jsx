import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import axios from "axios";
import dayjs from "dayjs";
import config from "../../state/config";
import AdvertisementCard from "./components/AdvertisementCard";

const Dashboard = () => {
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [checkOutsToday, setCheckOutsToday] = useState(0);
  const [reservationsToday, setReservationsToday] = useState(0);
  const [ads, setAds] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stayRecordsResponse, reservationsResponse, adsResponse] =
          await Promise.all([
            axios.get(`${config.API_URL}/stay_records`),
            axios.get(`${config.API_URL}/reservations`),
            axios.get(`${config.API_URL}/ads`),
          ]);

        const stayRecords = stayRecordsResponse.data.stay_records;
        const today = dayjs().format('YYYY-MM-DD'); // Get today's date in YYYY-MM-DD format

        console.log("Today:", today);

        const totalCheckInsCount = stayRecords.length;
        const checkOutsCount = stayRecords.filter((record) => {
          const checkOutDate = dayjs(record.check_out).format('YYYY-MM-DD');
          console.log("Checking record:", record);
          console.log("Check-out date:", checkOutDate);

          return checkOutDate === today;
        }).length;

        setTotalCheckIns(totalCheckInsCount);
        setCheckOutsToday(checkOutsCount);
        setReservationsToday(reservationsResponse.data.reservations.length);
        setAds(adsResponse.data);
      } catch (error) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleOutlineIcon
                  style={{ fontSize: 50, marginRight: 16 }}
                  color="primary"
                />
                <Box>
                  <Typography variant="h5">Total Check-Ins</Typography>
                  <Typography variant="h2" color="primary">
                    {totalCheckIns}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ExitToAppIcon
                  style={{ fontSize: 50, marginRight: 16 }}
                  color="secondary"
                />
                <Box>
                  <Typography variant="h5">Check-Outs Today</Typography>
                  <Typography variant="h2" color="secondary">
                    {checkOutsToday}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BookOnlineIcon
                  style={{ fontSize: 50, marginRight: 16 }}
                  color="success"
                />
                <Box>
                  <Typography variant="h5">Reservations Today</Typography>
                  <Typography variant="h2" color="success">
                    {reservationsToday}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Advertisements
        </Typography>
        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid
              item
              key={ad.id}
              xs={12}
              sm={6}
              md={4}
              onMouseEnter={() => setHoveredItem(ad.id)} 
              onMouseLeave={() => setHoveredItem(null)} 
            >
              <AdvertisementCard ad={ad} isHovered={hoveredItem === ad.id} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
