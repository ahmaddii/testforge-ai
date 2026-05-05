import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Download, Search, Loader2, Trash2, Pencil, FileText, FileSpreadsheet, Plus } from "lucide-react";
import { useApp, delay, type TestCase, type Priority, type TestType, type TestStatus } from "@/lib/store";
import { generateMockTestCases } from "@/lib/mock-generation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportCSV, exportPDF } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/app/test-cases")({
  component: TestCasesPage,
  head: () => ({ meta: [{ title: "Test Case Generator — TestForge AI" }] }),
});

const typeStyle: Record<TestType, string> = {
  positive: "bg-success/15 text-success border-success/30",
  negative: "bg-destructive/15 text-destructive border-destructive/30",
  edge: "bg-warning/15 text-warning border-warning/30",
};
const priorityStyle: Record<Priority, string> = {
  High: "bg-destructive/15 text-destructive",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-muted text-muted-foreground",
};

function TestCasesPage() {
  const { projects, testCases, addTestCases, updateTestCase, deleteTestCase, addReport } = useApp();
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || "all");
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [skeletons, setSkeletons] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<TestCase | null>(null);

  const rows = useMemo(() => testCases.filter((t) => {
    if (projectId !== "all" && t.projectId !== projectId) return false;
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterPri !== "all" && t.priority !== filterPri) return false;
    if (q && !`${t.title} ${t.module} ${t.expected}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [testCases, projectId, filterType, filterPri, q]);

  const generate = async () => {
    const pid = projectId === "all" ? projects[0]?.id : projectId;
    if (!pid) return toast.error("Create a project first");
    setGenerating(true); setSkeletons(8);
    toast.info("AI is analyzing your codebase…");
    await delay(1200);
    toast.info("Mapping requirements to modules…");
    await delay(1000);
    toast.info("Crafting test scenarios…");
    await delay(1000 + Math.random() * 800);
    const cases = generateMockTestCases(pid, 8);
    addTestCases(cases);
    const proj = projects.find((p) => p.id === pid);
    addReport({ projectId: pid, projectName: proj?.name || "Project", generatedAt: new Date().toISOString(), testCaseCount: cases.length, coverage: 70 + Math.floor(Math.random() * 25) });
    toast.success(`Generated ${cases.length} test cases`);
    setGenerating(false); setSkeletons(0);
  };

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(rows.map((r) => r.id)) : new Set());
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const bulkDelete = () => {
    selected.forEach((id) => deleteTestCase(id));
    toast.success(`Deleted ${selected.size} test cases`);
    setSelected(new Set());
  };
  const exportRows = rows;
  const addBlank = () => {
    const pid = projectId === "all" ? projects[0]?.id : projectId;
    if (!pid) return toast.error("Create a project first");
    addTestCases([{ projectId: pid, module: "New", title: "Untitled test case", steps: "1. ", expected: "", type: "positive", priority: "Medium", status: "Pending" }]);
  };

  return (
    <div className="container mx-auto p-6 space-y-4 max-w-[100rem]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test Case Generator</h1>
          <p className="text-sm text-muted-foreground">AI-generated, editable, exportable test plans.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-56 h-9"><SelectValue placeholder="Select project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={generate} disabled={generating} className="gradient-bg text-primary-foreground shadow-elegant">
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Generating…" : "Generate with AI"}
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search test cases…" className="pl-8 h-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="positive">Positive</SelectItem><SelectItem value="negative">Negative</SelectItem><SelectItem value="edge">Edge</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPri} onValueChange={setFilterPri}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={addBlank}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add row</Button>
          {selected.size > 0 && (
            <Button variant="outline" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete ({selected.size})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportPDF(exportRows)}><FileText className="mr-2 h-4 w-4" /> Export PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCSV(exportRows)}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Card className="border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-10"><Checkbox checked={selected.size === rows.length && rows.length > 0} onCheckedChange={(v) => toggleAll(!!v)} /></TableHead>
                <TableHead className="w-32">Module</TableHead>
                <TableHead>Test Case</TableHead>
                <TableHead className="w-64">Steps</TableHead>
                <TableHead className="w-56">Expected Result</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead className="w-24">Priority</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generating && Array.from({ length: skeletons }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))}
              {rows.map((t) => (
                <TableRow key={t.id} className="group cursor-pointer" onClick={() => setEditing(t)}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggleOne(t.id)} /></TableCell>
                  <TableCell><Badge variant="outline" className="font-mono text-xs">{t.module}</Badge></TableCell>
                  <TableCell><div className="font-medium">{t.title}</div></TableCell>
                  <TableCell><div className="text-xs text-muted-foreground whitespace-pre-line line-clamp-2">{t.steps}</div></TableCell>
                  <TableCell><div className="text-xs text-muted-foreground line-clamp-2">{t.expected}</div></TableCell>
                  <TableCell><Badge variant="outline" className={typeStyle[t.type]}>{t.type}</Badge></TableCell>
                  <TableCell><Badge className={priorityStyle[t.priority]}>{t.priority}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{t.status}</Badge></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { deleteTestCase(t.id); toast.success("Deleted"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {!generating && rows.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-12">
                  <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No test cases yet. Click "Generate with AI" to create some.</p>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>Edit test case</SheetTitle></SheetHeader>
          {editing && (
            <div className="space-y-4 py-4">
              <div className="space-y-1.5"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Module</Label><Input value={editing.module} onChange={(e) => setEditing({ ...editing, module: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Type</Label>
                  <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v as TestType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="positive">Positive</SelectItem><SelectItem value="negative">Negative</SelectItem><SelectItem value="edge">Edge</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Priority</Label>
                  <Select value={editing.priority} onValueChange={(v) => setEditing({ ...editing, priority: v as Priority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as TestStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Passed">Passed</SelectItem><SelectItem value="Failed">Failed</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Steps</Label><Textarea rows={5} value={editing.steps} onChange={(e) => setEditing({ ...editing, steps: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Expected result</Label><Textarea rows={3} value={editing.expected} onChange={(e) => setEditing({ ...editing, expected: e.target.value })} /></div>
            </div>
          )}
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button className="gradient-bg text-primary-foreground" onClick={() => { if (editing) { updateTestCase(editing.id, editing); toast.success("Saved"); setEditing(null); } }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
