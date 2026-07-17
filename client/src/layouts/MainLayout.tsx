import {
  LayoutDashboard,
  Droplets,
  ClipboardList,
  Users,
  User,
  LogOut,
  PlusCircle,
  HeartHandshake,
} from "lucide-react";

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

  const location = useLocation();
  const navigate = useNavigate();

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

  const communityMenu = [
    {
      title: "Donors",
      icon: <Users size={20} />,
      path: "/donors",
    },
  ];

  const accountMenu = [
    {
      title: "Profile",
      icon: <User size={20} />,
      path: "/profile",
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
          item.path === "/donors" ||
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
              ? "bg-white text-red-700 font-semibold shadow-md"
              : "hover:bg-red-600"
          }`
        }
      >
        {item.icon}
        {item.title}
      </NavLink>
    ));

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}

      <aside className="w-72 h-screen bg-gradient-to-b from-red-700 to-red-900 text-white flex flex-col shadow-xl flex-shrink-0">

        <div className="p-8 border-b border-red-500">

          <h1 className="text-3xl font-bold">
            AK BloodBridge
          </h1>

          <p className="text-red-200 mt-2">
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

    <p className="text-xs uppercase tracking-widest text-red-300 mb-3 px-2">
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

          <p className="text-xs uppercase tracking-widest text-red-300 mb-3 px-2">
            Requests
          </p>

          <div className="space-y-2">

            {renderMenu(requestMenu)}

          </div>

        </div>

        {/* Community */}

        <div className="mt-8">

          <p className="text-xs uppercase tracking-widest text-red-300 mb-3 px-2">
            Community
          </p>

          <div className="space-y-2">

            {renderMenu(communityMenu)}

          </div>

        </div>

        {/* Account */}

        <div className="mt-8">

          <p className="text-xs uppercase tracking-widest text-red-300 mb-3 px-2">
            Account
          </p>

          <div className="space-y-2">

            {renderMenu(accountMenu)}

          </div>

        </div>

      </>

    )}

        </nav>

        {/* User */}

        <div className="border-t border-red-500 p-6">

          <div className="mb-5">

            <h3 className="font-bold text-lg">
              {user?.name}
            </h3>

            <p className="text-red-200 text-sm">
              {user?.bloodGroup} • {user?.role}
            </p>

          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center justify-center gap-2 bg-white text-red-700 rounded-xl w-full py-3 font-semibold hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}

      <main className="flex-1 h-screen overflow-y-auto bg-gray-100">
        <div className="p-8">
          <Navbar />
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default MainLayout;