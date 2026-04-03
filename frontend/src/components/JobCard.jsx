import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Briefcase, MapPin } from "lucide-react";

export const JobCard = ({ job, onApply, applied }) => {
  return (
    <Card className="flex flex-col h-full hover:border-indigo-500/30 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="line-clamp-1">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Briefcase className="w-4 h-4" />
              <span>{job.experienceRequired} years exp.</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-slate-300 line-clamp-3 mb-4">{job.description}</p>
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills?.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
          {job.requiredSkills?.length > 4 && (
            <Badge variant="outline">+{job.requiredSkills.length - 4}</Badge>
          )}
        </div>
      </CardContent>
      {onApply && (
        <CardFooter>
          <Button 
            className="w-full" 
            variant={applied ? "secondary" : "default"} 
            onClick={() => onApply(job.id)}
            disabled={applied}
          >
            {applied ? "Applied" : "Apply Now"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
