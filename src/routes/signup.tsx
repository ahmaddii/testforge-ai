import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, delay } from "@/lib/store";
import { toast } from "sonner";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign up — TestForge AI" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const setUser = useApp((s) => s.setUser);
  const seed = useApp((s) => s.seed);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await delay(800);
    setUser({ email: email || "demo@testforge.ai", name: name || "Demo User" });
    seed();
    toast.success("Account created");
    navigate({ to: "/app" });
  };

  return <AuthShell title="Create your account" subtitle="Start generating test cases in minutes">
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full gradient-bg text-primary-foreground" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={submit}>
        <Github className="mr-2 h-4 w-4" /> Continue with GitHub
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
      </p>
    </form>
  </AuthShell>;
}
