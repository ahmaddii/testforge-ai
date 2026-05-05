import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { FolderGit2, FlaskConical, GitBranch, Target, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/")({
  component: DashboardHome,
  head: () => ({ meta: [{ title: "Dashboard — TestForge AI" }] }),
});

function DashboardHome() {
  const { projects, testCases, reports } = useApp();
  const activeRepos = projects.filter((p) => p.status === "Completed").length;
  const coverage = useMemo(() => {
    if (reports.length === 0) return 82;
    return Math.round(reports.reduce((a, r) => a + r.coverage, 0) / reports.length);
  }, [reports]);

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderGit2, accent: "from-primary to-primary-glow" },
    { label: "Test Cases", value: testCases.length, icon: FlaskConical, accent: "from-chart-2 to-primary" },
    { label: "Active Repositories", value: activeRepos, icon: GitBranch, accent: "from-chart-3 to-chart-2" },
    { label: "Coverage Score", value: `${coverage}%`, icon: Target, accent: "from-chart-4 to-chart-5" },
  ];

  const trend = [
    { d: "Mon", v: 12 }, { d: "Tue", v: 18 }, { d: "Wed", v: 22 },
    { d: "Thu", v: 19 }, { d: "Fri", v: 28 }, { d: "Sat", v: 32 }, { d: "Sun", v: 41 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Here's an overview of your QA workspace.</p>
        </div>
        <Link to="/app/test-cases">
          <Button className="gradient-bg text-primary-foreground shadow-elegant">
            <Sparkles className="mr-2 h-4 w-4" /> Generate test cases
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="relative overflow-hidden border-border shadow-card hover:shadow-elegant transition-shadow">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.accent} opacity-10 blur-2xl`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-success mt-1">+12% vs last week</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Test cases generated</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -20, right: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent projects</CardTitle>
            <Link to="/app/projects" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {projects.slice(0, 5).map((p) => (
              <Link key={p.id} to="/app/projects/$projectId" params={{ projectId: p.id }} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50 transition">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.repoUrl}</div>
                </div>
                <Badge variant={p.status === "Completed" ? "default" : "secondary"} className={p.status === "Completed" ? "bg-success/15 text-success hover:bg-success/15" : ""}>
                  {p.status}
                </Badge>
              </Link>
            ))}
            {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent generations</CardTitle>
          <Link to="/app/reports" className="text-xs text-primary hover:underline flex items-center gap-1">View reports <ArrowRight className="h-3 w-3" /></Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {reports.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{r.projectName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.generatedAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-muted-foreground">{r.testCaseCount} cases</div>
                  <div className="font-semibold text-success">{r.coverage}% coverage</div>
                </div>
              </div>
            ))}
            {reports.length === 0 && <p className="text-sm text-muted-foreground py-3">No reports yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
