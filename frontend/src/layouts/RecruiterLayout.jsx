import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { LayoutDashboard, PlusCircle, Users, Trophy, BarChart3 } from "lucide-react";

export default function RecruiterLayout() {
  const links = [
    { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/recruiter/create-job", label: "Create Job", icon: PlusCircle },
    // Candidates and Ranked pages are dynamic based on jobId, so they might not be in sidebar directly
    // Let's add Analytics
    { href: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <Sidebar links={links} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 relative">
          <div className="absolute top-0 right-0 w-full h-96 bg-purple-500/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
