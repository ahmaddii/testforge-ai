import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Github, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useApp, delay } from "@/lib/store";
import { generateMockTestCases } from "@/lib/mock-generation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/app/projects/$projectId")({
  component: ProjectDetail,
  head: () => ({ meta: [{ title: "Project — TestForge AI" }] }),
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { projects, testCases, requirements, updateProject, deleteProject, addTestCases, addReport } = useApp();
  const project = projects.find((p) => p.id === projectId);
  const [repo, setRepo] = useState(project?.repoUrl || "");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");
  const [running, setRunning] = useState(false);

  if (!project) {
    return (
      <div className="container mx-auto p-6 max-w-3xl text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/app/projects"><Button variant="outline" className="mt-4">Back to projects</Button></Link>
      </div>
    );
  }

  const projectTests = testCases.filter((t) => t.projectId === projectId);
  const projectReqs = requirements.filter((r) => r.projectId === projectId);

  const analyze = async () => {
    if (!repo) return toast.error("Add a repository URL");
    setRunning(true);
    updateProject(projectId, { repoUrl: repo, status: "Analyzing" });
    const phases = ["Cloning repository…", "Parsing source files…", "Mapping requirements…", "Generating test cases…"];
    for (let i = 0; i < phases.length; i++) {
      setPhase(phases[i]);
      setProgress(((i + 1) / phases.length) * 100);
      await delay(700 + Math.random() * 600);
    }
    const cases = generateMockTestCases(projectId, 8);
    addTestCases(cases);
    updateProject(projectId, { status: "Completed", lastAnalyzed: new Date().toISOString(), testCaseCount: project.testCaseCount + cases.length });
    addReport({ projectId, projectName: project.name, generatedAt: new Date().toISOString(), testCaseCount: cases.length, coverage: 70 + Math.floor(Math.random() * 25) });
    toast.success(`Generated ${cases.length} test cases`);
    setRunning(false); setProgress(0); setPhase("");
  };

  const remove = () => {
    if (!confirm("Delete this project?")) return;
    deleteProject(projectId);
    navigate({ to: "/app/projects" });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <Link to="/app/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> All projects
      </Link>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <Badge className={project.status === "Completed" ? "bg-success/15 text-success" : project.status === "Analyzing" ? "bg-warning/15 text-warning" : "bg-muted"}>{project.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{project.description || "No description"}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={remove}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
      </div>

      <Card className="border-border shadow-card">
        <CardHeader><CardTitle className="text-base">Repository</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="https://github.com/org/repo" className="pl-9" />
            </div>
            <Button onClick={analyze} disabled={running} className="gradient-bg text-primary-foreground shadow-elegant">
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {running ? "Analyzing…" : "Analyze repository"}
            </Button>
          </div>
          {running && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">{phase}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border shadow-card">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Test Cases</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{projectTests.length}</div></CardContent>
        </Card>
        <Card className="border-border shadow-card">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Requirements</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{projectReqs.length}</div></CardContent>
        </Card>
        <Card className="border-border shadow-card">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Last analyzed</CardTitle></CardHeader>
          <CardContent><div className="text-sm">{project.lastAnalyzed ? new Date(project.lastAnalyzed).toLocaleString() : "Never"}</div></CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-card">
        <CardHeader><CardTitle className="text-base">Recent test cases</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {projectTests.slice(0, 6).map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.module} · {t.type}</div>
                </div>
                <Badge variant="outline">{t.priority}</Badge>
              </div>
            ))}
            {projectTests.length === 0 && <p className="text-sm text-muted-foreground py-3">No test cases yet — analyze the repository to generate some.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
