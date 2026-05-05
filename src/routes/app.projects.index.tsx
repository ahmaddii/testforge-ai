import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Github, MoreHorizontal, FolderGit2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/app/projects/")({
  component: ProjectsPage,
  head: () => ({ meta: [{ title: "Projects — TestForge AI" }] }),
});

function ProjectsPage() {
  const projects = useApp((s) => s.projects);
  const addProject = useApp((s) => s.addProject);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [desc, setDesc] = useState("");

  const create = () => {
    if (!name || !repo) return toast.error("Name and repo URL are required");
    addProject({ name, repoUrl: repo, description: desc });
    toast.success("Project created");
    setName(""); setRepo(""); setDesc(""); setOpen(false);
  };

  const statusStyles: Record<string, string> = {
    Completed: "bg-success/15 text-success",
    Analyzing: "bg-warning/15 text-warning",
    Idle: "bg-muted text-muted-foreground",
    Failed: "bg-destructive/15 text-destructive",
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Connect repositories and manage QA workspaces.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-primary-foreground shadow-elegant"><Plus className="mr-2 h-4 w-4" /> New project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create project</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Checkout Service" /></div>
              <div className="space-y-1.5"><Label>GitHub repository URL</Label><Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="https://github.com/org/repo" /></div>
              <div className="space-y-1.5"><Label>Description (optional)</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create} className="gradient-bg text-primary-foreground">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-border p-12 text-center">
          <FolderGit2 className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No projects yet. Create your first one to get started.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} to="/app/projects/$projectId" params={{ projectId: p.id }}>
              <Card className="group border-border shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FolderGit2 className="h-5 w-5" />
                    </div>
                    <Badge className={statusStyles[p.status]}>{p.status}</Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    <Github className="h-3 w-3 shrink-0" /> <span className="truncate">{p.repoUrl}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{p.testCaseCount} test cases</span>
                    <span className="text-xs text-muted-foreground">{p.lastAnalyzed ? new Date(p.lastAnalyzed).toLocaleDateString() : "Not analyzed"}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
