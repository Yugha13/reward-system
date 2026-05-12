import { employees } from "@/data/employees";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle, ThumbsUp, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { getEmployeeSentiment } from "@/data/analytics";

export default function Suggestions() {
  const sentiments = employees.map(e => getEmployeeSentiment(e));
  const positiveCount = sentiments.filter(s => s === "positive").length;
  const neutralCount = sentiments.filter(s => s === "neutral").length;
  const negativeCount = sentiments.filter(s => s === "negative").length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getBorderColor = (sentiment: string) => {
    if (sentiment === "positive") return "border-l-4 border-l-emerald-500";
    if (sentiment === "neutral") return "border-l-4 border-l-amber-500";
    return "border-l-4 border-l-red-500";
  };

  const getBadgeColor = (sentiment: string) => {
    if (sentiment === "positive") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (sentiment === "neutral") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const themes = [
    "Performance Incentives", 
    "Overtime Pay", 
    "Medical Benefits", 
    "Training", 
    "Recognition", 
    "Promotions", 
    "Better Facilities"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Suggestions & Complaints</h1>
        <p className="text-muted-foreground">Qualitative feedback and sentiment analysis from employees.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">{positiveCount}</h3>
            </div>
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <ThumbsUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Neutral Sentiment</p>
              <h3 className="text-3xl font-bold text-amber-500 mt-1">{neutralCount}</h3>
            </div>
            <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
              <h3 className="text-3xl font-bold text-red-600 mt-1">{negativeCount}</h3>
            </div>
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground shrink-0 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Top Themes:
          </span>
          <div className="flex flex-wrap gap-2">
            {themes.map(theme => (
              <Badge key={theme} variant="secondary" className="hover:bg-secondary/80 text-xs">
                {theme}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2"
      >
        {employees.map(emp => {
          const sentiment = getEmployeeSentiment(emp);
          return (
            <motion.div key={emp.id} variants={item}>
              <Card className={`h-full ${getBorderColor(sentiment)}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{emp.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{emp.department} • {emp.designation}</p>
                    </div>
                    <Badge variant="outline" className={getBadgeColor(sentiment)}>
                      Score: {emp.scores[14]}/5
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Suggestions</p>
                    <p className="text-sm p-3 bg-muted/30 rounded-md border border-muted">"{emp.suggestions}"</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Improvement Requests</p>
                    <p className="text-sm p-3 bg-muted/30 rounded-md border border-muted">"{emp.improvementRequests}"</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
