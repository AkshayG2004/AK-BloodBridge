import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
} from "../../services/adminService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface User {
  _id: string;
  bloodBridgeId: string;
  name: string;
  email: string;

  bloodGroup?: string;
  city?: string;

  role: string;

  availabilityStatus:
    | "Available"
    | "Busy"
    | "Unavailable";

  totalDonations: number;
}

function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [bloodFilter, setBloodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async (id: string) => {

  const result = await Swal.fire({
    title: "Delete User?",
    text: "This user account will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });

  if (!result.isConfirmed) return;

  try {

    await deleteUser(id);

    toast.success("User deleted successfully.");

    loadUsers();

  } catch (err: any) {

    toast.error(
      err.response?.data?.message ||
      "Failed to delete user."
    );

  }

};

  const cities = [
    "All",
    ...Array.from(
      new Set(
        users
          .map((user) => user.city)
          .filter(Boolean)
      )
    ).sort(),
  ];

  const filteredUsers = users
  .filter((user) => {
    const bloodMatch =
      bloodFilter === "All" ||
      user.bloodGroup === bloodFilter;

    const statusMatch =
    statusFilter === "All" ||
    user.availabilityStatus === statusFilter;

  const cityMatch =
    cityFilter === "All" ||
    user.city === cityFilter;

  return bloodMatch && statusMatch && cityMatch;
  })
  .sort((a, b) => {
    const idA = Number(a.bloodBridgeId.replace(/\D/g, ""));
    const idB = Number(b.bloodBridgeId.replace(/\D/g, ""));

    return idA - idB;
  });

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading users...
      </div>
    );
  }

  return (
    <div>


    <div className="flex items-end justify-between mb-5">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold">
            Manage Users
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage registered BloodBridge users.
          </p>

        </div>

        {/* Right */}

        <div className="flex items-end gap-2">

          {/* Blood */}

          <div>

            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Blood
            </p>

            <div className="relative w-24">

              <select
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="All">All</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>

            </div>

          </div>

          {/* Status */}

          <div>

            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Status
            </p>

            <div className="relative w-32">

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>

            </div>

          </div>

          <div>

          <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
            City
          </p>

          <div className="relative w-40">

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

          {/* Total */}

          <div className="h-9 px-4 rounded-lg border border-gray-200 flex items-center gap-2">

            <span className="text-xs text-gray-500">
              Users
            </span>

            <span className="font-bold text-red-600">
              {filteredUsers.length}
            </span>

          </div>

          {/* Reset */}

          {(
              bloodFilter !== "All" ||
              statusFilter !== "All" ||
              cityFilter !== "All"
            ) && (

            <button
              onClick={() => {
                setBloodFilter("All");
                setStatusFilter("All");
                setCityFilter("All");
              }}
              className="h-9 px-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition"
            >
              Reset
            </button>

          )}

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-red-600 text-white">

            <tr>

              <th className="p-4 text-left">
                BloodBridge ID
              </th>

              <th className="w-48 p-4 text-left">
                Name
              </th>

              <th className="w-64 p-4 text-left">
                Email
              </th>

              <th className="w-28 p-4 text-left">
                Blood Group
              </th>

              <th className="w-40 p-4 text-left">
                City
              </th>

              <th className="p-4 text-left">
                Availability
              </th>

              <th className="w-28 p-4 text-left">
                Role
              </th>

              <th className="w-28 p-4 text-center">
                Donations
              </th>

              <th className="w-36 p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="text-center py-12 text-gray-500"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {user.bloodBridgeId}
                  </td>

                  <td className="p-4 font-medium">
                    {user.name}
                  </td>

                  <td className="p-4 max-w-[240px] truncate">
                    {user.email}
                  </td>

                  <td className="p-4">

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">

                      {user.bloodGroup || "-"}

                    </span>

                  </td>

                  <td className="p-4 truncate">
                    {user.city || "-"}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.availabilityStatus === "Available"
                          ? "bg-green-100 text-green-700"
                          : user.availabilityStatus === "Busy"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.availabilityStatus}
                    </span>

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>

                  </td>

                  <td className="p-4 text-center font-semibold">
                    {user.totalDonations}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === "admin"}
                      className={`px-4 py-2 rounded-xl font-medium transition ${
                        user.role === "admin"
                          ? "bg-gray-300 text-white cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Protected"
                        : "Delete"}
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ManageUsersPage;