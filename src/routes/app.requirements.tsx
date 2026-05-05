import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useApp, type Priority, type ReqStatus } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/app/requirements")({
  component: RequirementsPage,
  head: () => ({ meta: [{ title: "Requirements — TestForge AI" }] }),
});

const priorityStyle: Record<Priority, string> = {
  High: "bg-destructive/15 text-destructive",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-muted text-muted-foreground",
};
const statusStyle: Record<ReqStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Approved: "bg-primary/15 text-primary",
  Implemented: "bg-success/15 text-success",
};

function RequirementsPage() {
  const { requirements, addRequirement, updateRequirement, deleteRequirement, projects } = useApp();
  const [q, setQ] = useState("");
  const [filterPri, setFilterPri] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" as Priority, status: "Draft" as ReqStatus, projectId: "" });

  const filtered = useMemo(() => requirements.filter((r) => {
    if (q && !`${r.title} ${r.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (filterPri !== "all" && r.priority !== filterPri) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  }), [requirements, q, filterPri, filterStatus]);

  const openNew = () => { setEditId(null); setForm({ title: "", description: "", priority: "Medium", status: "Draft", projectId: "" }); setOpen(true); };
  const openEdit = (id: string) => {
    const r = requirements.find((x) => x.id === id);
    if (!r) return;
    setEditId(id); setForm({ title: r.title, description: r.description, priority: r.priority, status: r.status, projectId: r.projectId || "" }); setOpen(true);
  };
  const save = () => {
    if (!form.title) return toast.error("Title is required");
    if (editId) { updateRequirement(editId, form); toast.success("Updated"); }
    else { addRequirement(form); toast.success("Requirement added"); }
    setOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Requirements</h1>
          <p className="text-sm text-muted-foreground">Centralize specs and link them to test cases.</p>
        </div>
        <Button onClick={openNew} className="gradient-bg text-primary-foreground shadow-elegant"><Plus className="mr-2 h-4 w-4" /> Add requirement</Button>
      </div>

      <Card className="border-border shadow-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search requirements…" className="pl-8 h-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={filterPri} onValueChange={setFilterPri}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Implemented">Implemented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Requirement</TableHead>
              <TableHead className="w-32">Priority</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow key={r.id} className="group">
                <TableCell className="font-mono text-xs text-muted-foreground">REQ-{String(i + 1).padStart(3, "0")}</TableCell>
                <TableCell>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{r.description}</div>
                </TableCell>
                <TableCell><Badge className={priorityStyle[r.priority]}>{r.priority}</Badge></TableCell>
                <TableCell><Badge className={statusStyle[r.status]}>{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { deleteRequirement(r.id); toast.success("Deleted"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No requirements match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit requirement" : "New requirement"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ReqStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Implemented">Implemented</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Project (optional)</Label>
              <Select value={form.projectId || "none"} onValueChange={(v) => setForm({ ...form, projectId: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="No project" /></SelectTrigger>
                <SelectContent><SelectItem value="none">No project</SelectItem>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="gradient-bg text-primary-foreground">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
