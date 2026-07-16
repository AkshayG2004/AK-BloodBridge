import {
  LayoutDashboard,
  Users,
  Droplets,
  ClipboardList,
  HeartHandshake,
  User,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
      isActive
        ? "bg-red-600 text-white"
        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
    }`;

  return (
    <aside className="w-72 bg-white border-r shadow-lg flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold text-red-600">
          AK BloodBridge
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Welcome, {user?.name}
        </p>

        <p className="text-xs text-red-500 mt-1 capitalize">
          {user?.role}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        <NavLink
          to={dashboardPath}
          className={linkClass}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* User Menu */}
        {user?.role === "user" && (
          <>
            <NavLink
              to="/donors"
              className={linkClass}
            >
              <Users size={20} />
              Find Donors
            </NavLink>

            <NavLink
              to="/requests"
              className={linkClass}
            >
              <Droplets size={20} />
              Blood Requests
            </NavLink>

            <NavLink
              to="/my-requests"
              className={linkClass}
            >
              <ClipboardList size={20} />
              My Requests
            </NavLink>

            <NavLink
              to="/donations"
              className={linkClass}
            >
              <HeartHandshake size={20} />
              My Donations
            </NavLink>

            <NavLink
              to="/profile"
              className={linkClass}
            >
              <User size={20} />
              Profile
            </NavLink>
          </>
        )}

        {/* Admin Menu */}
        {user?.role === "admin" && (
          <>
            <NavLink
              to="/admin/users"
              className={linkClass}
            >
              <Users size={20} />
              Manage Users
            </NavLink>

            <NavLink
              to="/admin/requests"
              className={linkClass}
            >
              <ClipboardList size={20} />
              Manage Requests
            </NavLink>
          </>
        )}

      </nav>

      {/* Logout */}
      <div className="p-4 border-t">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;