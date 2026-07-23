import {
  LayoutDashboard,
  Users,
  Droplets,
  ClipboardList,
  HeartHandshake,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Sidebar() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard";

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900 ${
      active
        ? "bg-red-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400"
    }`;

  const sectionLabelClass =
    "px-4 mt-5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500";

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-lg flex flex-col h-screen transition-colors">

      {/* Logo & User */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">
            BloodBridge
          </h1>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-3 mt-5">

          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-semibold text-sm shrink-0">
            {initials || "?"}
          </div>

          <div className="min-w-0">
            <p className="text-gray-800 dark:text-gray-100 text-sm font-medium truncate">
              {user?.name}
            </p>
            <span className="inline-block mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto">

        <p className={sectionLabelClass}>Overview</p>

        <div className="space-y-1">
          <NavLink
            to={dashboardPath}
            end
            className={({ isActive }) => linkClass(isActive)}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>
        </div>

        {user?.role === "user" && (
          <>

            <p className={sectionLabelClass}>Donors & Requests</p>

            <div className="space-y-1">

              <NavLink
                to="/donors"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <Users size={19} />
                Find Donors
              </NavLink>

              <NavLink
                to="/requests"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <Droplets size={19} />
                Blood Requests
              </NavLink>

              <NavLink
                to="/requests/create"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <ClipboardList size={19} />
                Create Request
              </NavLink>

              <NavLink
                to="/my-requests"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <ClipboardList size={19} />
                My Requests
              </NavLink>

              <NavLink
                to="/donations"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <HeartHandshake size={19} />
                My Donations
              </NavLink>

            </div>

            <p className={sectionLabelClass}>Account</p>

            <div className="space-y-1">
              <NavLink
                to="/profile"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <User size={19} />
                Profile
              </NavLink>
            </div>

          </>
        )}

        {user?.role === "admin" && (
          <>

            <p className={sectionLabelClass}>Administration</p>

            <div className="space-y-1">

              <NavLink
                to="/admin/users"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <Users size={19} />
                Manage Users
              </NavLink>

              <NavLink
                to="/admin/requests"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                <ClipboardList size={19} />
                Manage Requests
              </NavLink>

            </div>

          </>
        )}

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900"
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;