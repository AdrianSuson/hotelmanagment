import {
  Box,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const backgroundUrl = "../../../../assets/BG.jpg";
const logoUrl = "../../../../assets/Logo.png";

const LoginPage = () => {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", { username, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role); // Store the user role
        if (response.data.role === "admin") {
          navigate("/dashboard");
        } else if (response.data.role === "staff") {
          navigate("/staff-dashboard"); // Change this to your staff dashboard path
        } else {
          setError("Invalid role");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <AppBar
        position="static"
        sx={{
          width: "100%",
          boxShadow: "none",
          marginBottom: 4,
          backgroundColor: theme.palette.primary[600],
        }}
      >
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 0 }}>
            SBA Hotel Management  System
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 6,
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logoUrl}
              alt="School Logo"
              style={{ width: 250, height: "auto" }}
            />
            <Typography variant="h4" sx={{ mt: 2, color: "white" }}>
              Elevate Your Hospitality Career
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Card
            sx={{
              width: 350,
              padding: 4,
              boxShadow: 5,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
