import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 16) return "Good afternoon";
  return "Good evening";
}

interface NavbarProps {
  onMenuClick?: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 px-4 sm:px-8 py-4 sm:py-5 mb-6 sm:mb-8 flex items-center justify-between gap-3 transition-colors">

      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden shrink-0 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:hidden mb-0.5">
            {getGreeting()}
          </p>

          <h1 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight whitespace-normal sm:truncate">
            Bridging Hope, Saving Lives.
          </h1>

          <p className="hidden sm:block text-gray-500 dark:text-gray-400 text-sm mt-1">
            Every drop creates hope.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-5 shrink-0">

        <div className="text-right hidden md:block">
          <p className="text-s text-gray-400 dark:text-gray-500">
            {getGreeting()}
          </p>
        </div>

        <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-semibold text-sm shrink-0">
            {initials || "?"}
          </div>

          <div className="text-right hidden sm:block">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              {user?.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;