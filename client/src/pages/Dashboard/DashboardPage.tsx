import { useEffect, useState } from "react";

import {
  Heart,
  ClipboardList,
  Users,
  Droplets,
  MapPin,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Trophy,
  Lightbulb,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getDashboardStats } from "../../services/dashboardService";

import StatCard from "../../components/Cards/StatCard";

const AVAILABILITY_COLORS: Record<string, string> = {
  Available: "#16a34a",
  Busy: "#f97316",
  Unavailable: "#9ca3af",
};

const AVAILABILITY_STYLES: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  Available: {
    dot: "🟢",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
    label: "You can currently receive donation requests.",
  },
  Busy: {
    dot: "🟠",
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
    label: "You won't appear in donor searches right now.",
  },
  Unavailable: {
    dot: "⚪",
    text: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    label: "You won't appear in donor searches.",
  },
};


function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <span className="text-red-600">{icon}</span>
      {title}
    </h2>
  );
}

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  const [fact, setFact] = useState("");

  useEffect(() => {
    const loadFact = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/facts/random");
        const data = await response.json();

        if (data.success) {
          setFact(data.fact.text);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadFact();

    const interval = setInterval(loadFact, 22000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  const stats = data?.stats;

  const availabilityInfo =
    AVAILABILITY_STYLES[stats?.availabilityStatus ?? ""] ??
    AVAILABILITY_STYLES.Unavailable;

  const hasDonatedBefore = (stats?.myDonations ?? 0) > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4 flex-wrap">

        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {stats?.userName}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome to BloodBridge.
          </p>

        </div>

        {/* Compact availability badge, top-right */}
        <div
          className={`rounded-xl px-4 py-2 text-right ${availabilityInfo.bg}`}
        >
          <p className={`text-sm font-bold ${availabilityInfo.text}`}>
            {availabilityInfo.dot} {stats?.availabilityStatus?.toUpperCase() ?? "--"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-[180px]">
            {availabilityInfo.label}
          </p>
        </div>

      </div>

      {/* ================= MY IMPACT ================= */}

      <div>
        <h2 className="text-xl font-bold mb-4">My Impact</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <StatCard
            title="Donations Made"
            value={stats?.myDonations ?? 0}
            icon={<Heart size={28} />}
          />

          <StatCard
            title="Requests Raised"
            value={stats?.myRequests ?? 0}
            icon={<ClipboardList size={28} />}
          />

          {hasDonatedBefore && (
            <StatCard
              title="Last Donation"
              value={
                stats?.lastDonationDate
                  ? new Date(stats.lastDonationDate).toLocaleDateString()
                  : "--"
              }
              icon={<Clock size={28} />}
            />
          )}

        </div>
      </div>

      {/* ================= MY BLOOD INFO & TOP CITIES ================= */}

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">

        {/* Blood Information */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 h-full flex flex-col">

          <SectionHeading icon={<Droplets size={20} />} title="My Information" />

          <div className="space-y-5 flex-1 flex flex-col justify-center">

            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-500 dark:text-gray-400">Blood Group</span>
              <span className="font-semibold">{stats?.bloodGroup ?? "--"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">City</span>
              <span className="font-semibold">{stats?.city ?? "--"}</span>
            </div>

          </div>

        </div>

        {/* Top Active Cities */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 h-full flex flex-col">

          <SectionHeading icon={<Trophy size={20} />} title="Top Active Cities" />

          {stats?.cityRanking?.length ? (
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {stats.cityRanking.map((c: any, index: number) => (
                <div
                  key={c.city}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold text-sm shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium">{c.city}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">{c.count} donors</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">No city data available yet.</p>
            </div>
          )}

        </div>

      </div>

      {/* ================= BLOODBRIDGE NETWORK ================= */}

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 h-full flex flex-col">

          <SectionHeading icon={<Users size={20} />} title="BloodBridge Network" />

          <div className="grid grid-cols-2 gap-5 flex-1 content-center">

            <StatCard
              title="Registered Donors"
              value={stats?.totalDonors ?? 0}
              icon={<Users size={26} />}
            />

            <StatCard
              title="Your City"
              value={stats?.registeredCityDonors ?? 0}
              icon={<MapPin size={26} />}
            />

            <StatCard
              title="Available"
              value={stats?.availableDonors ?? 0}
              icon={<Heart size={26} />}
            />

            <StatCard
              title="Available In City"
              value={stats?.availableCityDonors ?? 0}
              icon={<MapPin size={26} />}
            />

          </div>

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 h-full flex flex-col">

          <SectionHeading icon={<BarChart3 size={20} />} title="Overall Statistics" />

          <div className="space-y-5 flex-1 flex flex-col justify-center">

            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-500 dark:text-gray-400">Registered Donors</span>
              <span className="font-semibold">{stats?.totalDonors}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-500 dark:text-gray-400">Available Donors</span>
              <span className="font-semibold">{stats?.availableDonors}</span>
            </div>

            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-gray-500 dark:text-gray-400">Open Requests</span>
              <span className="font-semibold">{stats?.openRequests}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Completed Donations</span>
              <span className="font-semibold">{stats?.completedDonations}</span>
            </div>

          </div>

        </div>

      </div>

      {/* ================= DISTRIBUTION CHARTS ================= */}

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 h-full flex flex-col">

          <SectionHeading icon={<BarChart3 size={20} />} title="Blood Group Distribution" />

          {stats?.bloodGroupDistribution?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.bloodGroupDistribution}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="group" width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">No donor data available yet.</p>
            </div>
          )}

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 h-full flex flex-col">

          <SectionHeading icon={<PieChartIcon size={20} />} title="Availability Distribution" />

          {stats?.availabilityDistribution?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.availabilityDistribution}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {stats.availabilityDistribution.map((entry: any) => (
                    <Cell
                      key={entry.status}
                      fill={AVAILABILITY_COLORS[entry.status] ?? "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">No availability data available yet.</p>
            </div>
          )}

        </div>

      </div>

      {/* ================= DID YOU KNOW — FACTS & TIPS ================= */}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">

        <SectionHeading icon={<Lightbulb size={20} />} title="Awareness Corner" />

        <div className="bg-red-50 dark:bg-red-950 rounded-xl p-6 min-h-[80px] flex items-center">
          <p
            className="text-gray-700 dark:text-gray-200 text-base leading-relaxed animate-[fadeIn_0.5s_ease-in-out]"
          >
            {fact}
          </p>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;