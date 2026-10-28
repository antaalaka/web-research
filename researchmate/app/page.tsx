
"use client";

import ResearchAssistant from "./ResearchAssistant";
import { useState } from "react";

const features = [
  {
    id: "ideas",
    icon: "💡",
    title: "Research Idea Generator",
    description: "Discover research topics and develop new ideas.",
    color: "bg-amber-50",
  },
  {
    id: "gaps",
    icon: "🔎",
    title: "Research Gap Finder",
    description: "Identify potential gaps in existing research.",
    color: "bg-blue-50",
  },
  {
    id: "literature",
    icon: "📚",
    title: "Literature Review",
    description: "Find, summarize, and compare academic studies.",
    color: "bg-teal-50",
  },
  {
    id: "evidence",
    icon: "✅",
    title: "Citation & Evidence Finder",
    description: "Find academic sources relevant to your claims.",
    color: "bg-violet-50",
  },
  {
    id: "design",
    icon: "🧪",
    title: "Research Design Assistant",
    description: "Explore research methods and study designs.",
    color: "bg-pink-50",
  },
  {
    id: "writing",
    icon: "✍️",
    title: "Academic Writing Assistant",
    description: "Plan, draft, and improve academic writing.",
    color: "bg-indigo-50",
  },
];

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(
    null
  );

  const activeFeature = features.find(
    (feature) => feature.id === selectedFeature
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <div className="mb-3 text-4xl">📖</div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            ResearchMate <span className="text-blue-700">AI</span>
          </h1>
          <p className="mt-3 text-slate-600">
            Your Research Journey, From Idea to Publication
          </p>
          <p className="mt-6 text-lg font-medium">
            What would you like to work on today?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Choose a tool to get started with your research.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => setSelectedFeature(feature.id)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h2 className="text-lg font-bold group-hover:text-blue-700">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-700">
                Open feature →
              </p>
            </button>
          ))}
        </section>

        {activeFeature && (
          <section
            id="selected-feature"
            className="mt-10 scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Selected Research Tool
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {activeFeature.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {activeFeature.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {selectedFeature === "evidence" ? (
              <ResearchAssistant />
            ) : (
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="font-semibold">
                  This feature is planned for the next development stage.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The interface is ready to help organize your research
                  tools. We will build the functionality of this feature
                  step by step.
                </p>
              </div>
            )}
          </section>
        )}

        <footer className="mt-14 text-center text-xs text-slate-500">
          ResearchMate AI · Built to support evidence-based research
        </footer>
      </div>
    </main>
  );
}
