import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { employees } from "@/data/employees";
import {
  performanceData,
  metricCategories,
  getTierBadgeStyle,
  type EmployeePerformance,
  type RewardTransaction,
} from "@/data/performance";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, TrendingDown, Plus, Minus, Star,
  ArrowUpRight, ArrowDownRight, Clock, Target, Users,
  Heart, Lightbulb, GraduationCap, Shield, Sparkles,
  ChevronUp, ChevronDown, DollarSign, Award, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const categoryIcons: Record<string, React.ReactNode> = {
  clock: <Clock className="h-4 w-4" />,
  target: <Target className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  heart: <Heart className="h-4 w-4" />,
  lightbulb: <Lightbulb className="h-4 w-4" />,
  graduation: <GraduationCap className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
};

function getScoreColor(score: number) {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getProgressBarColor(score: number) {
  if (score >= 85) return "[&>div]:bg-emerald-500";
  if (score >= 70) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

export default function Performance() {
  const [perfData, setPerfData] = useState<EmployeePerformance[]>(performanceData);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"increment" | "decrement">("increment");
  const [actionEmpId, setActionEmpId] = useState<string>("");
  const [actionCategory, setActionCategory] = useState<string>("");
  const [actionPoints, setActionPoints] = useState<string>("");
  const [actionReason, setActionReason] = useState<string>("");
  const { toast } = useToast();

  const topPerformers = useMemo(() => perfData.slice(0, 3), [perfData]);
  const avgPoints = useMemo(() => Math.round(perfData.reduce((s, p) => s + p.totalPoints, 0) / perfData.length), [perfData]);
  const totalSalaryImpact = useMemo(() => {
    const avg = perfData.reduce((s, p) => s + p.salaryImpactPercent, 0) / perfData.length;
    return avg.toFixed(1);
  }, [perfData]);

  const selectedPerf = selectedEmployee ? perfData.find(p => p.employeeId === selectedEmployee) : null;
  const selectedEmp = selectedEmployee ? employees.find(e => e.id === selectedEmployee) : null;

  const handleSubmitReward = () => {
    const empId = Number(actionEmpId);
    const pts = Number(actionPoints);
    if (!empId || !actionCategory || !pts || !actionReason) {
      toast({ title: "Missing fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    const finalPts = actionType === "decrement" ? -Math.abs(pts) : Math.abs(pts);
    const tx: RewardTransaction = {
      id: Date.now(),
      employeeId: empId,
      categoryId: actionCategory,
      points: finalPts,
      reason: actionReason,
      date: new Date().toISOString().split("T")[0],
      type: actionType,
    };

    setPerfData(prev => prev.map(p => {
      if (p.employeeId !== empId) return p;
      const newCatScores = { ...p.categoryScores };
      newCatScores[actionCategory] = Math.max(0, Math.min(100, (newCatScores[actionCategory] || 0) + finalPts));
      const weightedTotal = metricCategories.reduce((sum, cat) => sum + (newCatScores[cat.id] || 0) * (cat.weight / 100), 0);
      const totalPoints = Math.round(weightedTotal * 10);
      let tier: EmployeePerformance["tier"] = totalPoints >= 850 ? "Platinum" : totalPoints >= 700 ? "Gold" : totalPoints >= 550 ? "Silver" : totalPoints >= 400 ? "Bronze" : "Needs Improvement";
      const salaryImpactPercent = totalPoints >= 850 ? 15 : totalPoints >= 700 ? 10 : totalPoints >= 550 ? 5 : totalPoints >= 400 ? 2 : 0;
      return { ...p, totalPoints, categoryScores: newCatScores, tier, salaryImpactPercent, transactions: [tx, ...p.transactions] };
    }).sort((a, b) => b.totalPoints - a.totalPoints).map((p, i) => ({ ...p, rank: i + 1 })));

    const empName = employees.find(e => e.id === empId)?.name || "Employee";
    toast({
      title: actionType === "increment" ? `+${pts} points awarded!` : `-${Math.abs(pts)} points deducted`,
      description: `${empName} — ${actionReason}`,
    });
    setActionEmpId(""); setActionCategory(""); setActionPoints(""); setActionReason("");
    setDialogOpen(false);
  };

  const radarData = selectedPerf ? metricCategories.map(cat => ({
    metric: cat.name.split(" ")[0],
    score: selectedPerf.categoryScores[cat.id] || 0,
    fullMark: 100,
  })) : [];

  const trendData = selectedPerf ? selectedPerf.monthlyTrend.map((v, i) => ({
    month: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][i],
    points: v,
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Performance Rewards</h1>
          <p className="text-muted-foreground">Manage reward points, track performance, and drive salary increments.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setActionType("increment")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Award Points
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button onClick={() => setActionType("decrement")} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950">
                <Minus className="mr-2 h-4 w-4" /> Deduct Points
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {actionType === "increment" ? <><ArrowUpRight className="h-5 w-5 text-emerald-600" /> Award Reward Points</> : <><ArrowDownRight className="h-5 w-5 text-red-600" /> Deduct Points</>}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={actionEmpId} onValueChange={setActionEmpId}>
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>{employees.map(e => <SelectItem key={e.id} value={String(e.id)}>{e.name} — {e.designation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={actionCategory} onValueChange={setActionCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{metricCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points ({actionType === "increment" ? "1-50" : "1-30"})</Label>
                  <Input type="number" min={1} max={actionType === "increment" ? 50 : 30} value={actionPoints} onChange={e => setActionPoints(e.target.value)} placeholder="Enter points" />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea value={actionReason} onChange={e => setActionReason(e.target.value)} placeholder={actionType === "increment" ? "e.g., Exceeded sales target by 30%..." : "e.g., Missed 2 consecutive deadlines..."} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleSubmitReward} className={actionType === "increment" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
                  {actionType === "increment" ? "Award Points" : "Deduct Points"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-primary/20"><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">Avg Points</p><p className="text-2xl font-bold">{avgPoints}<span className="text-sm text-muted-foreground">/1000</span></p></div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><BarChart3 className="h-6 w-6 text-primary" /></div>
            </div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">Top Performer</p><p className="text-2xl font-bold">{employees.find(e => e.id === topPerformers[0]?.employeeId)?.name}</p></div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center"><Trophy className="h-6 w-6 text-amber-500" /></div>
            </div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">Avg Salary Impact</p><p className="text-2xl font-bold text-emerald-600">+{totalSalaryImpact}%</p></div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><DollarSign className="h-6 w-6 text-emerald-500" /></div>
            </div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">Needs Attention</p><p className="text-2xl font-bold text-red-600">{perfData.filter(p => p.tier === "Needs Improvement" || p.tier === "Bronze").length}</p></div>
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center"><TrendingDown className="h-6 w-6 text-red-500" /></div>
            </div>
          </CardContent></Card>
        </motion.div>
      </div>

      {/* Main Content: Leaderboard + Detail */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /> Employee Leaderboard</CardTitle>
            <CardDescription>Click an employee to view detailed breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {perfData.map((perf, idx) => {
              const emp = employees.find(e => e.id === perf.employeeId);
              if (!emp) return null;
              const isSelected = selectedEmployee === emp.id;
              return (
                <motion.div key={emp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-primary/10 border border-primary/30 shadow-sm" : "hover:bg-muted/50 border border-transparent"}`}
                  onClick={() => setSelectedEmployee(emp.id)}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${idx === 0 ? "bg-amber-500 text-white" : idx === 1 ? "bg-gray-400 text-white" : idx === 2 ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {perf.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.designation}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${getScoreColor(perf.totalPoints / 10)}`}>{perf.totalPoints}</p>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getTierBadgeStyle(perf.tier)}`}>{perf.tier}</Badge>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Employee Detail */}
        <Card className="lg:col-span-3">
          {selectedPerf && selectedEmp ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedEmp.name}</CardTitle>
                    <CardDescription>{selectedEmp.designation} · {selectedEmp.department} · {selectedEmp.experience}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getTierBadgeStyle(selectedPerf.tier)} text-sm px-3 py-1`}>{selectedPerf.tier}</Badge>
                    <p className="text-sm text-emerald-600 font-semibold mt-1">+{selectedPerf.salaryImpactPercent}% salary impact</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="metrics" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="radar">Radar</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="tips">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="metrics" className="space-y-4 mt-4">
                    {metricCategories.map(cat => {
                      const score = selectedPerf.categoryScores[cat.id] || 0;
                      return (
                        <div key={cat.id} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">{categoryIcons[cat.icon]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium truncate">{cat.name}</span>
                              <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                            </div>
                            <Progress value={score} className={`h-2 ${getProgressBarColor(score)}`} />
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">{cat.weight}%</span>
                        </div>
                      );
                    })}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="font-semibold">Total Weighted Score</span>
                      <span className="text-2xl font-bold text-primary">{selectedPerf.totalPoints}<span className="text-sm text-muted-foreground">/1000</span></span>
                    </div>
                  </TabsContent>

                  <TabsContent value="radar" className="mt-4">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Radar name="Score" dataKey="score" stroke="#B91C1C" fill="#B91C1C" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-[200px] mt-4">
                      <p className="text-sm font-medium mb-2 text-muted-foreground">6-Month Points Trend</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                          <Line type="monotone" dataKey="points" stroke="#B91C1C" strokeWidth={3} dot={{ r: 5, fill: "#B91C1C" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-2 max-h-[450px] overflow-y-auto">
                      {selectedPerf.transactions.map(tx => {
                        const cat = metricCategories.find(c => c.id === tx.categoryId);
                        return (
                          <div key={tx.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "increment" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"}`}>
                              {tx.type === "increment" ? <ChevronUp className="h-4 w-4 text-emerald-600" /> : <ChevronDown className="h-4 w-4 text-red-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{tx.reason}</p>
                              <p className="text-xs text-muted-foreground">{cat?.name} · {tx.date}</p>
                            </div>
                            <span className={`font-bold text-sm ${tx.type === "increment" ? "text-emerald-600" : "text-red-600"}`}>
                              {tx.points > 0 ? "+" : ""}{tx.points}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="tips" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <p className="font-semibold">AI-Powered Recommendations</p>
                      </div>
                      {selectedPerf.recommendations.map((rec, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50 text-sm">{rec}</div>
                      ))}
                      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                        <p className="font-semibold text-sm flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Salary Increment Recommendation</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on current performance ({selectedPerf.totalPoints} pts, {selectedPerf.tier} tier), this employee qualifies for a <strong className="text-primary">+{selectedPerf.salaryImpactPercent}%</strong> salary increment in the next review cycle.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[500px] text-center">
              <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Select an employee</p>
              <p className="text-sm text-muted-foreground/70">Click on any employee from the leaderboard to view their performance breakdown</p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Category Overview Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance by Category</CardTitle>
          <CardDescription>Average scores across all employees for each performance metric</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metricCategories.map(cat => ({
              name: cat.name.split(" ")[0],
              score: Math.round(perfData.reduce((s, p) => s + (p.categoryScores[cat.id] || 0), 0) / perfData.length),
              fullName: cat.name,
            }))} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(value: number) => [`${value}/100`, "Avg Score"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""} />
              <Bar dataKey="score" fill="#B91C1C" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
