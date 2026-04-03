import { Card, CardContent } from "./ui/Card";
import { cn } from "../lib/utils";

const StatsCard = ({ title, value, icon: Icon, description, className }) => {
  return (
    <Card className={cn("relative overflow-hidden group", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-slate-400">
            {title}
          </h3>
          {Icon && <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />}
        </div>
        <div className="mt-2">
          <div className="text-3xl font-bold text-slate-50">{value}</div>
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { StatsCard };
