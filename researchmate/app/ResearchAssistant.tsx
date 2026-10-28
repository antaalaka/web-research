
"use client";

import { useState } from "react";

type Article = {
  id: string;
  title: string;
  year: number | null;
  authors: string[];
  doi: string | null;
  url: string;
  isOpenAccess: boolean;
  openAccessUrl: string | null;
  abstract: string | null;
};

export default function ResearchAssistant() {
  const [claim, setClaim] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function searchArticles() {
    if (claim.trim().length < 5) {
      setError("Please enter a claim of at least 5 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setArticles([]);
    setSearched(false);

    try {
      const response = await fetch(
        `/api/evidence?claim=${encodeURIComponent(claim.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Article search failed.");
      }

      setArticles(data.articles || []);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full space-y-6 text-left">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Citation &amp; Evidence Finder
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter a research claim or finding to discover relevant
            scholarly articles.
          </p>
        </div>

        <label
          htmlFor="research-claim"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Your research claim
        </label>

        <textarea
          id="research-claim"
          value={claim}
          onChange={(event) => setClaim(event.target.value)}
          placeholder="Example: Digital formative assessment can improve student engagement."
          maxLength={1000}
          rows={4}
          className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-2 text-right text-xs text-slate-500">
          {claim.length}/1000 characters
        </div>

        <button
          type="button"
          onClick={searchArticles}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching scholarly articles..." : "Find Academic Sources"}
        </button>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>

      {loading && (
        <p className="text-center text-sm text-slate-600">
          Searching OpenAlex for relevant scholarly works...
        </p>
      )}

      {searched && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Search Results
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Found {articles.length} article
              {articles.length === 1 ? "" : "s"} from OpenAlex.
            </p>
          </div>

          {articles.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No articles were found for this search. Try a different
              claim or use more specific academic keywords.
            </p>
          )}

          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h4 className="font-bold leading-6 text-slate-900">
                {article.title}
              </h4>

              <p className="mt-2 text-sm text-slate-600">
                {article.authors.length > 0
                  ? article.authors.join(", ")
                  : "Author information unavailable"}
                {article.year ? ` · ${article.year}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {article.isOpenAccess && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Open Access
                  </span>
                )}

                {article.doi && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    DOI available
                  </span>
                )}
              </div>

              {article.abstract ? (
                <div className="mt-4">
                  <p className="mb-1 text-sm font-semibold text-slate-800">
                    Abstract
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    {article.abstract}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm italic text-slate-500">
                  Abstract is not available in the current OpenAlex
                  record.
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  View Article ↗
                </a>

                {article.openAccessUrl &&
                  article.openAccessUrl !== article.url && (
                    <a
                      href={article.openAccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      Open Access Full Text ↗
                    </a>
                  )}
              </div>
            </article>
          ))}

          <p className="text-xs leading-5 text-slate-500">
            Source: OpenAlex. Search relevance does not guarantee that
            an article supports your claim. Check the original source
            before using it as evidence.
          </p>
        </div>
      )}
    </section>
  );
}
