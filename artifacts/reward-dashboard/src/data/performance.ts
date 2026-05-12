import { employees, type Employee } from './employees';

// Performance metric categories that managers evaluate
export type MetricCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxPoints: number;
  weight: number; // percentage weight for salary recommendation
};

export const metricCategories: MetricCategory[] = [
  {
    id: "attendance",
    name: "Attendance & Punctuality",
    description: "Daily attendance, on-time arrivals, leave management",
    icon: "clock",
    maxPoints: 100,
    weight: 15,
  },
  {
    id: "productivity",
    name: "Work Productivity",
    description: "Task completion rate, quality of work, efficiency",
    icon: "target",
    maxPoints: 100,
    weight: 25,
  },
  {
    id: "teamwork",
    name: "Teamwork & Collaboration",
    description: "Team participation, helping colleagues, communication",
    icon: "users",
    maxPoints: 100,
    weight: 15,
  },
  {
    id: "customer",
    name: "Customer Satisfaction",
    description: "Customer feedback scores, complaint resolution, service quality",
    icon: "heart",
    maxPoints: 100,
    weight: 20,
  },
  {
    id: "initiative",
    name: "Initiative & Innovation",
    description: "Proactive improvements, new ideas, problem solving",
    icon: "lightbulb",
    maxPoints: 100,
    weight: 10,
  },
  {
    id: "skills",
    name: "Skill Development",
    description: "Training completion, certifications, learning new skills",
    icon: "graduation",
    maxPoints: 100,
    weight: 10,
  },
  {
    id: "compliance",
    name: "Policy Compliance",
    description: "Following safety rules, company policies, dress code",
    icon: "shield",
    maxPoints: 100,
    weight: 5,
  },
];

// Reward point transaction log
export type RewardTransaction = {
  id: number;
  employeeId: number;
  categoryId: string;
  points: number; // positive = reward, negative = deduction
  reason: string;
  date: string;
  type: "increment" | "decrement";
};

// Employee performance profile
export type EmployeePerformance = {
  employeeId: number;
  totalPoints: number;
  categoryScores: Record<string, number>;
  rank: number;
  salaryImpactPercent: number;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze" | "Needs Improvement";
  transactions: RewardTransaction[];
  monthlyTrend: number[]; // points per month (last 6 months)
  recommendations: string[];
};

// Generate initial performance data for each employee
function generatePerformanceData(): EmployeePerformance[] {
  const baseScores: Record<number, Record<string, number>> = {
    1: { attendance: 82, productivity: 78, teamwork: 85, customer: 80, initiative: 65, skills: 70, compliance: 90 },
    2: { attendance: 75, productivity: 72, teamwork: 80, customer: 76, initiative: 60, skills: 65, compliance: 85 },
    3: { attendance: 88, productivity: 85, teamwork: 70, customer: 82, initiative: 75, skills: 80, compliance: 92 },
    4: { attendance: 60, productivity: 55, teamwork: 70, customer: 65, initiative: 45, skills: 50, compliance: 78 },
    5: { attendance: 92, productivity: 90, teamwork: 88, customer: 95, initiative: 80, skills: 85, compliance: 95 },
    6: { attendance: 70, productivity: 68, teamwork: 75, customer: 72, initiative: 55, skills: 60, compliance: 82 },
    7: { attendance: 95, productivity: 92, teamwork: 90, customer: 93, initiative: 88, skills: 90, compliance: 98 },
    8: { attendance: 85, productivity: 82, teamwork: 78, customer: 75, initiative: 70, skills: 72, compliance: 88 },
    9: { attendance: 90, productivity: 88, teamwork: 92, customer: 90, initiative: 82, skills: 85, compliance: 95 },
    10: { attendance: 72, productivity: 70, teamwork: 68, customer: 74, initiative: 58, skills: 55, compliance: 80 },
    11: { attendance: 55, productivity: 50, teamwork: 65, customer: 58, initiative: 40, skills: 45, compliance: 72 },
    12: { attendance: 68, productivity: 65, teamwork: 72, customer: 70, initiative: 52, skills: 58, compliance: 80 },
  };

  const monthlyTrends: Record<number, number[]> = {
    1: [320, 340, 355, 370, 380, 395],
    2: [290, 305, 310, 325, 330, 345],
    3: [380, 390, 400, 410, 420, 435],
    4: [220, 230, 240, 250, 255, 260],
    5: [430, 445, 460, 475, 485, 500],
    6: [270, 280, 285, 295, 300, 310],
    7: [470, 480, 495, 510, 520, 535],
    8: [350, 360, 365, 375, 380, 390],
    9: [440, 450, 460, 475, 485, 495],
    10: [260, 270, 275, 280, 285, 295],
    11: [200, 205, 210, 215, 220, 225],
    12: [250, 260, 265, 275, 280, 290],
  };

  return employees.map((emp) => {
    const scores = baseScores[emp.id] || { attendance: 50, productivity: 50, teamwork: 50, customer: 50, initiative: 50, skills: 50, compliance: 50 };

    const weightedTotal = metricCategories.reduce((sum, cat) => {
      return sum + (scores[cat.id] || 0) * (cat.weight / 100);
    }, 0);

    const totalPoints = Math.round(weightedTotal * 10); // Scale to 0-1000

    let tier: EmployeePerformance["tier"];
    if (totalPoints >= 850) tier = "Platinum";
    else if (totalPoints >= 700) tier = "Gold";
    else if (totalPoints >= 550) tier = "Silver";
    else if (totalPoints >= 400) tier = "Bronze";
    else tier = "Needs Improvement";

    const salaryImpactPercent = totalPoints >= 850 ? 15 :
      totalPoints >= 700 ? 10 :
        totalPoints >= 550 ? 5 :
          totalPoints >= 400 ? 2 : 0;

    const recommendations = generateRecommendations(emp, scores);

    return {
      employeeId: emp.id,
      totalPoints,
      categoryScores: scores,
      rank: 0, // will be set after sorting
      salaryImpactPercent,
      tier,
      transactions: generateTransactions(emp.id, scores),
      monthlyTrend: monthlyTrends[emp.id] || [200, 210, 220, 230, 240, 250],
      recommendations,
    };
  });
}

