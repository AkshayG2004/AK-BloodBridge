import { useEffect, useState } from "react";
import {
  Users,
  ClipboardList,
  HeartHandshake,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getDashboardStats } from "../../services/adminService";

interface DashboardStats {
  totalUsers: number;
  totalRequests: number;
  totalDonations: number;
  availableDonors: number;
  criticalRequests: number;
}

const bloodData = [
  { group: "A+", donors: 18 },
  { group: "A-", donors: 5 },
  { group: "B+", donors: 14 },
  { group: "B-", donors: 4 },
  { group: "AB+", donors: 6 },
  { group: "AB-", donors: 2 },
  { group: "O+", donors: 24 },
  { group: "O-", donors: 3 },
];

const requestData = [
  { name: "Pending", value: 12 },
  { name: "Approved", value: 8 },
  { name: "Completed", value: 23 },
];

const colors = ["#dc2626", "#2563eb", "#16a34a"];

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRequests: 0,
    totalDonations: 0,
    availableDonors: 0,
    criticalRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Monitor users, blood requests and donations.
        </p>

      </div>

      {/* Top Cards */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={28} />}
          color="blue"
        />

        <StatCard
          title="Blood Requests"
          value={stats.totalRequests}
          icon={<ClipboardList size={28} />}
          color="red"
        />

        <StatCard
          title="Total Donations"
          value={stats.totalDonations}
          icon={<HeartHandshake size={28} />}
          color="green"
        />

        <StatCard
          title="Available Donors"
          value={stats.availableDonors}
          icon={<UserCheck size={28} />}
          color="emerald"
        />

        <StatCard
          title="Critical Requests"
          value={stats.criticalRequests}
          icon={<AlertTriangle size={28} />}
          color="orange"
        />

      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="font-semibold text-lg mb-5">
            Blood Group Availability
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={bloodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="donors" fill="#dc2626" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="font-semibold text-lg mb-5">
            Request Status
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>

              <Pie
                data={requestData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {requestData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={colors[index]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Tables */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow">

          <div className="px-6 py-4 border-b">

            <h2 className="font-semibold">
              Recent Users
            </h2>

          </div>

          <table className="w-full">

            <tbody>

              <tr className="border-b">
                <td className="p-4">BB00041</td>
                <td>Arun Kumar</td>
                <td>O+</td>
              </tr>

              <tr className="border-b">
                <td className="p-4">BB00042</td>
                <td>Priya</td>
                <td>A+</td>
              </tr>

              <tr>
                <td className="p-4">BB00043</td>
                <td>Rahul</td>
                <td>B+</td>
              </tr>

            </tbody>

          </table>

        </div>

        <div className="bg-white rounded-2xl shadow">

          <div className="px-6 py-4 border-b">

            <h2 className="font-semibold">
              Recent Requests
            </h2>

          </div>

          <table className="w-full">

            <tbody>

              <tr className="border-b">
                <td className="p-4">O+</td>
                <td>Chennai</td>
                <td className="text-red-600">Pending</td>
              </tr>

              <tr className="border-b">
                <td className="p-4">A-</td>
                <td>Madurai</td>
                <td className="text-blue-600">Approved</td>
              </tr>

              <tr>
                <td className="p-4">B+</td>
                <td>Salem</td>
                <td className="text-green-600">Completed</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color:
    | "blue"
    | "red"
    | "green"
    | "emerald"
    | "orange";
}

function StatCard({ title, value, icon, color }: CardProps) {

  const colors = {
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    emerald: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (

    <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">

      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-gray-500 mt-4">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {value}
      </h2>

    </div>

  );
}

export default AdminDashboardPage;