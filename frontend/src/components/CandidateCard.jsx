import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { FileText, UserPlus, FileCheck } from "lucide-react";

export const CandidateCard = ({ candidate, onAction, actionLabel, appliedJobScore }) => {
  return (
    <Card className="hover:border-indigo-500/30 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{candidate.name || 'Candidate'}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>{candidate.experience || 0} years exp.</span>
            </CardDescription>
          </div>
          {appliedJobScore !== undefined && (
            <Badge variant={appliedJobScore > 75 ? "success" : "warning"} className="text-sm">
              Match: {appliedJobScore.toFixed(0)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {candidate.skills?.split(',').slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill.trim()}
            </Badge>
          ))}
          {candidate.skills?.split(',').length > 5 && (
            <Badge variant="outline">+{candidate.skills.split(',').length - 5}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        {candidate.resumeUrl && (
          <Button variant="outline" className="w-full" asChild>
            <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="w-4 h-4 mr-2" /> Resume
            </a>
          </Button>
        )}
        {onAction && (
          <Button className="w-full" onClick={() => onAction(candidate)}>
            <UserPlus className="w-4 h-4 mr-2" /> {actionLabel || "Action"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