function generateRecommendations(emp: Employee, scores: Record<string, number>): string[] {
  const recs: string[] = [];

  if (scores.attendance < 70) recs.push("⚠️ Improve attendance consistency — consider setting daily check-in reminders");
  if (scores.productivity < 65) recs.push("📊 Enroll in productivity workshop to improve task completion rates");
  if (scores.teamwork < 70) recs.push("🤝 Participate in more cross-department collaboration projects");
  if (scores.customer < 70) recs.push("⭐ Take customer service excellence training to boost satisfaction scores");
  if (scores.initiative < 55) recs.push("💡 Submit at least 2 improvement ideas per quarter to boost innovation score");
  if (scores.skills < 60) recs.push("📚 Complete pending certifications and attend scheduled training sessions");
  if (scores.compliance < 80) recs.push("🛡️ Review and adhere to updated company policies and safety protocols");

  if (scores.productivity >= 85) recs.push("🏆 Excellent productivity — consider for team lead mentorship role");
  if (scores.customer >= 90) recs.push("🌟 Outstanding customer service — nominate for Customer Champion award");
  if (scores.attendance >= 95) recs.push("✅ Perfect attendance streak — eligible for attendance bonus");

  if (recs.length === 0) recs.push("👍 Performance is on track — maintain current momentum");

  return recs;
}

function generateTransactions(employeeId: number, scores: Record<string, number>): RewardTransaction[] {
  const transactions: RewardTransaction[] = [];
  let id = employeeId * 100;

  const reasons: Record<string, { inc: string[]; dec: string[] }> = {
    attendance: {
      inc: ["Perfect attendance this week", "Zero late arrivals this month", "Covered extra shift"],
      dec: ["Unexcused absence", "Late arrival — 3rd time this month", "Left early without permission"],
    },
    productivity: {
      inc: ["Exceeded monthly target by 20%", "Completed project ahead of deadline", "Zero defect work delivery"],
      dec: ["Missed weekly target", "Rework required on submitted task", "Low output compared to team average"],
    },
    teamwork: {
      inc: ["Helped train new team member", "Led team meeting effectively", "Positive peer review feedback"],
      dec: ["Unresolved conflict with colleague", "Missed team collaboration meeting", "Negative peer feedback"],
    },
    customer: {
      inc: ["Received 5-star customer review", "Resolved critical complaint", "Customer appreciation letter received"],
      dec: ["Customer complaint filed", "Negative feedback on service", "Failed to follow up on customer query"],
    },
    initiative: {
      inc: ["Proposed cost-saving idea", "Automated a manual process", "Volunteered for special project"],
      dec: ["No improvement suggestions this quarter", "Declined opportunity to lead project"],
    },
    skills: {
      inc: ["Completed technical certification", "Finished online training course", "Learned new tool/software"],
      dec: ["Missed scheduled training", "Failed certification exam", "No skill development activity"],
    },
    compliance: {
      inc: ["Zero compliance violations this month", "Reported safety hazard", "Updated documentation on time"],
      dec: ["Safety protocol violation", "Late submission of required reports", "Dress code violation"],
    },
  };

  metricCategories.forEach((cat) => {
    const score = scores[cat.id] || 50;
    const catReasons = reasons[cat.id];

    // Add 1-2 transactions per category
    if (score >= 70) {
      const reason = catReasons.inc[Math.floor(Math.random() * catReasons.inc.length)];
      transactions.push({
        id: ++id,
        employeeId,
        categoryId: cat.id,
        points: Math.round(score * 0.3),
        reason,
        date: new Date(2026, 4, Math.floor(Math.random() * 12) + 1).toISOString().split('T')[0],
        type: "increment",
      });
    }

    if (score < 75) {
      const reason = catReasons.dec[Math.floor(Math.random() * catReasons.dec.length)];
      transactions.push({
        id: ++id,
        employeeId,
        categoryId: cat.id,
        points: -Math.round((100 - score) * 0.2),
        reason,
        date: new Date(2026, 4, Math.floor(Math.random() * 12) + 1).toISOString().split('T')[0],
        type: "decrement",
      });
    }
  });

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

// Generate and rank
const rawPerformance = generatePerformanceData();
rawPerformance.sort((a, b) => b.totalPoints - a.totalPoints);
rawPerformance.forEach((p, i) => p.rank = i + 1);

export const performanceData: EmployeePerformance[] = rawPerformance;

// Helper to get employee performance by ID
export function getEmployeePerformance(employeeId: number): EmployeePerformance | undefined {
  return performanceData.find(p => p.employeeId === employeeId);
}

// Helper to get tier color
export function getTierColor(tier: EmployeePerformance["tier"]): string {
  switch (tier) {
    case "Platinum": return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
    case "Gold": return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    case "Silver": return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    case "Bronze": return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    case "Needs Improvement": return "bg-gradient-to-r from-red-400 to-red-600 text-white";
  }
}

// Helper to get tier badge style
export function getTierBadgeStyle(tier: EmployeePerformance["tier"]): string {
  switch (tier) {
    case "Platinum": return "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
    case "Gold": return "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
    case "Silver": return "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    case "Bronze": return "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
    case "Needs Improvement": return "border-red-400 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300";
  }
}
