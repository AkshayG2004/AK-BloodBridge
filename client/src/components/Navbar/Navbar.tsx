import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white rounded-2xl shadow-sm px-8 py-5 mb-8 flex items-center justify-between">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Bridging Hope, Saving Lives.
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Every drop creates hope.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        <button className="relative bg-gray-100 hover:bg-red-50 transition p-3 rounded-xl">
          <Bell size={20} />
        </button>

        <div className="h-10 w-px bg-gray-200"></div>

        <div className="text-right">
          <h3 className="font-semibold text-gray-800">
            {user?.name}
          </h3>

          <p className="text-sm text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>

      </div>

    </header>
  );
}

export default Navbar;