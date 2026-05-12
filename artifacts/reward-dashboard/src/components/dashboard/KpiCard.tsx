import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function KpiCard({ title, value, subtitle, icon, trend, className }: KpiCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} className={className}>
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            <div className="flex items-center text-xs">
              {trend && (
                <span
                  className={cn(
                    "mr-2 font-medium",
                    trend.isPositive ? "text-emerald-600 dark:text-emerald-500" : "text-destructive"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
