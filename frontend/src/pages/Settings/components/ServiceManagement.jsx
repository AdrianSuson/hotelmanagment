import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import useSnackbar from "../../../components/Snackbar/useSnackbar";
import CustomSnackbar from "../../../components/Snackbar/CustomSnackbar";
import axios from "axios";
import config from "../../../state/config";

const ServiceManagement = ({ logUserAction }) => {
  const [services, setServices] = useState([]);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceBasePrice, setNewServiceBasePrice] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [serviceListDialogOpen, setServiceListDialogOpen] = useState(false);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const loggedInUserId = localStorage.getItem("userId");

  const fetchServices = useCallback(async () => {
    try {
      console.log("Fetching services...");
      const response = await axios.get(`${config.API_URL}/service_list`);

      if (response.status === 200 && response.data.services) {
        const newServices = response.data.services.map((service) => ({
          ...service,
          base_price: parseFloat(service.base_price),
        }));

        // Only update state if the data has changed
        setServices((prevServices) => {
          if (JSON.stringify(prevServices) !== JSON.stringify(newServices)) {
            return newServices;
          }
          return prevServices;
        });
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
      showSnackbar("Failed to fetch services", "error");
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/service_list`, {
        name: newServiceName,
        description: newServiceDescription,
        base_price: newServiceBasePrice,
      });

      setServices((prevServices) => [
        ...prevServices,
        {
          ...response.data.service,
          base_price: parseFloat(response.data.service.base_price),
        },
      ]);
      setNewServiceName("");
      setNewServiceDescription("");
      setNewServiceBasePrice(0);
      setAddServiceOpen(false);
      showSnackbar("Service added successfully", "success");
      logUserAction(
        loggedInUserId,
        `Added new service: ${response.data.service.name}`
      );
    } catch (error) {
      console.error("Failed to add service:", error);
      showSnackbar("Failed to add service", "error");
    }
  };

  const handleDeleteService = async (id) => {
    const serviceToDelete = services.find((s) => s.id === id);
    try {
      const response = await axios.delete(
        `${config.API_URL}/service_list/${id}`
      );
      if (response.data.success) {
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== id)
        );
        showSnackbar("Service deleted successfully", "success");
        logUserAction(
          loggedInUserId,
          `Deleted service: ${serviceToDelete.name}`
        );
      } else {
        console.error(response.data.message);
        showSnackbar(response.data.message, "error");
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete service:", error);
      showSnackbar("Failed to delete service", "error");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    handleDeleteService(deleteTarget);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setAddServiceOpen(true)}
        >
          Add Service
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setServiceListDialogOpen(true)}
        >
          Service Lists
        </Button>
      </Box>

      <Dialog open={addServiceOpen} onClose={() => setAddServiceOpen(false)}>
        <DialogTitle>Add Service</DialogTitle>
        <DialogContent>
          <TextField
            label="Service Name"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Service Description"
            value={newServiceDescription}
            onChange={(e) => setNewServiceDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Base Price"
            type="number"
            value={newServiceBasePrice}
            onChange={(e) => setNewServiceBasePrice(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddService} color="primary">
            Add
          </Button>
          <Button onClick={() => setAddServiceOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this service?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={serviceListDialogOpen}
        onClose={() => setServiceListDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Service Lists</DialogTitle>
        <DialogContent>
          <List>
            {services.map((service) => (
              <ListItem key={service.id}>
                <ListItemText
                  primary={service.name}
                  secondary={`₱${service.base_price.toFixed(2)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(service.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceListDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

ServiceManagement.propTypes = {
  logUserAction: PropTypes.func.isRequired,
};

export default ServiceManagement;
