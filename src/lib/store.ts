import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "High" | "Medium" | "Low";
export type ReqStatus = "Draft" | "Approved" | "Implemented";
export type ProjectStatus = "Idle" | "Analyzing" | "Completed" | "Failed";
export type TestType = "positive" | "negative" | "edge";
export type TestStatus = "Pending" | "Passed" | "Failed";

export interface User {
  email: string;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  status: ProjectStatus;
  createdAt: string;
  lastAnalyzed?: string;
  testCaseCount: number;
  description?: string;
}

export interface Requirement {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  priority: Priority;
  status: ReqStatus;
  createdAt: string;
}

export interface TestCase {
  id: string;
  projectId?: string;
  module: string;
  title: string;
  steps: string;
  expected: string;
  type: TestType;
  priority: Priority;
  status: TestStatus;
  createdAt: string;
}

export interface Report {
  id: string;
  projectId: string;
  projectName: string;
  generatedAt: string;
  testCaseCount: number;
  coverage: number;
}

interface AppState {
  user: User | null;
  theme: "dark" | "light";
  projects: Project[];
  requirements: Requirement[];
  testCases: TestCase[];
  reports: Report[];
  setUser: (u: User | null) => void;
  setTheme: (t: "dark" | "light") => void;
  addProject: (p: Omit<Project, "id" | "createdAt" | "testCaseCount" | "status">) => Project;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addRequirement: (r: Omit<Requirement, "id" | "createdAt">) => void;
  updateRequirement: (id: string, r: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;
  addTestCases: (cases: Omit<TestCase, "id" | "createdAt">[]) => void;
  updateTestCase: (id: string, t: Partial<TestCase>) => void;
  deleteTestCase: (id: string) => void;
  addReport: (r: Omit<Report, "id">) => void;
  seed: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const seedData = () => {
  const projects: Project[] = [
    {
      id: "p1",
      name: "Checkout Service",
      repoUrl: "https://github.com/acme/checkout-service",
      status: "Completed",
      createdAt: now(),
      lastAnalyzed: now(),
      testCaseCount: 18,
      description: "Payment + cart microservice",
    },
    {
      id: "p2",
      name: "Auth Gateway",
      repoUrl: "https://github.com/acme/auth-gateway",
      status: "Completed",
      createdAt: now(),
      lastAnalyzed: now(),
      testCaseCount: 12,
      description: "OAuth2 + session management",
    },
    {
      id: "p3",
      name: "Notification Hub",
      repoUrl: "https://github.com/acme/notify-hub",
      status: "Idle",
      createdAt: now(),
      testCaseCount: 0,
      description: "Email & push delivery",
    },
  ];

  const requirements: Requirement[] = [
    { id: "r1", projectId: "p1", title: "User can checkout with credit card", description: "Support Visa, MC, Amex with 3DS verification", priority: "High", status: "Approved", createdAt: now() },
    { id: "r2", projectId: "p1", title: "Apply discount code at cart", description: "Validate coupon against active promotions", priority: "Medium", status: "Implemented", createdAt: now() },
    { id: "r3", projectId: "p2", title: "Login via Google OAuth", description: "Support PKCE flow with refresh tokens", priority: "High", status: "Implemented", createdAt: now() },
    { id: "r4", projectId: "p2", title: "Password reset via email", description: "Token expires in 30 minutes", priority: "Medium", status: "Approved", createdAt: now() },
    { id: "r5", projectId: "p1", title: "Tax calculation per region", description: "Honor EU VAT and US sales tax", priority: "High", status: "Draft", createdAt: now() },
    { id: "r6", projectId: "p3", title: "Email delivery retries", description: "Exponential backoff up to 5 attempts", priority: "Low", status: "Draft", createdAt: now() },
  ];

  const tcSamples: Omit<TestCase, "id" | "createdAt">[] = [
    { projectId: "p1", module: "Checkout", title: "Successful card payment", steps: "1. Add item to cart\n2. Enter valid card\n3. Submit", expected: "Order created and confirmation shown", type: "positive", priority: "High", status: "Passed" },
    { projectId: "p1", module: "Checkout", title: "Declined card shows error", steps: "1. Use test declined card\n2. Submit", expected: "Friendly error message displayed", type: "negative", priority: "High", status: "Pending" },
    { projectId: "p1", module: "Checkout", title: "Discount code applies", steps: "1. Add discount\n2. Verify total", expected: "Total reduced by discount value", type: "positive", priority: "Medium", status: "Passed" },
    { projectId: "p1", module: "Checkout", title: "Expired discount rejected", steps: "1. Apply expired code", expected: "Error: code expired", type: "negative", priority: "Medium", status: "Pending" },
    { projectId: "p1", module: "Cart", title: "Quantity zero removes item", steps: "1. Set qty 0", expected: "Item removed from cart", type: "edge", priority: "Low", status: "Passed" },
    { projectId: "p2", module: "Auth", title: "Login with valid credentials", steps: "1. Enter email/password\n2. Submit", expected: "Session created and redirect", type: "positive", priority: "High", status: "Passed" },
    { projectId: "p2", module: "Auth", title: "Login with wrong password", steps: "1. Enter wrong pw", expected: "Error shown, no session", type: "negative", priority: "High", status: "Failed" },
    { projectId: "p2", module: "Auth", title: "Reset email sent", steps: "1. Click forgot pw\n2. Enter email", expected: "Email queued", type: "positive", priority: "Medium", status: "Passed" },
    { projectId: "p2", module: "Auth", title: "Reset token expired", steps: "1. Use 31-min old token", expected: "Token invalid error", type: "edge", priority: "Medium", status: "Pending" },
  ];

  const testCases: TestCase[] = tcSamples.map((t) => ({ ...t, id: uid(), createdAt: now() }));

  const reports: Report[] = [
    { id: "rep1", projectId: "p1", projectName: "Checkout Service", generatedAt: now(), testCaseCount: 18, coverage: 87 },
    { id: "rep2", projectId: "p2", projectName: "Auth Gateway", generatedAt: now(), testCaseCount: 12, coverage: 74 },
  ];

  return { projects, requirements, testCases, reports };
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: "dark",
      projects: [],
      requirements: [],
      testCases: [],
      reports: [],
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      addProject: (p) => {
        const project: Project = { ...p, id: uid(), createdAt: now(), testCaseCount: 0, status: "Idle" };
        set({ projects: [project, ...get().projects] });
        return project;
      },
      updateProject: (id, p) =>
        set({ projects: get().projects.map((x) => (x.id === id ? { ...x, ...p } : x)) }),
      deleteProject: (id) => set({ projects: get().projects.filter((x) => x.id !== id) }),
      addRequirement: (r) =>
        set({ requirements: [{ ...r, id: uid(), createdAt: now() }, ...get().requirements] }),
      updateRequirement: (id, r) =>
        set({ requirements: get().requirements.map((x) => (x.id === id ? { ...x, ...r } : x)) }),
      deleteRequirement: (id) =>
        set({ requirements: get().requirements.filter((x) => x.id !== id) }),
      addTestCases: (cases) =>
        set({
          testCases: [
            ...cases.map((c) => ({ ...c, id: uid(), createdAt: now() })),
            ...get().testCases,
          ],
        }),
      updateTestCase: (id, t) =>
        set({ testCases: get().testCases.map((x) => (x.id === id ? { ...x, ...t } : x)) }),
      deleteTestCase: (id) => set({ testCases: get().testCases.filter((x) => x.id !== id) }),
      addReport: (r) => set({ reports: [{ ...r, id: uid() }, ...get().reports] }),
      seed: () => {
        if (get().projects.length > 0) return;
        const data = seedData();
        set(data);
      },
    }),
    { name: "testforge-store" }
  )
);

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
