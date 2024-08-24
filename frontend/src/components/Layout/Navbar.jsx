import { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
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
import AboutUsDialog from "./AboutUS";

const Navbar = ({ navTitle, isMinimized, setIsMinimized }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const isOpen = Boolean(anchorEl);
  const userId = localStorage.getItem("userId");

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
    <>
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
      </AppBar>

      <AboutUsDialog open={aboutUsOpen} onClose={handleAboutUsClose} />
    </>
  );
};

Navbar.propTypes = {
  navTitle: PropTypes.string.isRequired,
  isMinimized: PropTypes.bool.isRequired,
  setIsMinimized: PropTypes.func.isRequired,
};

export default Navbar;
