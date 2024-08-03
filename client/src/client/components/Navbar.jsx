import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar
      position="absolute"
      sx={{
        width: "100%",
        flexGrow: 1,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        {/* Hotel Management to the left */}
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{ margin: "0 10px", flexGrow: 0 }}
        >
          Hotel Management
        </Button>

        {/* Spacer element to push remaining buttons to the right */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Other navigation buttons on the right */}
        <Button
          color="inherit"
          component={Link}
          to="/about"
          sx={{ margin: "0 10px" }}
        >
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
