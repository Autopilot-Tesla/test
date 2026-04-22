import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Palette,
  Globe2,
  LockKeyhole,
  MessageSquare,
  PenSquare,
  ShieldCheck,
  Sparkles,
  UserCog,
} from "lucide-react";

/**
 * Design philosophy for this file: Quiet luxury terminalism.
 * Use warm stone and smoked navy surfaces, an asymmetrical editorial layout,
 * long horizontal sightlines, refined typography, hairline dividers, and calm motion.
 * When editing, ask whether each change reinforces a premium publishing workstation.
 */

type DemoTab = "blog" | "ai" | "community" | "theme";

type FeedItem = {
  title: string;
  tag: string;
  excerpt: string;
};

const feed: FeedItem[] = [
  {
    title: "Designing a blog that feels more like an editorial terminal",
    tag: "Publishing",
    excerpt:
      "A static site can still feel premium if the interface treats spacing, motion, and hierarchy as part of the product rather than decoration.",
  },
  {
    title: "Why GitHub Pages needs a hosted service for global accounts",
    tag: "Architecture",
    excerpt:
      "Worldwide sign-in, remote profiles, and synchronized rooms cannot be stored securely in plain browser storage alone; they need a dedicated identity and data layer.",
  },
  {
    title: "A practical AI setup for drag-and-drop deployments",
    tag: "AI Integration",
    excerpt:
      "The safest static approach is to let the owner or each user bring a key locally, while public data stays behind rules in a hosted platform.",
  },
];

