import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportPDF } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports — TestForge AI" }] }),
});

function ReportsPage() {
  const { reports, testCases } = useApp();
  const [selectedId, setSelectedId] = useState(reports[0]?.id);
  const selected = reports.find((r) => r.id === selectedId) || reports[0];
  const previewCases = selected ? testCases.filter((t) => t.projectId === selected.projectId).slice(0, 8) : [];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Past generations and downloadable PDF reports.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border shadow-card lg:col-span-1">
          <CardHeader><CardTitle className="text-base">All reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {reports.map((r) => (
              <button key={r.id} onClick={() => setSelectedId(r.id)} className={`w-full text-left rounded-lg border p-3 transition ${selected?.id === r.id ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/40"}`}>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{r.projectName}</div>
                  <Badge variant="outline" className="text-xs">{r.coverage}%</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(r.generatedAt).toLocaleString()} · {r.testCaseCount} cases</div>
              </button>
            ))}
            {reports.length === 0 && <p className="text-sm text-muted-foreground">No reports yet.</p>}
          </CardContent>
        </Card>

        <Card className="border-border shadow-card lg:col-span-2">
          {selected ? (
            <>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">{selected.projectName}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Generated {new Date(selected.generatedAt).toLocaleString()}</p>
                </div>
                <Button onClick={() => { exportPDF(previewCases, `${selected.projectName} — Test Report`); toast.success("PDF downloaded"); }} className="gradient-bg text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><div className="text-xs text-muted-foreground">Test cases</div><div className="text-2xl font-bold">{selected.testCaseCount}</div></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><div className="text-xs text-muted-foreground">Coverage</div><div className="text-2xl font-bold gradient-text">{selected.coverage}%</div></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><div className="text-xs text-muted-foreground">Status</div><div className="text-sm font-medium pt-1">Ready</div></div>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/30 px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Preview</div>
                  <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                    {previewCases.map((t) => (
                      <div key={t.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{t.title}</div>
                          <Badge variant="outline" className="text-xs">{t.module}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{t.steps}</div>
                        <div className="text-xs mt-1"><span className="text-muted-foreground">Expected:</span> {t.expected}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-12 text-center text-sm text-muted-foreground">Select a report to preview.</CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
