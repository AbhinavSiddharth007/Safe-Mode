"use client";

import { useWarnings } from "@/hooks/use-warnings";
import { formatTimestamp } from "@/lib/utils";

export function EventsFeed() {
  const { warnings, errorMessage } = useWarnings();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Live feed
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Most recent warnings
            </h2>
          </div>
          <p className="text-sm text-slate-500">{warnings.length} warnings</p>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {/* {errorMessage} */}
          </p>
        ) : null}

        <div className="mt-5 space-y-3">
          {warnings.length ? (
            warnings.map((warning) => (
              <article
                key={warning.id}
                className="rounded-3xl border border-black/10 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {warning.message}
                    </h3>
                  </div>
                  <time className="text-right text-sm text-slate-500">
                    {formatTimestamp(warning.timestamp)}
                  </time>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {warning.latitude.toFixed(4)}, {warning.longitude.toFixed(4)}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No warnings yet. New reports will appear here instantly.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
