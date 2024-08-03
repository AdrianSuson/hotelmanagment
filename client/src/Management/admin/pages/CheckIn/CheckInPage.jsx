import { Container, Typography, Button } from "@mui/material";
import CheckInList from "./CheckInList";
import CheckInForm from "./CheckIn";

const CheckInPage = () => {
  

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Check In
      </Typography>
      <Button variant="contained" color="primary">
        New Check-In
      </Button>
      <CheckInList  />
      <CheckInForm />
    </Container>
  );
};

export default CheckInPage;
