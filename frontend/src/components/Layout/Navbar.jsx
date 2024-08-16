import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../state/config";

const Navbar = ({ navTitle, isMinimized, setIsMinimized }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const userId = localStorage.getItem("userId");
  const [aboutUs, setAboutUs] = useState({ title: "", description: "" });
  const [aboutUsOpen, setAboutUsOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    if (userId) {
      await axios.post(`${config.API_URL}/user_log`, {
        userId,
        action: "User logged out",
      });
    }
    navigate("/", { replace: true });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.reload(false);
  };

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/about-us`);
        if (response.data) {
          setAboutUs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch About Us data:", error);
      }
    };
    fetchAboutUs();
  }, []);

  const handleAboutUsOpen = () => setAboutUsOpen(true);
  const handleAboutUsClose = () => setAboutUsOpen(false);

  // Conditionally append "Management" to the navTitle
  const displayTitle =
    navTitle === "Dashboard"
      ? "Dashboard Overview"
      : navTitle !== "Transaction History" &&
        navTitle !== "Settings" &&
        navTitle !== "Guest History"
      ? `${navTitle} Management`
      : navTitle;

  return (
    <AppBar position="static" sx={{ background: "none", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton onClick={() => setIsMinimized(!isMinimized)}>
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h3"
          color={theme.palette.primary.main}
          sx={{ fontWeight: "bold", letterSpacing: 2 }}
        >
          {displayTitle}
        </Typography>

        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
          <MenuItem onClick={handleAboutUsOpen}>
            <InfoIcon sx={{ marginRight: 1 }} /> About Us
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon sx={{ marginRight: 1 }} /> Log Out
          </MenuItem>
        </Menu>
      </Toolbar>

      <Dialog open={aboutUsOpen} onClose={handleAboutUsClose}>
        <DialogTitle>About Us</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{aboutUs.title}</Typography>
          <Typography variant="body2">{aboutUs.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAboutUsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

Navbar.propTypes = {
  navTitle: PropTypes.string.isRequired,
  isMinimized: PropTypes.bool.isRequired,
  setIsMinimized: PropTypes.func.isRequired,
};

export default Navbar;
