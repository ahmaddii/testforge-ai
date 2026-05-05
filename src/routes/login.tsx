import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useApp, delay } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Log in — TestForge AI" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const setUser = useApp((s) => s.setUser);
  const seed = useApp((s) => s.seed);
  const [email, setEmail] = useState("demo@testforge.ai");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await delay(700);
    setUser({ email, name: email.split("@")[0] });
    seed();
    toast.success("Welcome back!");
    navigate({ to: "/app" });
  };

  return <AuthShell title="Welcome back" subtitle="Log in to your TestForge workspace">
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full gradient-bg text-primary-foreground" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
      </Button>
      <div className="relative my-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">OR</span></div></div>
      <Button type="button" variant="outline" className="w-full" onClick={submit}>
        <Github className="mr-2 h-4 w-4" /> Continue with GitHub
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
      </p>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-between p-8 lg:p-12">
        <Link to="/"><Logo /></Link>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TestForge AI</p>
      </div>
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex h-full flex-col justify-center p-12">
          <blockquote className="max-w-md">
            <p className="text-2xl font-medium leading-relaxed">
              "TestForge cut our regression planning from days to <span className="gradient-text">minutes</span>. It feels like having a senior QA engineer on tap."
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full gradient-bg text-primary-foreground font-semibold">SK</div>
              <div>
                <div className="font-medium">Sara Khan</div>
                <div className="text-sm text-muted-foreground">Lead QA Engineer · Acme Corp</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
