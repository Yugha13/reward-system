import { Employee, questions } from "@/data/employees";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface EmployeeDetailSheetProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDetailSheet({ employee, open, onOpenChange }: EmployeeDetailSheetProps) {
  if (!employee) return null;

  const chartData = employee.scores.map((score, i) => ({
    subject: `Q${i + 1}`,
    fullQuestion: questions[i],
    score,
    fullMark: 5,
  }));

  const sentiment = employee.scores[14] >= 4 ? "Positive" : employee.scores[14] === 3 ? "Neutral" : "Negative";
  const sentimentColor = sentiment === "Positive" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : 
                         sentiment === "Neutral" ? "bg-amber-100 text-amber-800 border-amber-200" : 
                         "bg-red-100 text-red-800 border-red-200";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{employee.name}</SheetTitle>
          <SheetDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="font-normal">{employee.department}</Badge>
            <span className="text-muted-foreground text-sm">{employee.designation}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1 bg-muted/50 p-3 rounded-lg border">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Experience</span>
              <span className="text-sm font-medium">{employee.experience}</span>
            </div>
            <div className="flex flex-col gap-1 flex-1 bg-muted/50 p-3 rounded-lg border">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Satisfaction</span>
              <span className="text-sm font-medium">
                <Badge variant="outline" className={sentimentColor}>{sentiment} ({employee.scores[14]}/5)</Badge>
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground/80">Feedback Profile</h4>
            <div className="h-[300px] w-full border rounded-lg bg-card p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#B91C1C"
                    fill="#B91C1C"
                    fillOpacity={0.3}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullQuestion;
                      }
                      return label;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-foreground/80">Suggestions</h4>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border italic">
                "{employee.suggestions}"
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-foreground/80">Improvement Requests</h4>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border italic">
                "{employee.improvementRequests}"
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
