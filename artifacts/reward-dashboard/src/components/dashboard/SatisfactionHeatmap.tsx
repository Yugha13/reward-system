import { employees, questions } from "@/data/employees";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SatisfactionHeatmap() {
  const getColor = (score: number) => {
    switch (score) {
      case 5: return "#166534"; // emerald-800
      case 4: return "#22c55e"; // emerald-500
      case 3: return "#eab308"; // yellow-500
      case 2: return "#ef4444"; // red-500
      case 1: return "#991b1b"; // red-800
      default: return "#e5e7eb";
    }
  };

  return (
    <div className="w-full border rounded-md">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max min-w-full flex-col">
          <div className="flex border-b bg-muted/50">
            <div className="w-48 shrink-0 border-r p-3 text-xs font-medium text-muted-foreground sticky left-0 bg-muted/50 z-10">
              Employee
            </div>
            {questions.map((_, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div className="w-12 shrink-0 p-3 text-center text-xs font-medium text-muted-foreground">
                    Q{i + 1}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs">
                  {questions[i]}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          {employees.map((emp) => (
            <div key={emp.id} className="flex border-b last:border-0 hover:bg-muted/20">
              <div className="w-48 shrink-0 border-r p-3 text-sm font-medium sticky left-0 bg-background z-10 flex flex-col justify-center">
                <span className="truncate">{emp.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{emp.department}</span>
              </div>
              {emp.scores.map((score, i) => (
                <div key={i} className="w-12 shrink-0 p-2 flex items-center justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="w-full h-full rounded-sm min-h-[24px] flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-all hover:scale-110"
                        style={{ backgroundColor: getColor(score) }}
                      >
                        {score}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <div className="font-semibold mb-1">Q{i + 1}: {questions[i]}</div>
                        <div>Score: {score}/5</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end gap-4 p-4 text-xs text-muted-foreground bg-muted/20 rounded-b-md">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: "#991b1b"}}></div> 1</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: "#ef4444"}}></div> 2</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: "#eab308"}}></div> 3</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: "#22c55e"}}></div> 4</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{backgroundColor: "#166534"}}></div> 5</div>
      </div>
    </div>
  );
}
