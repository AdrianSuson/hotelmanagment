import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const CustomSnackbar = ({ snackbar, onClose }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  >
    <Alert onClose={onClose} severity={snackbar.severity} sx={{ width: '100%' }}>
      {snackbar.message}
    </Alert>
  </Snackbar>
);

CustomSnackbar.propTypes = {
  snackbar: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomSnackbar;
