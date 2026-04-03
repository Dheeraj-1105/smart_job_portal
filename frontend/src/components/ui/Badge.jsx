import { cn } from "../../lib/utils";

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default:
      "border-transparent bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    secondary:
      "border-transparent bg-slate-800 text-slate-300 border border-white/10",
    destructive:
      "border-transparent bg-red-500/20 text-red-400 border border-red-500/30",
    outline: "text-slate-300 border-white/20",
    success:
      "border-transparent bg-green-500/20 text-green-400 border border-green-500/30",
    warning:
      "border-transparent bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
