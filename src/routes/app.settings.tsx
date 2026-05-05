import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — TestForge AI" }] }),
});

function SettingsPage() {
  const user = useApp((s) => s.user);
  const setUser = useApp((s) => s.setUser);

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and workspace preferences.</p>
      </div>

      <Card className="border-border shadow-card">
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Name</Label><Input defaultValue={user?.name || ""} onBlur={(e) => user && setUser({ ...user, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={user?.email || ""} disabled /></div>
          <Button onClick={() => toast.success("Profile saved")} className="gradient-bg text-primary-foreground">Save changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-card">
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Theme</div>
            <div className="text-xs text-muted-foreground">Toggle between dark and light mode</div>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card className="border-border shadow-card">
        <CardHeader><CardTitle className="text-base">API keys</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs">tf_live_••••••••••••••••••2f7c</div>
          <Button variant="outline" size="sm" onClick={() => toast.info("Key rotated")}>Rotate key</Button>
        </CardContent>
      </Card>
    </div>
  );
}
