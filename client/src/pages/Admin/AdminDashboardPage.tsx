import { useEffect, useState } from "react";
import {
  Users,
  ClipboardList,
  HeartHandshake,
  UserCheck,
  AlertTriangle,
  RefreshCw,
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
  LabelList,
} from "recharts";

import { getDashboardStats } from "../../services/adminService";
import SectionTitle from "../../components/Cards/SectionTitle";
import { useTheme } from "../../context/ThemeContext";

const STATUS_COLORS = {
  Open: "#ef4444",
  Accepted: "#f59e0b",
  Completed: "#22c55e",
  Cancelled: "#6b7280",
};

interface DashboardStats {
  totalUsers: number;
  totalRequests: number;
  totalDonations: number;
  availableDonors: number;
  criticalRequests: number;

  openRequests: number;
  acceptedRequests: number;
  completedRequests: number;
  cancelledRequests: number;

  bloodGroupStats: {
    _id: string;
    count: number;
  }[];

  cityStats: {
    _id: string;
    count: number;
  }[];

  criticalRequestList: {
    patientName: string;
    bloodGroup: string;
    hospitalCity: string;
    requiredBefore: string;
  }[];
}

function AdminDashboardPage() {
  const { theme } = useTheme();

  const [stats, setStats] = useState<DashboardStats>({
  totalUsers: 0,
  totalRequests: 0,
  totalDonations: 0,
  availableDonors: 0,
  criticalRequests: 0,

  openRequests: 0,
  acceptedRequests: 0,
  completedRequests: 0,
  cancelledRequests: 0,

  bloodGroupStats: [],
  cityStats: [],
  criticalRequestList: [],
});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async (isRefresh = false) => {
    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await getDashboardStats();

      setStats(res.stats);
      setLastUpdated(new Date());

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  const bloodData = stats.bloodGroupStats.map((item) => ({
    group: item._id,
    donors: item.count,
  }));

  const cityData = stats.cityStats.map((city) => ({
    city: city._id,
    users: city.count,
  }));

  // Theme-aware colors for chart elements (SVG text/lines don't inherit
  // Tailwind's dark: classes, so they need explicit values based on theme)
  const isDark = theme === "dark";
  const tickColor = isDark ? "#9ca3af" : "#6b7280";
  const gridStroke = isDark ? "#374151" : "#f1f5f9";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const tooltipText = isDark ? "#f3f4f6" : "#111827";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl text-gray-800 dark:text-gray-100">
        Loading Dashboard...
      </div>
    );
  }

    const requestData = [
      {
        name: "Open",
        value: stats.openRequests,
      },
      {
        name: "Accepted",
        value: stats.acceptedRequests,
      },
      {
        name: "Completed",
        value: stats.completedRequests,
      },
      {
        name: "Cancelled",
        value: stats.cancelledRequests,
      },
    ].filter(item => item.value > 0);

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <SectionTitle
            title="Admin Dashboard"
            subtitle="Monitor users, blood requests and donations."
          />

          <p className="text-xs text-gray-400 dark:text-gray-500 -mt-5">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>

        </div>

        <button
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="
            flex items-center gap-2
            bg-red-600
            text-white
            px-5
            py-2.5
            rounded-xl
            hover:bg-red-700
            disabled:opacity-60
            transition
          "
        >

          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}

        </button>

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

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

          <h2 className="font-semibold text-lg mb-5 text-gray-900 dark:text-gray-100">
            Blood Group Availability
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={bloodData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
              barCategoryGap={40}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridStroke}
              />

              <XAxis
                dataKey="group"
                tick={{ fontSize: 13, fill: tickColor }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: tickColor }}
                domain={[0, "dataMax + 1"]}
              />

              <Tooltip
                cursor={false}
                labelFormatter={(label) => `Blood Group: ${label}`}
                formatter={(value) => [`${Number(value)}`, "Donors"]}
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                }}
              />

              <Bar
                dataKey="donors"
                fill="#dc2626"
                radius={[8, 8, 0, 0]}
                barSize={bloodData.length <= 2 ? 30 : 40}
              >
                <LabelList
                    dataKey="donors"
                    position="top"
                    fill={tickColor}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

          <h2 className="font-semibold text-lg mb-5 text-gray-900 dark:text-gray-100">
            Request Status
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>

              <Pie
                data={requestData}
                dataKey="value"
                outerRadius={105}
                innerRadius={55}
                paddingAngle={0}
              >
                {requestData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${tooltipBorder}`,
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-5 grid grid-cols-2 gap-3">

            {requestData.map((item) => (

              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-3"
              >

                <div className="flex items-center gap-3">

                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[item.name as keyof typeof STATUS_COLORS],
                    }}
                  />

                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {item.name}
                  </span>

                </div>

                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {item.value}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Tables */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow">

        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">

          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Critical Blood Requests
          </h2>

        </div>

        <table className="w-full">

          <thead className="text-left bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">

            <tr>

              <th className="p-4">Patient</th>

              <th className="p-4">Blood</th>

              <th className="p-4">City</th>

              <th className="p-4"> Deadline </th>

              <th className="p-4"> Status </th>

            </tr>

          </thead>

          <tbody>

            {stats.criticalRequestList.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No critical requests.
                </td>
              </tr>

            ) : (

              stats.criticalRequestList.map((request, index) => {

                const deadline = new Date(request.requiredBefore);

                const today = new Date();

                deadline.setHours(0,0,0,0);
                today.setHours(0,0,0,0);

                const daysLeft = Math.ceil(
                  (deadline.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
                );

                return (

                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >

                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                      {request.patientName}
                    </td>

                    <td className="p-4">

                      <span className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold px-3 py-1 rounded-full text-sm">

                        {request.bloodGroup}

                      </span>

                    </td>

                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {request.hospitalCity}
                    </td>

                    <td className="p-4 text-gray-700 dark:text-gray-300">

                      {deadline.toLocaleDateString()}

                    </td>

                    <td className="p-4">

                      {daysLeft < 0 ? (

                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          Overdue
                        </span>

                      ) : daysLeft === 0 ? (

                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          Today
                        </span>

                      ) : daysLeft === 1 ? (

                        <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                          Tomorrow
                        </span>

                      ) : (

                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {daysLeft} Days
                        </span>

                      )}

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

        <h2 className="font-semibold text-lg mb-5 text-gray-900 dark:text-gray-100">
          Top Cities by Registered Users
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <BarChart
            data={cityData}
            layout="vertical"
            margin={{
              top: 10,
              right: 35,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke={gridStroke}
            />

            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: tickColor }}
            />

            <YAxis
              type="category"
              dataKey="city"
              width={80}
              tick={{ fill: tickColor }}
            />

            <Tooltip
              cursor={false}
              formatter={(value) => [
                Number(value),
                "Users",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${tooltipBorder}`,
                backgroundColor: tooltipBg,
                color: tooltipText,
              }}
            />

            <Bar
              dataKey="users"
              fill="#dc2626"
              radius={[0, 8, 8, 0]}
              maxBarSize={28}
            >

              <LabelList
                dataKey="users"
                position="right"
                fill={tickColor}
              />

            </Bar>

          </BarChart>

        </ResponsiveContainer>

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
    blue: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    red: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
    green: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
    emerald: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
    orange: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  };

  return (

    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 hover:shadow-lg transition">

      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-gray-500 dark:text-gray-400 mt-4">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2 text-gray-900 dark:text-gray-100">
        {value}
      </h2>

    </div>

  );
}

export default AdminDashboardPage;