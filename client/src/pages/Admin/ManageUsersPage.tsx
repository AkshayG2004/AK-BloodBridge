import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getAllUsers,
  deleteUser,
} from "../../services/adminService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SectionTitle from "../../components/Cards/SectionTitle";
import Pagination from "../../components/Pagination/Pagination";

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
  const [total, setTotal] = useState(0);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [bloodFilter, setBloodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, bloodFilter, statusFilter, cityFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await getAllUsers({
        page,
        limit: pageSize,
        bloodGroup: bloodFilter,
        availabilityStatus: statusFilter,
        city: cityFilter,
      });

      setUsers(res.users);
      setTotal(res.total);
      setCities(["All", ...(res.cities ?? [])]);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setPage(1);
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

  if (loading && users.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-800 dark:text-gray-100">
        Loading users...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Users | AK BloodBridge</title>
      </Helmet>

      <div>


        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">

        {/* Left */}

        <SectionTitle
          title="Manage Users"
          subtitle="View and manage registered BloodBridge users."
        />

        {/* Right */}

        <div className="flex flex-wrap items-end gap-2">

            {/* Blood */}

            <div>

              <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                Blood
              </p>

              <div className="relative w-24">

                <select
                  value={bloodFilter}
                  onChange={(e) => handleFilterChange(setBloodFilter, e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
                >
                  <option value="All" className="dark:bg-gray-800 dark:text-gray-200">All</option>
                  <option value="A+" className="dark:bg-gray-800 dark:text-gray-200">A+</option>
                  <option value="A-" className="dark:bg-gray-800 dark:text-gray-200">A-</option>
                  <option value="B+" className="dark:bg-gray-800 dark:text-gray-200">B+</option>
                  <option value="B-" className="dark:bg-gray-800 dark:text-gray-200">B-</option>
                  <option value="AB+" className="dark:bg-gray-800 dark:text-gray-200">AB+</option>
                  <option value="AB-" className="dark:bg-gray-800 dark:text-gray-200">AB-</option>
                  <option value="O+" className="dark:bg-gray-800 dark:text-gray-200">O+</option>
                  <option value="O-" className="dark:bg-gray-800 dark:text-gray-200">O-</option>
                </select>

                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
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

              <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>

              <div className="relative w-32">

                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
                >
                  <option value="All" className="dark:bg-gray-800 dark:text-gray-200">All</option>
                  <option value="Available" className="dark:bg-gray-800 dark:text-gray-200">Available</option>
                  <option value="Busy" className="dark:bg-gray-800 dark:text-gray-200">Busy</option>
                  <option value="Unavailable" className="dark:bg-gray-800 dark:text-gray-200">Unavailable</option>
                </select>

                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
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

            <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              City
            </p>

            <div className="relative w-40">

              <select
                value={cityFilter}
                onChange={(e) => handleFilterChange(setCityFilter, e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="dark:bg-gray-800 dark:text-gray-200">
                    {city}
                  </option>
                ))}
              </select>

              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
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

            <div className="h-9 px-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">

              <span className="text-xs text-gray-500 dark:text-gray-400">
                Users
              </span>

              <span className="font-bold text-red-600 dark:text-red-400">
                {total}
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
                  setPage(1);
                }}
                className="h-9 px-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm hover:bg-red-100 dark:hover:bg-red-900 transition"
              >
                Reset
              </button>

            )}

          </div>

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-x-auto">

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

              {users.length === 0 ? (

                <tr>

                  <td
                    colSpan={9}
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                users.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >

                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                      {user.bloodBridgeId}
                    </td>

                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </td>

                    <td className="p-4 max-w-[240px] truncate text-gray-800 dark:text-gray-200">
                      {user.email}
                    </td>

                    <td className="p-4">

                      <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">

                        {user.bloodGroup || "-"}

                      </span>

                    </td>

                    <td className="p-4 truncate text-gray-800 dark:text-gray-200">
                      {user.city || "-"}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.availabilityStatus === "Available"
                            ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                            : user.availabilityStatus === "Busy"
                            ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {user.availabilityStatus}
                      </span>

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400"
                            : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>

                    </td>

                    <td className="p-4 text-center font-semibold text-gray-900 dark:text-gray-100">
                      {user.totalDonations}
                    </td>

                    <td className="p-4 text-center">

                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role === "admin"}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          user.role === "admin"
                            ? "bg-gray-300 dark:bg-gray-700 text-white cursor-not-allowed"
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

          <Pagination
            currentPage={page}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />

        </div>

      </div>
    </>
  );
}

export default ManageUsersPage;