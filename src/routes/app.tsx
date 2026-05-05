import { createFileRoute, Outlet, Link, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FolderGit2, ListChecks, FlaskConical, FileBarChart, Settings, Bell, Search, LogOut, ChevronRight } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("testforge-store");
      if (!raw) throw new Error("no");
      const parsed = JSON.parse(raw);
      if (!parsed?.state?.user) throw new Error("no");
    } catch {
      throw redirect({ to: "/login" });
    }
  },
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/projects", label: "Projects", icon: FolderGit2 },
  { to: "/app/requirements", label: "Requirements", icon: ListChecks },
  { to: "/app/test-cases", label: "Test Cases", icon: FlaskConical },
  { to: "/app/reports", label: "Reports", icon: FileBarChart },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function AppLayout() {
  const navigate = useNavigate();
  const user = useApp((s) => s.user);
  const setUser = useApp((s) => s.setUser);
  const seed = useApp((s) => s.seed);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => { seed(); }, [seed]);

  const current = nav.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to)));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="px-3 py-3">
            <Link to="/app"><Logo /></Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((n) => {
                    const isActive = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                    return (
                      <SidebarMenuItem key={n.to}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={n.label}>
                          <Link to={n.to as any} className="flex items-center gap-2">
                            <n.icon className="h-4 w-4" />
                            <span>{n.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="grid h-8 w-8 place-items-center rounded-full gradient-bg text-primary-foreground text-xs font-semibold shrink-0">
                {(user?.name?.[0] || "U").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user?.name || "User"}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border glass px-4">
            <SidebarTrigger />
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>TestForge</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{current?.label || "App"}</span>
            </div>
            <div className="flex-1" />
            <div className="hidden md:flex relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search anything…" className="pl-8 h-9 bg-muted/40 border-border" />
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="grid h-8 w-8 place-items-center rounded-full gradient-bg text-primary-foreground text-xs font-semibold">
                  {(user?.name?.[0] || "U").toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/app/settings" })}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setUser(null); navigate({ to: "/" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 animate-in fade-in duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
