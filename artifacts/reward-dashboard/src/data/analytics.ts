import { employees } from './employees';

export const totalSurveyed = employees.length;

export const satisfactionScore = (employees.reduce((acc, emp) => acc + emp.scores[14], 0) / employees.length).toFixed(1);

export const motivationScore = (employees.reduce((acc, emp) => acc + emp.scores[12], 0) / employees.length).toFixed(1);

export const rewardFairnessScore = (employees.reduce((acc, emp) => acc + (emp.scores[6] + emp.scores[13]) / 2, 0) / employees.length).toFixed(1);

export const overtimeExpectationScore = (employees.reduce((acc, emp) => acc + emp.scores[2], 0) / employees.length).toFixed(1);

export const trainingInterestScore = (employees.reduce((acc, emp) => acc + emp.scores[7], 0) / employees.length).toFixed(1);

export const promotionExpectationScore = (employees.reduce((acc, emp) => acc + emp.scores[8], 0) / employees.length).toFixed(1);

export const medicalBenefitsScore = (employees.reduce((acc, emp) => acc + emp.scores[10], 0) / employees.length).toFixed(1);

export const rewardSatisfactionPercentage = Math.round((Number(satisfactionScore) / 5) * 100);

export const departmentData = (() => {
  const depts = ["Service", "Sales", "Accounts"];
  return depts.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const score = deptEmployees.length > 0 
      ? deptEmployees.reduce((acc, emp) => acc + emp.scores.reduce((a, b) => a + b, 0), 0) / (deptEmployees.length * 15)
      : 0;
    return { name: dept, score: Number(score.toFixed(1)), count: deptEmployees.length };
  });
})();

export const topDepartment = [...departmentData].sort((a, b) => b.score - a.score)[0]?.name || "N/A";

export const experienceData = (() => {
  const brackets = ["0-1 Year", "1-3 Years", "3-5 Years", "More than 5 Years"];
  return brackets.map(bracket => {
    const emp = employees.filter(e => e.experience === bracket);
    const score = emp.length > 0 
      ? emp.reduce((acc, e) => acc + e.scores[14], 0) / emp.length
      : 0;
    return { name: bracket, satisfaction: Number(score.toFixed(1)) };
  });
})();

export const q2Breakdown = (() => {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  employees.forEach(e => {
    counts[e.scores[1]]++;
  });
  return [
    { name: "Strongly Disagree", value: counts[1] },
    { name: "Disagree", value: counts[2] },
    { name: "Neutral", value: counts[3] },
    { name: "Agree", value: counts[4] },
    { name: "Strongly Agree", value: counts[5] }
  ];
})();

export const questionAverages = Array.from({ length: 15 }).map((_, i) => {
  const avg = employees.reduce((acc, emp) => acc + emp.scores[i], 0) / employees.length;
  return Number(avg.toFixed(1));
});

export const getEmployeeSentiment = (emp: any) => {
  const score = emp.scores[14];
  if (score >= 4) return "positive";
  if (score === 3) return "neutral";
  return "negative";
};
