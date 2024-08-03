import { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
//import ChangeCredentials from "./acount";

const Navbar = ({
  //user,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleAccount = () => setAccountOpen(!accountOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(false);
    navigate("/admin", { replace: true });
  };

  return (
    <AppBar position="static" sx={{ background: "none", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Sidebar Toggle */}
        <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MenuIcon />
        </IconButton>

        {/* Settings and Account Management */}
        <IconButton onClick={handleClick}>
          <SettingsIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
          <MenuItem onClick={toggleAccount}>
            <AccountCircleIcon sx={{ marginRight: 1 }} /> Account
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon sx={{ marginRight: 1 }} /> Log Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  user: PropTypes.object,
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
  setUsername: PropTypes.func,
};

export default Navbar;
