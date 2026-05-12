import { SatisfactionHeatmap } from "@/components/dashboard/SatisfactionHeatmap";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  satisfactionScore, 
  rewardFairnessScore, 
  overtimeExpectationScore,
  questionAverages
} from "@/data/analytics";
import { questions } from "@/data/employees";
import { motion } from "framer-motion";

export default function Rewards() {
  const healthScore = Math.round((Number(satisfactionScore) / 5) * 100);
  const retentionRisk = 100 - healthScore;

  const getProgressColor = (score: number) => {
    if (score >= 4) return "bg-emerald-500";
    if (score >= 3) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reward Performance Metrics</h1>
        <p className="text-muted-foreground">Detailed analysis of the current reward and incentive structure.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1 border-primary/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Health Score</CardTitle>
            <CardDescription>Overall reward satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={351.8} 
                    strokeDashoffset={351.8 - (351.8 * healthScore) / 100}
                    className="text-primary transition-all duration-1000 ease-in-out" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{healthScore}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">Based on average Q15 scores</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Key Reward Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Incentive Fairness (Avg Q7+Q14)</p>
                <p className="text-2xl font-bold">{rewardFairnessScore}/5</p>
                <Progress value={(Number(rewardFairnessScore)/5)*100} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Recognition Index (Q4)</p>
                <p className="text-2xl font-bold">{questionAverages[3]}/5</p>
                <Progress value={(questionAverages[3]/5)*100} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Overtime Reward Gap (Q3)</p>
                <p className="text-2xl font-bold">{overtimeExpectationScore}/5</p>
                <Progress value={(Number(overtimeExpectationScore)/5)*100} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Retention Risk</p>
                <p className="text-2xl font-bold text-amber-500">{retentionRisk}%</p>
                <Progress value={retentionRisk} className="h-2 bg-muted [&>div]:bg-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Response Heatmap</CardTitle>
          <CardDescription>Individual employee scores across all 15 survey dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <SatisfactionHeatmap />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question Performance Breakdown</CardTitle>
          <CardDescription>Average scores for each survey question ranked by performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questionAverages.map((avg, i) => ({ score: avg, index: i }))
              .sort((a, b) => b.score - a.score)
              .map((item, idx) => (
                <div key={item.index} className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-2/3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Q{item.index + 1}. {questions[item.index]}</span>
                      <span className="font-bold">{item.score.toFixed(1)}/5</span>
                    </div>
                    <Progress 
                      value={(item.score/5)*100} 
                      className={`h-2 bg-muted [&>div]:${getProgressColor(item.score).replace('bg-', '')}`} 
                      style={{ '--progress-color': getProgressColor(item.score).replace('bg-', '') } as React.CSSProperties}
                    />
                  </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
