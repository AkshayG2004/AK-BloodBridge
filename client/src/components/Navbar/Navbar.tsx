import { useAuth } from "../../context/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 16) return "Good afternoon";
  return "Good evening";
}

function Navbar() {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 px-8 py-5 mb-8 flex items-center justify-between transition-colors">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Bridging Hope, Saving Lives.
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Every drop creates hope.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {getGreeting()}
          </p>
        </div>

        <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-semibold text-sm shrink-0">
            {initials || "?"}
          </div>

          <div className="text-right">
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