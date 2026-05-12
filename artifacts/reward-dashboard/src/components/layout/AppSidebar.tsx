import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Moon, Sun, LayoutDashboard, Users, MessageSquare, Award, Building2, Sparkles, Building, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Performance Rewards", url: "/performance", icon: TrendingUp },
  { title: "Suggestions", url: "/suggestions", icon: MessageSquare },
  { title: "Rewards", url: "/rewards", icon: Award },
  { title: "Departments", url: "/departments", icon: Building2 },
  { title: "AI Recommendations", url: "/recommendations", icon: Sparkles },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Building className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Johnson Honda</span>
            <span className="text-xs text-sidebar-foreground/70">Phagwara</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url} className={isActive ? "text-sidebar-primary font-medium" : "text-sidebar-foreground"}>
                        <item.icon className={isActive ? "text-sidebar-primary" : ""} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>Toggle theme</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
