export type Employee = {
  id: number;
  name: string;
  department: string;
  designation: string;
  experience: string;
  scores: number[];
  suggestions: string;
  improvementRequests: string;
};

export const employees: Employee[] = [
  {
    id: 1,
    name: "Harpreet Singh",
    department: "Service",
    designation: "Service Technician",
    experience: "1-3 Years",
    scores: [4, 3, 5, 4, 4, 4, 5, 4, 5, 3, 5, 4, 4, 5, 3],
    suggestions: "Health insurance should be provided to all employees",
    improvementRequests: "Performance-based rewards and employee growth opportunities"
  },
  {
    id: 2,
    name: "Harpreet Singh",
    department: "Service",
    designation: "Service Provider",
    experience: "1-3 Years",
    scores: [4, 3, 5, 4, 3, 3, 5, 5, 5, 3, 5, 3, 4, 5, 3],
    suggestions: "Better ventilation and workspace environment needed",
    improvementRequests: "Skill growth rewards based on performance and customer satisfaction"
  },
  {
    id: 3,
    name: "Rakesh",
    department: "Sales",
    designation: "Sales Manager",
    experience: "More than 5 Years",
    scores: [4, 2, 4, 3, 4, 3, 5, 4, 5, 3, 4, 3, 3, 5, 2],
    suggestions: "Yearly increments should be implemented",
    improvementRequests: "Remove late penalty salary deductions, improve incentive system"
  },
  {
    id: 4,
    name: "Nikhil Daroj",
    department: "Sales",
    designation: "Salesman",
    experience: "0-1 Year",
    scores: [3, 2, 4, 3, 3, 3, 5, 4, 5, 3, 4, 3, 3, 4, 2],
    suggestions: "Improved reward system is needed",
    improvementRequests: "Better bonus incentives for sales performance"
  },
  {
    id: 5,
    name: "Chaitanya",
    department: "Service",
    designation: "Technician",
    experience: "3-5 Years",
    scores: [4, 3, 5, 4, 4, 4, 5, 4, 5, 4, 5, 4, 4, 5, 3],
    suggestions: "Medical benefits should be improved for service staff",
    improvementRequests: "Promotions for hardworking employees based on performance"
  },
  {
    id: 6,
    name: "Ajay",
    department: "Sales",
    designation: "Executive",
    experience: "1-3 Years",
    scores: [4, 2, 4, 3, 3, 3, 5, 4, 5, 3, 4, 3, 3, 5, 2],
    suggestions: "Salary should be increased based on performance metrics",
    improvementRequests: "Employee appreciation programs need to be introduced"
  },
  {
    id: 7,
    name: "Rahul",
    department: "Service",
    designation: "Advisor",
    experience: "More than 5 Years",
    scores: [5, 3, 5, 4, 4, 4, 5, 5, 5, 4, 5, 4, 4, 5, 3],
    suggestions: "Overtime should be properly rewarded",
    improvementRequests: "Technical skill development training programs needed"
  },
  {
    id: 8,
    name: "Manoj",
    department: "Accounts",
    designation: "Accountant",
    experience: "3-5 Years",
    scores: [4, 3, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4, 3],
    suggestions: "Reward calculations should be transparent and fair",
    improvementRequests: "Yearly performance reviews should be conducted"
  },
  {
    id: 9,
    name: "Vishal",
    department: "Service",
    designation: "Supervisor",
    experience: "More than 5 Years",
    scores: [4, 3, 5, 4, 4, 4, 5, 5, 5, 4, 5, 4, 4, 5, 3],
    suggestions: "Medical allowances are essential for all staff",
    improvementRequests: "Employee recognition system should be implemented"
  },
  {
    id: 10,
    name: "Arun",
    department: "Sales",
    designation: "Team Lead",
    experience: "1-3 Years",
    scores: [4, 2, 4, 3, 3, 3, 5, 4, 5, 3, 4, 3, 3, 5, 2],
    suggestions: "Fair distribution of incentives across all team members",
    improvementRequests: "Promotion opportunities should be clearly defined"
  },
  {
    id: 11,
    name: "Deepak",
    department: "Service",
    designation: "Mechanic",
    experience: "0-1 Year",
    scores: [3, 2, 5, 3, 4, 3, 5, 4, 5, 3, 4, 3, 3, 4, 2],
    suggestions: "Better employee facilities during working hours",
    improvementRequests: "Teamwork improvements and better collaboration tools"
  },
  {
    id: 12,
    name: "Karan",
    department: "Sales",
    designation: "Sales Associate",
    experience: "1-3 Years",
    scores: [4, 2, 4, 3, 3, 3, 5, 4, 5, 3, 4, 3, 3, 5, 2],
    suggestions: "Better increments should be provided annually",
    improvementRequests: "Performance-based salary system needs to be implemented"
  }
];

export const questions = [
  "Company provides proper tools and equipment",
  "Satisfaction with salary and incentives",
  "Employees should receive rewards for overtime",
  "Management appreciates good performance",
  "Teamwork between showroom and service employees",
  "Safe and comfortable work environment",
  "Incentives should be linked to performance",
  "Company should provide technical training",
  "Hardworking employees deserve promotions",
  "Management listens to employee concerns",
  "Employees should receive benefits like medical/travel allowances",
  "Better employee facilities during working hours",
  "Reward system motivates better performance",
  "Salary increments should depend on performance",
  "Overall satisfaction with current reward system"
];
