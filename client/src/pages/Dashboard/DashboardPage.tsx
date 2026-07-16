import {
  Heart,
  ClipboardList,
  Users,
  Droplets,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "../../services/dashboardService";

import StatCard from "../../components/Cards/StatCard";

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-semibold text-gray-500">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div>

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Here's an overview of your AK BloodBridge activity.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

        <StatCard
          title="My Donations"
          value={stats?.myDonations ?? 0}
          icon={<Heart size={30} />}
        />

        <StatCard
          title="My Requests"
          value={stats?.myRequests ?? 0}
          icon={<ClipboardList size={30} />}
        />

        <StatCard
          title="Open Requests"
          value={stats?.openRequests ?? 0}
          icon={<Droplets size={30} />}
        />

        <StatCard
          title="Available Donors"
          value={stats?.availableDonors ?? 0}
          icon={<Users size={30} />}
        />

      </div>

      {/* Recent Activity */}

      <div className="mt-10 bg-white rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-4">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          Recent blood requests, donations and notifications will appear here.
        </p>

      </div>

    </div>
  );
}

export default DashboardPage;