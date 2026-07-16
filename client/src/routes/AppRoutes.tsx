import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import ManageUsersPage from "../pages/Admin/ManageUsersPage";
import ManageRequestsPage from "../pages/Admin/ManageRequestsPage";
import AdminRoute from "./AdminRoute";
import CreateRequestPage from "../pages/CreateRequest/CreateRequestPage";
import RequestsPage from "../pages/Requests/RequestsPage";
import MyRequestsPage from "../pages/MyRequests/MyRequestsPage";
import DonationsPage from "../pages/Donations/DonationsPage";
import DonorsPage from "../pages/Donors/DonorsPage";
import ProfilePage from "../pages/Profile/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Route */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <AdminRoute>
                <ManageRequestsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/requests/create"
            element={<CreateRequestPage />}
          />

          <Route
            path="/requests"
            element={<RequestsPage />}
          />

          <Route
            path="/my-requests"
            element={<MyRequestsPage />}
          />

          <Route
            path="/donations"
            element={<DonationsPage />}
          />

          <Route
            path="/donors"
            element={<DonorsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;