import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import NotFound from "@/pages/not-found";

// Page imports
import Overview from "@/pages/overview";
import Employees from "@/pages/employees";
import Suggestions from "@/pages/suggestions";
import Rewards from "@/pages/rewards";
import Departments from "@/pages/departments";
import Recommendations from "@/pages/recommendations";
import Performance from "@/pages/performance";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans antialiased text-foreground">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-0 sm:pt-0 lg:pt-0 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/employees" component={Employees} />
        <Route path="/suggestions" component={Suggestions} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/departments" component={Departments} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/performance" component={Performance} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
