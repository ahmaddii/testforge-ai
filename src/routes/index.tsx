import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Sparkles, FileText, ListChecks, Workflow, Check, Play, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "TestForge AI — Generate SQA Test Cases from Your Code" },
      { name: "description", content: "AI-powered test case generation for QA engineers. Connect GitHub, define requirements, export polished test plans in seconds." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/signup">
            <Button size="sm" className="gradient-bg text-primary-foreground hover:opacity-90 shadow-elegant">
              Start free <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 hero-bg pointer-events-none" />
      <div className="container relative mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary backdrop-blur animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="mr-1.5 h-3 w-3" /> Now in public beta
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            Generate SQA Test Cases<br />
            from your code{" "}
            <span className="gradient-text">in seconds</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Connect a GitHub repository, drop in your requirements, and let AI craft a complete,
            production-ready test plan — exportable to PDF or CSV.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <Link to="/signup">
              <Button size="lg" className="gradient-bg text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-6 text-base">
                Start free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app">
              <Button size="lg" variant="outline" className="h-12 px-6 text-base glass">
                <Play className="mr-2 h-4 w-4" /> View demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>

        <div className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <MockDashboard />
        </div>
      </div>
    </section>
  );
}

function MockDashboard() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-4 gradient-bg opacity-30 blur-3xl rounded-3xl" />
      <div className="relative rounded-2xl border border-border/60 glass-strong shadow-elegant overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/70" />
            <div className="h-3 w-3 rounded-full bg-warning/70" />
            <div className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          <div className="ml-4 flex items-center gap-2 rounded-md bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> testforge.ai/app/test-cases
          </div>
        </div>
        <div className="grid grid-cols-12 min-h-[420px]">
          <div className="col-span-3 border-r border-border/60 bg-sidebar/40 p-4 hidden md:block">
            <div className="space-y-1 text-xs">
              {["Dashboard", "Projects", "Requirements", "Test Cases", "Reports"].map((x, i) => (
                <div key={x} className={`px-3 py-2 rounded-md ${i === 3 ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground"}`}>{x}</div>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-9 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Project</div>
                <div className="font-semibold">Checkout Service</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg gradient-bg text-primary-foreground text-xs font-medium shadow-glow">
                <Sparkles className="inline h-3 w-3 mr-1" /> Generate with AI
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-12 gap-2 text-muted-foreground border-b border-border/60 pb-2">
                <div className="col-span-2">Module</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Expected</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1">Pri.</div>
              </div>
              {[
                ["Checkout", "Successful card payment", "Order confirmed", "positive", "High"],
                ["Checkout", "Declined card shows error", "Friendly error", "negative", "High"],
                ["Cart", "Quantity zero removes item", "Item removed", "edge", "Low"],
                ["Auth", "Invalid token rejected", "401 returned", "negative", "Medium"],
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 py-2 border-b border-border/30 hover:bg-muted/30 rounded">
                  <div className="col-span-2 font-medium">{row[0]}</div>
                  <div className="col-span-5">{row[1]}</div>
                  <div className="col-span-3 text-muted-foreground">{row[2]}</div>
                  <div className="col-span-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      row[3] === "positive" ? "bg-success/15 text-success" :
                      row[3] === "negative" ? "bg-destructive/15 text-destructive" :
                      "bg-warning/15 text-warning"
                    }`}>{row[3]}</span>
                  </div>
                  <div className="col-span-1 text-muted-foreground">{row[4]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoCloud() {
  const names = ["Acme", "Globex", "Initech", "Umbrella", "Stark", "Wayne"];
  return (
    <section className="border-y border-border/40 py-10">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Trusted by QA teams worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {names.map((n) => (
            <div key={n} className="text-lg font-semibold tracking-tight">{n}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Github, title: "GitHub integration", desc: "Connect any repository and analyze its structure to ground every test case in real code." },
    { icon: Sparkles, title: "AI test generation", desc: "Generate positive, negative, and edge cases automatically from your requirements." },
    { icon: ListChecks, title: "Requirement management", desc: "Centralize specs with priority and status tracking. Map every test back to a requirement." },
    { icon: FileText, title: "PDF & CSV export", desc: "Polished, shareable reports for stakeholders, auditors, and CI pipelines." },
    { icon: Shield, title: "Coverage insights", desc: "See coverage scores per module so you know exactly where to focus next." },
    { icon: Users, title: "Built for teams", desc: "Roles, comments, and history for QA engineers, PMs, and developers." },
  ];
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center mb-14">
        <Badge variant="outline" className="mb-3">Features</Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything QA needs, nothing it doesn't</h2>
        <p className="mt-3 text-muted-foreground">Replace spreadsheets and ad-hoc docs with a focused, AI-native QA workspace.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
            <div className="absolute inset-0 rounded-2xl gradient-bg opacity-0 blur-xl transition-opacity group-hover:opacity-10" />
            <div className="relative">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Github, title: "Connect repo", desc: "Paste a GitHub URL or import from your account." },
    { icon: Workflow, title: "Add requirements", desc: "Describe what your software should do — or generate from code." },
    { icon: Sparkles, title: "Generate & export", desc: "Get a complete test plan in seconds. Export to PDF or CSV." },
  ];
  return (
    <section id="how" className="border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge variant="outline" className="mb-3">How it works</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From repo to test plan in three steps</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 relative">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="text-xs font-mono text-muted-foreground mb-3">STEP {String(i + 1).padStart(2, "0")}</div>
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg gradient-bg text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <Badge variant="outline" className="mb-3">Built for engineers</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">A workspace QA actually wants to live in</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Inspired by Linear's speed, Notion's flexibility, and Jira's structure — without the bloat.
            Keyboard-first, dark-by-default, and fast on every action.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Inline editing on every cell",
              "Powerful filters and saved views",
              "Bulk actions and keyboard shortcuts",
              "Real-time coverage scoring",
            ].map((x) => (
              <li key={x} className="flex items-center gap-3 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="h-3 w-3" />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border glass-strong p-6 shadow-elegant">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Projects", value: "12" },
              { label: "Test cases", value: "1,284" },
              { label: "Coverage", value: "87%" },
              { label: "Requirements", value: "240" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card/40 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-2xl font-bold gradient-text">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="text-xs text-muted-foreground mb-2">Coverage trend</div>
            <div className="flex items-end gap-1.5 h-24">
              {[40, 55, 48, 62, 70, 65, 78, 82, 79, 85, 87, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm gradient-bg opacity-80" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For solo QA engineers", features: ["1 project", "50 test cases / mo", "PDF export"], cta: "Start free", highlight: false },
    { name: "Team", price: "$29", desc: "For growing QA teams", features: ["Unlimited projects", "5,000 test cases / mo", "GitHub integration", "Priority support"], cta: "Start trial", highlight: true },
    { name: "Enterprise", price: "Custom", desc: "For large orgs", features: ["SSO & SAML", "Self-hosted option", "Dedicated CSM", "Audit logs"], cta: "Contact sales", highlight: false },
  ];
  return (
    <section id="pricing" className="border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge variant="outline" className="mb-3">Pricing</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, predictable pricing</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div key={t.name} className={`relative rounded-2xl border p-6 ${t.highlight ? "border-primary/50 bg-card shadow-elegant" : "border-border bg-card shadow-card"}`}>
              {t.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-bg px-3 py-0.5 text-xs font-medium text-primary-foreground">Most popular</div>}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t.price}</span>
                {t.price !== "Custom" && <span className="text-muted-foreground text-sm">/mo</span>}
              </div>
              <ul className="mt-6 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className={`mt-6 w-full ${t.highlight ? "gradient-bg text-primary-foreground" : ""}`} variant={t.highlight ? "default" : "outline"}>
                  {t.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "How does TestForge generate test cases?", a: "We combine your requirements with static analysis of your codebase to produce positive, negative, and edge test cases tailored to each module." },
    { q: "Do you store my source code?", a: "No. We analyze ephemerally and only persist the generated test cases and metadata. Source is never stored." },
    { q: "Can I export to my existing tools?", a: "Yes — PDF, CSV, and JSON exports work with Jira, TestRail, Xray, and any modern test management system." },
    { q: "Is there a free plan?", a: "Yes, the Free tier supports 1 project and 50 test cases per month forever." },
  ];
  return (
    <section id="faq" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked</h2>
        </div>
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6 shadow-card">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`i${i}`} className="border-border">
              <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container mx-auto px-4 pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16 text-center shadow-elegant">
        <div className="absolute inset-0 mesh-bg opacity-60 pointer-events-none" />
        <div className="relative">
          <Zap className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ship higher-quality software, faster</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Join thousands of QA engineers automating their test plans with TestForge AI.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="gradient-bg text-primary-foreground shadow-elegant h-12 px-6">
                Start free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app">
              <Button size="lg" variant="outline" className="h-12 px-6 glass">View live demo</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <Logo />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TestForge AI. Crafted for QA engineers.</p>
      </div>
    </footer>
  );
}
