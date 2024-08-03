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
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import config from "../../../state/config";

const UserAdd = ({
  onClose,
  fetchUsers,
  showSnackbar,
  logUserAction,
  userId,
}) => {
  const initialValues = {
    id: "",
    username: "",
    password: "",
    role: "",
  };

  const validationSchema = Yup.object({
    id: Yup.string().required("User ID is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(`${config.API_URL}/register`, values);
      if (response.status === 201) {
        onClose();
        fetchUsers();
        showSnackbar("User added successfully", "success");
        await logUserAction(userId, `Added user '${values.id}'`);
        resetForm();
      } else {
        showSnackbar("Failed to add user", "error");
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      showSnackbar(
        "Failed to add user: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                label="User ID"
                name="id"
                fullWidth
                margin="normal"
                error={touched.id && Boolean(errors.id)}
                helperText={touched.id && errors.id}
              />
              <Field
                as={TextField}
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
              <Field
                as={TextField}
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                label="Role"
                name="role"
                select
                fullWidth
                margin="normal"
                error={touched.role && Boolean(errors.role)}
                helperText={touched.role && errors.role}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Field>
              <DialogActions>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Add User
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

UserAdd.propTypes = {
  onClose: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  logUserAction: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default UserAdd;
