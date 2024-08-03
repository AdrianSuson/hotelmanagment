import { Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./globalState/ProtectedRoute";


/* Admin Import */
import AdminLayout from "./Management/admin/components/Layout/Layout";
import AdminLoginPage from "./Management/admin/pages/Login/LoginPage";
import AdminRoomsPage from "./Management/admin/pages/Rooms/RoomPage";
import AdminCheckInPage from "./Management/admin/pages/CheckIn/CheckInPage"
import AdminDashboard from "./Management/admin/pages/Home/Dashboard";
import AdminRoomCategoryList from "./Management/admin/pages/RoomCategoryList/RoomCategoryList";
import AdminUsers from "./Management/admin/pages/Users/Users";

/* Staff Inmport */
import StaffDashboard from "./Management/staff/Pages/Dasboard/StaffDashboard";

/* Client Import*/
import ClientRooms from "./client/pages/Rooms/Rooms"
import ClientLayout from "./client/pages/Layout/layout";
import ClientHomePage from "./client/pages/HomePage";


function App() {
  return (
    <div className="main-content">
      <div style={{ flexGrow: 1 }}>
        <Routes>
          {/* Client Routes */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<ClientHomePage />} />
            <Route path="/availability" element={<ClientRooms />} />
          </Route>
          

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route 
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/rooms" element={<AdminRoomsPage />} />
            <Route path="/room-category-list" element={<AdminRoomCategoryList />} />
            <Route path="/check-in" element={<AdminCheckInPage/>} />
          </Route>

          {/* Staff Route */}
          <Route path="/staff-dashboard" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