const demoTabs: { id: DemoTab; label: string }[] = [
  { id: "blog", label: "Owner posting" },
  { id: "ai", label: "AI workspace" },
  { id: "community", label: "Global chat" },
  { id: "theme", label: "Theme editor" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<DemoTab>("blog");
  const [themeMode, setThemeMode] = useState<"Obsidian" | "Bone" | "Sage">("Obsidian");

  const themePreview = useMemo(() => {
    if (themeMode === "Bone") {
      return {
        shell: "bg-[#efe7d8] text-[#2c2a27]",
        panel: "bg-white/75 text-[#242220] border-[#cdbfa9]/70",
        accent: "bg-[#b78b4a] text-white",
      };
    }

    if (themeMode === "Sage") {
      return {
        shell: "bg-[#172421] text-[#edf1ea]",
        panel: "bg-[#22312d]/80 text-[#edf1ea] border-[#60746c]/60",
        accent: "bg-[#b89f66] text-[#101514]",
      };
    }

    return {
      shell: "bg-[#0f1720] text-[#f4ede1]",
      panel: "bg-[#18202a]/82 text-[#f6efe4] border-white/10",
      accent: "bg-[#c6a46b] text-[#14110d]",
    };
  }, [themeMode]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(193,161,107,0.16),_transparent_22%),linear-gradient(180deg,_#111822_0%,_#0c1118_48%,_#090d12_100%)] text-[#f4ede1]">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-5 md:px-6 lg:px-8">
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[278px] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#10161f]/84 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur xl:flex">
          <div className="space-y-8">
            <div className="space-y-4 border-b border-white/10 pb-6">
              <p className="text-[0.7rem] uppercase tracking-[0.38em] text-[#c6a46b]">Yates Editorial OS</p>
              <div>
                <h1 className="font-serif text-3xl leading-none text-[#f8f1e6]">Quiet, controlled, and deployable.</h1>
                <p className="mt-3 text-sm leading-6 text-[#c9c2b6]">
                  A premium frontend architecture for a GitHub Pages blog, AI workspace, and global
                  community layer.
                </p>
              </div>
            </div>

            <nav className="space-y-3 text-sm text-[#d8d0c4]">
              {[
                "Architecture overview",
                "Static deployment rules",
                "Owner-only publishing",
                "AI model switching",
                "Global community rooms",
                "Theme editor",
              ].map((item) => (
                <div
                  key={item}
                  className="group flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 transition hover:border-[#c6a46b]/35 hover:bg-white/[0.05]"
                >
                  <span>{item}</span>
                  <ArrowRight className="h-4 w-4 text-[#8f877b] transition group-hover:translate-x-0.5 group-hover:text-[#d7b37a]" />
                </div>
              ))}
            </nav>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(198,164,107,0.13),rgba(255,255,255,0.02))] p-4">
            <p className="text-[0.7rem] uppercase tracking-[0.34em] text-[#d7b37a]">Constraint aware</p>
            <p className="mt-3 text-sm leading-6 text-[#ded5c8]">
              The working build stays static-first. Persistent accounts, rooms, and blog storage are
              delegated to a hosted data layer that can be configured entirely in the browser.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <section className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0f151d]/86 shadow-[0_35px_120px_rgba(0,0,0,0.38)] backdrop-blur">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-between px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#c6a46b]">Architecture overview first</p>
                  <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.98] text-[#f8f1e6] sm:text-6xl xl:text-7xl">
                    A GitHub Pages app that looks expensive and behaves realistically.
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-[#d4ccbf] sm:text-lg">
                    This build treats GitHub Pages as the delivery surface, not the database. The
                    interface is fully static-friendly, while authentication, synchronized chat,
                    permanent accounts, and owner-controlled posts are connected through a browser-safe
                    hosted backend.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Static shell", "Drag-and-drop deployable files with relative assets and no server process."],
                    ["Hosted identity", "Worldwide sign-in, account deletion, and owner-only permissions through policy rules."],
                    ["Bring-your-own AI", "Multiple model support through a user-supplied browser key instead of hard-coded secrets."],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-[#d7b37a]">{title}</p>
                      <p className="mt-3 text-sm leading-6 text-[#d3cabc]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[420px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,14,0.16),rgba(6,9,14,0.55))]" />
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663536972351/afqPZbnGrTWQoKbHf6nbro/ai-blog-hero-3CDZbbxGUA7FDDHsAy6prJ.webp"
                  alt="Premium editorial AI workspace hero"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="max-w-xl rounded-[1.8rem] border border-white/10 bg-[#10161f]/74 p-5 backdrop-blur-md">
                    <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#d7b37a]">Selected direction</p>
                    <p className="mt-3 text-lg leading-7 text-[#f7f0e5]">
                      Quiet luxury terminalism: editorial typography, frosted operational panels,
                      restrained metallic accents, and measured software motion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-[#101722]/86 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-7">
              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#c6a46b]">Feasible system map</p>
                  <h3 className="mt-3 font-serif text-3xl text-[#faf2e6]">What lives where</h3>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#d7cdbf]">
                  Static-first architecture
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: <PenSquare className="h-5 w-5" />,
                    title: "Blog publishing",
                    body: "The owner signs in through hosted auth. Posts, drafts, and metadata are stored remotely, while the frontend remains a static page bundle.",
                  },
                  {
                    icon: <Bot className="h-5 w-5" />,
                    title: "AI chat",
                    body: "Model switching is handled in-browser. The app uses a local API key field so secrets are not committed into GitHub Pages files.",
                  },
                  {
                    icon: <MessageSquare className="h-5 w-5" />,
                    title: "Community rooms",
                    body: "Chat rooms and presence indicators rely on a realtime-capable hosted database with policy rules instead of browser storage.",
                  },
                  {
                    icon: <Palette className="h-5 w-5" />,
                    title: "Theme editor",
                    body: "Visual customization persists per browser immediately and can also be written back to remote profile preferences for signed-in users.",
                  },
                ].map((item) => (
                  <article key={item.title} className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-[#c6a46b]/40">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c6a46b]/14 text-[#e2c28d]">
                      {item.icon}
                    </div>
                    <h4 className="mt-5 font-serif text-2xl text-[#f8f0e3]">{item.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-[#d6cdbf]">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#111924]/86 p-6 sm:p-7">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#c6a46b]">GitHub Pages reality check</p>
              <h3 className="mt-3 font-serif text-3xl text-[#faf2e6]">What the frontend can and cannot safely do</h3>
              <div className="mt-6 space-y-4">
                {[
                  ["Can do directly", "Render the full interface, store theme selections locally, fetch public data, and talk to browser-safe hosted services."],
                  ["Cannot do alone", "Securely keep a private AI provider key, own a database, or permanently authenticate users without a hosted identity layer."],
                  ["Best compromise", "Use a public project URL and anon key for data rules, then let the owner or each user enter their own AI key only in their browser."],
                ].map(([title, body], index) => (
                  <div key={title} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs text-[#d7b37a]">0{index + 1}</div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#efe4d2]">{title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#d7cebf]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#101720]/86 p-6 sm:p-7">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#c6a46b]">Interface study</p>
                <h3 className="mt-3 font-serif text-3xl text-[#faf2e6]">A preview of the operational shell</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {demoTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      activeTab === tab.id
                        ? "border-[#c6a46b]/60 bg-[#c6a46b]/16 text-[#f6efdf]"
                        : "border-white/10 bg-white/[0.03] text-[#cfc6b8] hover:border-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0e141c]">
                <img
                  src={
                    activeTab === "blog"
                      ? "https://d2xsxph8kpxj0f.cloudfront.net/310519663536972351/afqPZbnGrTWQoKbHf6nbro/blog-editor-visual-QKXYSKn7bemUz5ijeS6srQ.webp"
                      : activeTab === "community"
                        ? "https://d2xsxph8kpxj0f.cloudfront.net/310519663536972351/afqPZbnGrTWQoKbHf6nbro/community-chat-visual-6CwD7wBz7xMCEjxhDMterc.webp"
                        : "https://d2xsxph8kpxj0f.cloudfront.net/310519663536972351/afqPZbnGrTWQoKbHf6nbro/ai-blog-hero-3CDZbbxGUA7FDDHsAy6prJ.webp"
                  }
                  alt="Section illustration"
                  className="h-full min-h-[320px] w-full object-cover"
                />
              </div>

              <div className={`rounded-[1.8rem] border p-5 sm:p-6 ${themePreview.shell}`}>
                <div className={`rounded-[1.5rem] border p-4 sm:p-5 ${themePreview.panel}`}>
                  <div className="flex items-center justify-between gap-3 border-b border-current/10 pb-4">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.28em] opacity-70">Interactive shell</p>
                      <h4 className="mt-2 font-serif text-2xl">{activeTab === "blog" ? "Owner-only editor" : activeTab === "ai" ? "Model workspace" : activeTab === "community" ? "Global room view" : "Material theme controls"}</h4>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-medium ${themePreview.accent}`}>
                      {themeMode}
                    </div>
                  </div>

                  {activeTab === "blog" && (
                    <div className="mt-5 space-y-4">
                      <div className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] opacity-70">Role gate</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-medium">Only the owner can publish posts</p>
                            <p className="mt-1 text-sm leading-6 opacity-80">The visible publish button depends on an authenticated role check from the hosted profile table.</p>
                          </div>
                          <LockKeyhole className="h-5 w-5 opacity-80" />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {feed.map((item) => (
                          <article key={item.title} className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] opacity-70">{item.tag}</p>
                            <h5 className="mt-3 text-lg font-medium">{item.title}</h5>
                            <p className="mt-2 text-sm leading-6 opacity-80">{item.excerpt}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "ai" && (
                    <div className="mt-5 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {[
                          "openai/gpt-4.1-mini",
                          "anthropic/claude-3.7-sonnet",
                          "google/gemini-2.5-pro",
                          "meta-llama/llama-4-maverick",
                        ].map((model) => (
                          <div key={model} className="rounded-full border border-current/10 bg-black/10 px-3 py-2 text-xs opacity-90">
                            {model}
                          </div>
                        ))}
                      </div>
                      <div className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] opacity-70">Safe static approach</p>
                        <p className="mt-3 text-sm leading-7 opacity-85">
                          The owner enters an API key in a browser-only settings panel. The key is never baked into the files that go to GitHub Pages.
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                        <p className="text-sm leading-7 opacity-85">
                          “Summarize my draft, suggest a sharper title, and propose a closing paragraph in a calm editorial tone.”
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "community" && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] opacity-70">Rooms</p>
                        <div className="mt-3 space-y-3 text-sm">
                          {["Global", "Prompt Lab", "Founder Notes", "Late Night Build Club"].map((room) => (
                            <div key={room} className="rounded-xl border border-current/10 px-3 py-2">#{room}</div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] opacity-70">Realtime thread</p>
                        <div className="mt-3 space-y-3 text-sm leading-6 opacity-90">
                          <div className="rounded-xl bg-white/5 p-3">Mara: anyone testing multi-model prompting with editorial system prompts tonight?</div>
                          <div className="rounded-xl bg-white/5 p-3">Theo: yes, the owner post role is working; next step is room moderation and delete-account flow.</div>
                          <div className="rounded-xl bg-white/5 p-3">Ari: theme editor sync feels smooth. Storing profile preferences remotely is worth it.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "theme" && (
                    <div className="mt-5 space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {(["Obsidian", "Bone", "Sage"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setThemeMode(mode)}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              themeMode === mode ? "border-current/50 bg-white/10" : "border-current/10 bg-black/10"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          ["Background", themeMode === "Bone" ? "#efe7d8" : themeMode === "Sage" ? "#172421" : "#0f1720"],
                          ["Surface", themeMode === "Bone" ? "#ffffff" : themeMode === "Sage" ? "#22312d" : "#18202a"],
                          ["Accent", "#c6a46b"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[1.2rem] border border-current/10 bg-black/10 p-4">
                            <p className="text-xs uppercase tracking-[0.22em] opacity-70">{label}</p>
                            <p className="mt-3 text-lg font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm leading-7 opacity-85">
                        In the deployable static package, these values can be edited from a visual theme panel and saved immediately in browser storage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-[#101722]/86 p-6 sm:p-7">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#c6a46b]">Setup path</p>
              <h3 className="mt-3 font-serif text-3xl text-[#faf2e6]">A browser-only configuration workflow</h3>
              <div className="mt-6 space-y-4">
                {[
                  {
                    Icon: ShieldCheck,
                    title: "Create a hosted auth and database project",
                    body: "This stores accounts, posts, rooms, and deletion-safe identity records beyond one device.",
                  },
                  {
                    Icon: UserCog,
                    title: "Mark your account as the owner",
                    body: "The publishing UI only unlocks when your profile role is elevated through a policy-backed rule.",
                  },
                  {
                    Icon: Globe2,
                    title: "Paste the public project values into the config file",
                    body: "The public URL and anon key are safe to expose because access is controlled by row-level policies.",
                  },
                  {
                    Icon: Sparkles,
                    title: "Enter your AI key locally in the app",
                    body: "Keep model secrets out of GitHub Pages. The interface can switch models once a browser key exists.",
                  },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c6a46b]/14 text-[#e0c58f]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#f6efdf]">{title}</h4>
                        <p className="mt-2 text-sm leading-7 text-[#d5ccbe]">{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0f151d]/86 p-6 sm:p-7">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#c6a46b]">Implementation package</p>
              <h3 className="mt-3 font-serif text-3xl text-[#faf2e6]">What the delivered files include</h3>
              <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/10">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-white/[0.03] text-[#f4ecdf]">
                    <tr>
                      <th className="px-4 py-3 font-medium">File set</th>
                      <th className="px-4 py-3 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["index.html, styles.css, app.js", "The drag-and-drop static application that can be uploaded to GitHub Pages without any build step."],
                      ["config.example.js", "A clear place to paste the public hosted service values after creating the external project."],
                      ["supabase-policies.sql", "Database schema and security rules for accounts, posts, rooms, and messages."],
                      ["README_SETUP.md", "A thorough step-by-step manual covering API setup, security expectations, and deployment."],
                    ].map(([name, purpose]) => (
                      <tr key={name} className="border-t border-white/8 text-[#d7cebf]">
                        <td className="px-4 py-4 align-top font-medium text-[#f5ecdf]">{name}</td>
                        <td className="px-4 py-4 leading-7">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
