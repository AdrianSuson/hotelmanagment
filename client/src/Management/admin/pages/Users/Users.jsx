import { useState, useEffect } from "react";
import { Box, useTheme, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UserAdd from "./UserAdd";
import UserUpdate from "./UserUpdate";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";
import config from "../../../../globalState/config";

const Users = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState({});
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleUpdateFormClose = () => {
    setUpdateFormOpen(false);
    setSelectedUserId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleUserUpdate = (id) => {
    const userData = users.find((user) => user.id === id);
    setSelectedUserId(id);
    setSelectedUserData(userData);
    setUpdateFormOpen(true);
  };

  const filteredData = users.filter(
    (user) =>
      user.id.toString().toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleUserUpdate(params.row.id)}
          sx={{
            color: theme.palette.primary[500],
            background: theme.palette.secondary[500],
            transition: "transform 0.2s",
            "&:hover": {
              color: theme.palette.secondary[600],
              background: theme.palette.primary[600],
              transform: "scale(1.1)",
            },
          }}
        >
          {isSmallScreen ? <UpdateIcon /> : "Update"}
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.row.id)}
          sx={{
            color: theme.palette.primary[500],
            background: theme.palette.secondary[500],
            transition: "transform 0.2s",
            "&:hover": {
              color: theme.palette.secondary[600],
              background: theme.palette.primary[600],
              transform: "scale(1.1)",
            },
          }}
        >
          {isSmallScreen ? <DeleteIcon /> : "Delete"}
        </Button>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="USERS"
        subtitle="Managing users and list of users"
      />
      <Button
        variant="contained"
        sx={{ mt: "1rem", mr: ".5rem" }}
        startIcon={<PersonAddIcon />}
        onClick={handleOpenDialog}
      >
        Add User
      </Button>
      {isDialogOpen && <UserAdd onClose={handleCloseDialog} />}
      {updateFormOpen && (
        <UserUpdate
          open={updateFormOpen}
          onClose={handleUpdateFormClose}
          userId={selectedUserId}
          initialData={selectedUserData}
          fetchUsers={fetchUsers} // Passing fetchUsers to refresh list
        />
      )}

      <Box
        mt={2}
        height="75vh"
        width="95%"
        sx={{
          background: "linear-gradient(135deg, #f5f7fa, #99c199)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          "& .MuiDataGrid-root": {
            border: "none",
            borderRadius: "5rem",
          },
          "& .MuiDataGrid-cell": {
            backgroundColor: theme.palette.primary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.primary[400],
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary[300],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.primary[400],
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: theme.palette.primary[600],
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-selectIcon":
            {
              color: theme.palette.secondary[100],
            },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={handleSearchChange}
            sx={{
              mr: 2,
              width: "300px",
            }}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
          />
        </Box>

        <DataGrid
          rows={filteredData}
          columns={columns}
          autoHeight
        />
      </Box>
    </Box>
  );
};

export default Users;
