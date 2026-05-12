import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { departmentData } from "@/data/analytics";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Building2, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Departments() {
  const radarData = [
    { subject: 'Tools/Eq.', Service: 4.2, Sales: 3.6, Accounts: 4.0, fullMark: 5 },
    { subject: 'Salary', Service: 2.8, Sales: 2.0, Accounts: 3.0, fullMark: 5 },
    { subject: 'Overtime', Service: 5.0, Sales: 4.2, Accounts: 4.0, fullMark: 5 },
    { subject: 'Mgmt Apprec.', Service: 3.8, Sales: 3.0, Accounts: 4.0, fullMark: 5 },
    { subject: 'Teamwork', Service: 3.8, Sales: 3.2, Accounts: 4.0, fullMark: 5 },
    { subject: 'Environment', Service: 3.5, Sales: 3.0, Accounts: 4.0, fullMark: 5 },
  ];

  const dimensionData = [
    { name: 'Training Need', Service: 4.5, Sales: 4.0, Accounts: 4.0 },
    { name: 'Promotion Exp.', Service: 5.0, Sales: 5.0, Accounts: 5.0 },
    { name: 'Mgmt Listens', Service: 3.5, Sales: 3.0, Accounts: 4.0 },
    { name: 'Medical/Travel', Service: 5.0, Sales: 4.0, Accounts: 4.0 },
    { name: 'Motivation', Service: 4.0, Sales: 3.0, Accounts: 4.0 },
    { name: 'Overall Sat.', Service: 3.0, Sales: 2.0, Accounts: 3.0 },
  ];

  const deptDetails = [
    { 
      name: "Service", 
      count: 6, 
      score: departmentData.find(d => d.name === "Service")?.score || 0,
      topConcern: "Medical benefits & Better facilities",
      topStrength: "Teamwork & Tools",
      color: "#B91C1C"
    },
    { 
      name: "Sales", 
      count: 5, 
      score: departmentData.find(d => d.name === "Sales")?.score || 0,
      topConcern: "Salary satisfaction & Yearly increments",
      topStrength: "Performance incentive desire",
      color: "#111111"
    },
    { 
      name: "Accounts", 
      count: 1, 
      score: departmentData.find(d => d.name === "Accounts")?.score || 0,
      topConcern: "Transparent reward calculations",
      topStrength: "Safe environment",
      color: "#4b5563"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Department Analytics</h1>
        <p className="text-muted-foreground">Comparative analysis of satisfaction and expectations across departments.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-3">
        {deptDetails.map(dept => (
          <motion.div key={dept.name} variants={item}>
            <Card className="h-full border-t-4" style={{ borderTopColor: dept.color }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{dept.name}</CardTitle>
                  <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-md text-xs">
                    <Users className="h-3 w-3" />
                    {dept.count}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Score</p>
                  <p className="text-3xl font-bold" style={{ color: dept.color }}>{dept.score.toFixed(1)}<span className="text-lg text-muted-foreground font-normal">/5</span></p>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Concern</p>
                    <p className="text-sm font-medium mt-1">{dept.topConcern}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Top Strength</p>
                    <p className="text-sm font-medium mt-1">{dept.topStrength}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Comparison Profile</CardTitle>
            <CardDescription>Core satisfaction dimensions by department</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Radar name="Service" dataKey="Service" stroke="#B91C1C" fill="#B91C1C" fillOpacity={0.2} />
                <Radar name="Sales" dataKey="Sales" stroke="#111111" fill="#111111" fillOpacity={0.2} />
                <Radar name="Accounts" dataKey="Accounts" stroke="#4b5563" fill="#4b5563" fillOpacity={0.2} />
                <Legend />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Drivers by Department</CardTitle>
            <CardDescription>Average scores on operational and reward dimensions</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dimensionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Service" fill="#B91C1C" radius={[0, 2, 2, 0]} barSize={8} />
                <Bar dataKey="Sales" fill="#111111" radius={[0, 2, 2, 0]} barSize={8} />
                <Bar dataKey="Accounts" fill="#4b5563" radius={[0, 2, 2, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
