import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  CategoryOutlined,
  PeopleAltOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import PropTypes from 'prop-types';
import BedroomParentOutlinedIcon from '@mui/icons-material/BedroomParentOutlined';
import ReservationIcon from '@mui/icons-material/BookOnlineOutlined';
import ChecKInIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckOutIcon from '@mui/icons-material/AssignmentReturnOutlined';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import Logo from "../../../../assets/Logo.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Reservation",
    icon: <ReservationIcon />,
  },
  {
    text: "Check In",
    icon: <ChecKInIcon />,
  },
  {
    text: "Check Out",
    icon: <CheckOutIcon />,
  },
  {
    text: "Room Category List",
    icon: <CategoryOutlined />,
  },
  {
    text: "Rooms",
    icon: <BedroomParentOutlinedIcon />,
  },
  {
    text: "Users",
    icon: <PeopleAltOutlined />,
  },
  {
    text: "Settings",
    icon: <SettingsOutlined />,
  },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.default,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.primary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    component="img"
                    alt="profile"
                    src={Logo}
                    height="50px"
                    width="50px"
                    borderRadius="50%"
                    sx={{ objectFit: "cover" }}
                  />
                  <Typography variant="h6" color={theme.palette.text.primary}>
                    Hotel Management
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem", color: theme.palette.primary.main }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase().replace(/\s+/g, '-');

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.primary.light
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  drawerWidth: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isNonMobile: PropTypes.bool,
};

export default Sidebar;
