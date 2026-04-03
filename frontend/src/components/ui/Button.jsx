import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const Button = ({ className, variant = "default", size = "default", asChild = false, ...props }) => {
  const Comp = asChild ? motion.span : motion.button;

  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
    outline: "border border-white/20 bg-transparent hover:bg-white/10",
    secondary: "bg-slate-800 text-slate-50 hover:bg-slate-700 border border-white/10",
    ghost: "hover:bg-white/10 hover:text-slate-50",
    link: "text-indigo-400 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8 text-md",
    icon: "h-10 w-10",
  };

  return (
    <Comp
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export { Button };
