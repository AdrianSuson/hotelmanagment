import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import config from "../../../../globalState/config";

const UserAdd = ({ onClose }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!userData.username || !userData.password || !userData.role) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post(`${config.API_URL}/register`, userData);
      if (response.status === 201) {
        onClose(); // Close the dialog on successful registration
        alert("User added successfully");
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      alert(
        "Failed to add user: " + error.response?.data?.message || error.message
      );
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          name="username"
          value={userData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={userData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Role"
          name="role"
          select
          value={userData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UserAdd.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UserAdd;
