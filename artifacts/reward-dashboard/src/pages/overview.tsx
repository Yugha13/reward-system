import { KpiCard } from "@/components/dashboard/KpiCard";
import { 
  totalSurveyed, 
  satisfactionScore, 
  topDepartment, 
  motivationScore, 
  rewardSatisfactionPercentage,
  departmentData,
  experienceData,
  q2Breakdown,
  questionAverages
} from "@/data/analytics";
import { questions } from "@/data/employees";
import { Users, Star, TrendingUp, Award, Target, MessageCircle, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

export default function Overview() {
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

  const handlePrint = () => {
    window.print();
  };

  const COLORS = ['#B91C1C', '#111111', '#4b5563', '#9ca3af', '#d1d5db'];

  const agreementData = questions.map((q, i) => ({
    name: `Q${i + 1}`,
    score: questionAverages[i],
    fullText: q
  }));

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
          <p className="text-muted-foreground">Key HR intelligence metrics for Johnson Honda Phagwara.</p>
        </div>
        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90 text-primary-foreground print:hidden">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard 
          title="Total Surveyed" 
          value={totalSurveyed} 
          icon={<Users className="h-4 w-4" />}
          className="print:break-inside-avoid"
        />
        <KpiCard 
          title="Avg Satisfaction Score" 
          value={`${satisfactionScore}/5`}
          icon={<Star className="h-4 w-4" />}
          trend={{ value: "Target: 4.5", isPositive: Number(satisfactionScore) >= 4.0 }}
          className="print:break-inside-avoid"
        />
        <KpiCard 
          title="Most Positive Dept" 
          value={topDepartment}
          icon={<TrendingUp className="h-4 w-4" />}
          className="print:break-inside-avoid"
        />
        <KpiCard 
          title="Most Requested" 
          value="Performance-based Increments"
          icon={<MessageCircle className="h-4 w-4" />}
          className="print:break-inside-avoid"
        />
        <KpiCard 
          title="Motivation Score" 
          value={`${motivationScore}/5`}
          icon={<Target className="h-4 w-4" />}
          className="print:break-inside-avoid"
        />
        <KpiCard 
          title="Reward Satisfaction" 
          value={`${rewardSatisfactionPercentage}%`}
          icon={<Award className="h-4 w-4" />}
          trend={{ value: "Target: 80%", isPositive: rewardSatisfactionPercentage >= 80 }}
          className="print:break-inside-avoid"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 print:grid-cols-1">
        <motion.div variants={item} className="lg:col-span-4 print:break-inside-avoid">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Department Satisfaction</CardTitle>
              <CardDescription>Average total score across all questions per department</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 5]} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" fill="#B91C1C" radius={[4, 4, 0, 0]} maxBarSize={60} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3 print:break-inside-avoid">
          <Card className="h-full bg-sidebar text-sidebar-foreground border-sidebar-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-sidebar-primary" />
                AI Insights
              </CardTitle>
              <CardDescription className="text-sidebar-foreground/70">
                Key takeaways from employee feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-sidebar-accent rounded-md border border-sidebar-accent-border">
                <p className="text-sm">Service department employees show significantly higher satisfaction than Sales.</p>
              </div>
              <div className="p-3 bg-sidebar-accent rounded-md border border-sidebar-accent-border">
                <p className="text-sm font-medium text-sidebar-primary">83% of employees strongly support performance-based incentives.</p>
              </div>
              <div className="p-3 bg-sidebar-accent rounded-md border border-sidebar-accent-border">
                <p className="text-sm">Overtime reward expectations score 4.6/5 — highest among all categories.</p>
              </div>
              <div className="p-3 bg-sidebar-accent rounded-md border border-sidebar-accent-border">
                <p className="text-sm">Technical training interest is critically high across all departments.</p>
              </div>
              <div className="p-3 bg-sidebar-accent rounded-md border border-sidebar-accent-border">
                <p className="text-sm">Medical allowance requests are consistent across Service and Sales.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1 print:break-before-page">
        <motion.div variants={item} className="print:break-inside-avoid">
          <Card>
            <CardHeader>
              <CardTitle>Experience vs Satisfaction</CardTitle>
              <CardDescription>Overall satisfaction (Q15) by years of experience</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={experienceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="satisfaction" stroke="#B91C1C" strokeWidth={3} dot={{r: 6, fill: '#B91C1C'}} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="print:break-inside-avoid">
          <Card>
            <CardHeader>
              <CardTitle>Salary & Incentive Satisfaction</CardTitle>
              <CardDescription>Breakdown of responses to Q2</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={q2Breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    isAnimationActive={true}
                    label={({name, percent}) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                  >
                    {q2Breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item} className="print:break-inside-avoid">
        <Card>
          <CardHeader>
            <CardTitle>Agreement Distribution Across All Areas</CardTitle>
            <CardDescription>Average score out of 5 for each of the 15 survey questions</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agreementData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 5]} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: '300px', whiteSpace: 'normal' }}
                  formatter={(value: number) => [`${value}/5`, 'Average Score']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullText;
                    }
                    return label;
                  }}
                />
                <Bar dataKey="score" fill="#111111" radius={[2, 2, 0, 0]} isAnimationActive={true}>
                  {agreementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 3.5 ? '#B91C1C' : '#111111'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#111111] rounded-sm"></div>
                <span>Score ≥ 3.5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#B91C1C] rounded-sm"></div>
                <span>Score &lt; 3.5 (Needs Attention)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
