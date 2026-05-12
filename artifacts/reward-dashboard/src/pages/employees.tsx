import { useState } from "react";
import { employees, Employee } from "@/data/employees";
import { EmployeeDetailSheet } from "@/components/dashboard/EmployeeDetailSheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const getSatisfactionLevel = (score: number) => {
    if (score >= 4) return { label: "High", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (score === 3) return { label: "Medium", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Low", color: "bg-red-100 text-red-800 border-red-200" };
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "all" || emp.department === deptFilter;
    const matchesExp = expFilter === "all" || emp.experience === expFilter;
    return matchesSearch && matchesDept && matchesExp;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Employee Feedback Analysis</h1>
        <p className="text-muted-foreground">Detailed breakdown of individual employee survey responses.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Accounts">Accounts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expFilter} onValueChange={setExpFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-1 Year">0-1 Year</SelectItem>
                <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                <SelectItem value="More than 5 Years">More than 5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead className="text-center">Satisfaction</TableHead>
                <TableHead className="text-center">Motivation (Q13)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No employees found matching the filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp, i) => {
                  const sat = getSatisfactionLevel(emp.scores[14]);
                  return (
                    <TableRow key={emp.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.designation}</TableCell>
                      <TableCell>{emp.experience}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={sat.color}>
                          {sat.label} ({emp.scores[14]}/5)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {emp.scores[12]}/5
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedEmployee(emp)}
                          className="hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <EmployeeDetailSheet 
        employee={selectedEmployee} 
        open={!!selectedEmployee} 
        onOpenChange={(open) => !open && setSelectedEmployee(null)} 
      />
    </div>
  );
}
