import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between">
        <div className="md:hidden">
           <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Portal
          </h2>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-300">
            {user?.name}
          </span>
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
