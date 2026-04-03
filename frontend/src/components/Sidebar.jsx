import { cn } from "../lib/utils";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ links }) => {
  const location = useLocation();

  return (
    <aside className="w-64 fixed h-full border-r border-white/10 bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Portal
        </h2>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white relative group",
                isActive ? "text-white" : "hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-indigo-500/20 rounded-lg border border-indigo-500/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
