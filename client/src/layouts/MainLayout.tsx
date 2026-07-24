import { useState } from "react";

import {
  LayoutDashboard,
  Droplets,
  ClipboardList,
  Users,
  User,
  LogOut,
  PlusCircle,
  HeartHandshake,
  Sun,
  Moon,
  X,
  Mail,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProfile } from "../services/profileService";

function MainLayout() {
  const {
    logout,
    user,
    refreshUser,
  } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {

    if (!user || user.role === "admin") return;

    const loadProfile = async () => {

      try {

        const res = await getProfile();

        refreshUser(res.user);

        if (
          !res.user.isProfileComplete &&
          location.pathname !== "/profile"
        ) {
          navigate("/profile", { replace: true });
        }

      } catch (error) {

        console.error(error);

      }

    };

    loadProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const dashboardMenu = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path:
        user?.role === "admin"
          ? "/admin/dashboard"
          : "/dashboard",
    },
  ];

  const requestMenu = [
    {
      title: "Blood Requests",
      icon: <Droplets size={20} />,
      path: "/requests",
    },
    {
      title: "Create Request",
      icon: <PlusCircle size={20} />,
      path: "/requests/create",
    },
    {
      title: "My Requests",
      icon: <ClipboardList size={20} />,
      path: "/my-requests",
    },
    {
      title: "My Donations",
      icon: <HeartHandshake size={20} />,
      path: "/donations",
    },
  ];

  const accountMenu = [
    {
      title: "Profile",
      icon: <User size={20} />,
      path: "/profile",
    },
  ];

  const supportMenu = [
    {
      title: "Contact",
      icon: <Mail size={20} />,
      path: "/contact",
    },
  ];

  const adminMenu = [
    {
      title: "Manage Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    {
      title: "Manage Requests",
      icon: <ClipboardList size={20} />,
      path: "/admin/requests",
    },
  ];

  const renderMenu = (menu: typeof dashboardMenu) =>
    menu.map((item) => (
      <NavLink
      key={item.path}
      to={item.path}
      onClick={(e) => {
        if (
          user?.role !== "admin" &&
          !user?.isProfileComplete &&
          item.path !== "/profile"
        ) {
          e.preventDefault();
        }
      }}
        end={
          item.path === "/requests" ||
          item.path === "/dashboard" ||
          item.path === "/admin/dashboard" ||
          item.path === "/profile" ||
          item.path === "/my-requests" ||
          item.path === "/donations" ||
          item.path === "/admin/users" ||
          item.path === "/admin/requests"
        }
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            user?.role !== "admin" &&
            !user?.isProfileComplete &&
            item.path !== "/profile"
              ? "opacity-50 cursor-not-allowed"
              : isActive
              ? "bg-white text-red-700 font-semibold shadow-md dark:bg-gray-100 dark:text-red-700"
              : "hover:bg-red-600 dark:hover:bg-red-950"
          }`
        }
      >
        {item.icon}
        {item.title}
      </NavLink>
    ));

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden transition-colors">

      {/* Mobile overlay — only rendered below lg, only when drawer is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 h-screen bg-gradient-to-b from-red-700 to-red-900 dark:from-red-950 dark:to-black text-white flex flex-col shadow-xl flex-shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="p-8 border-b border-red-500 dark:border-red-900">

          <div className="flex items-center justify-between">

            <h1 className="text-3xl font-bold">
              BloodBridge
            </h1>

            {/* Close button — mobile drawer only */}
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <X size={22} />
            </button>

          </div>

          <p className="text-red-200 dark:text-red-300 mt-2">
            Donate Blood. Save Lives.
          </p>

        </div>

        <nav className="flex-1 overflow-y-auto p-5">

          {/* Dashboard */}

          <div className="space-y-2">

            {renderMenu(dashboardMenu)}

          </div>

          {user?.role === "admin" ? (

  <div className="mt-8">

    <p className="text-xs uppercase tracking-widest text-red-300 dark:text-red-400 mb-3 px-2">
      Administration
    </p>

    <div className="space-y-2">

      {renderMenu(adminMenu)}

    </div>

  </div>

) : (

  <>

    {/* Requests */}

        <div className="mt-8">

          <p className="text-xs uppercase tracking-widest text-red-300 dark:text-red-400 mb-3 px-2">
            Requests
          </p>

          <div className="space-y-2">

            {renderMenu(requestMenu)}

          </div>

        </div>

        {/* Account */}

        <div className="mt-8">

          <p className="text-xs uppercase tracking-widest text-red-300 dark:text-red-400 mb-3 px-2">
            Account
          </p>

          <div className="space-y-2">

            {renderMenu(accountMenu)}

          </div>

        </div>

        {/* Support */}

          <div className="mt-8">

            <p className="text-xs uppercase tracking-widest text-red-300 dark:text-red-400 mb-3 px-2">
              Support
            </p>

            <div className="space-y-2">

              {renderMenu(supportMenu)}

            </div>

          </div>

      </>

    )}

        </nav>

        {/* User */}

        <div className="border-t border-red-500 dark:border-red-900 p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h3 className="font-bold text-lg">
                {user?.name}
              </h3>

              <p className="text-red-200 dark:text-red-300 text-sm">
                {user?.bloodGroup} • {user?.role}
              </p>

            </div>

            <div className="flex flex-col items-center gap-1.5">

              <span className="text-[10px] uppercase tracking-wide text-red-200 dark:text-red-300">
                Theme
              </span>

              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/25 hover:border-white/50 active:scale-95 transition-all duration-200 shadow-sm"
              >
                {theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>

            </div>

          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center justify-center gap-2 bg-white text-red-700 rounded-xl w-full py-3 font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}

      <main className="flex-1 h-screen overflow-y-auto bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <div className="p-4 sm:p-6 lg:p-8">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default MainLayout;