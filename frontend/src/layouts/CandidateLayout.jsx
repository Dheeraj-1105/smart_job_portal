import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { LayoutDashboard, FileText, Sparkles, Briefcase, FileCheck } from "lucide-react";

export default function CandidateLayout() {
  const links = [
    { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/candidate/upload-resume", label: "Upload Resume", icon: FileText },
    { href: "/candidate/skills", label: "Extracted Skills", icon: Sparkles },
    { href: "/candidate/jobs", label: "Browse Jobs", icon: Briefcase },
    { href: "/candidate/applications", label: "My Applications", icon: FileCheck },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <Sidebar links={links} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-indigo-500/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
