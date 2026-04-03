"use client";

import { useMemo, useState } from "react";
import { Map } from "@/components/map";
import { WarningForm } from "@/components/warning-form";
import { useWarnings } from "@/hooks/use-warnings";
import { groupWarningsByLocation } from "@/lib/group-warnings-by-location";
import type { Coordinates } from "@/lib/location";
import type { WarningLocationGroup } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

export function LiveEventsDashboard() {
  const [selectedWarningGroup, setSelectedWarningGroup] =
    useState<WarningLocationGroup | null>(
      null,
    );
  const [selectedLocation, setSelectedLocation] =
    useState<Coordinates | null>(null);
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const { warnings, errorMessage, isLoading, refreshWarnings } = useWarnings();
  const latestWarning = useMemo(() => warnings[0] ?? null, [warnings]);
  const warningGroups = useMemo(
    () => groupWarningsByLocation(warnings),
    [warnings],
  );
  const topRiskAreas = useMemo(
    () => warningGroups.slice(0, 5),
    [warningGroups],
  );
  const statusMessage =
    statusOverride ??
    (isLoading
      ? "Loading warnings..."
      : warnings.length
        ? `${warnings.length} warnings across ${warningGroups.length} locations`
        : "No warnings yet. Create the first one.");

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.7fr)_360px] lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">City map</h2>
            <p className="text-sm text-slate-600">
              {errorMessage ?? statusMessage}
            </p>
          </div>
          <p className="text-sm font-medium text-slate-500">Warnings</p>
        </div>

        <Map
          warningGroups={warningGroups}
          className="h-[62vh] min-h-[420px]"
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          onWarningSelect={setSelectedWarningGroup}
        />
      </section>

      <aside className="space-y-6">
        {selectedWarningGroup ? (
          <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Selected location
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {selectedWarningGroup.totalWarnings} warnings nearby
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedWarningGroup.latitude.toFixed(3)},{" "}
                  {selectedWarningGroup.longitude.toFixed(3)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWarningGroup(null)}
                className="text-sm text-slate-500 transition hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-500">
                  Reported messages
                </p>
                <p className="text-sm text-slate-500">
                  {selectedWarningGroup.totalWarnings} total
                </p>
              </div>

              <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
                {selectedWarningGroup.warnings.map((warning) => (
                  <article
                    key={warning.id}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3"
                  >
                    <p className="text-sm font-medium text-slate-950">
                      {warning.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatTimestamp(warning.timestamp)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <WarningForm
          selectedLocation={selectedLocation}
          onLocationClear={() => setSelectedLocation(null)}
          onCreated={async () => {
            setSelectedWarningGroup(null);
            setStatusOverride("Warning submitted. Refreshing...");
            await refreshWarnings();
            setStatusOverride(null);
          }}
        />

        <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Latest activity
          </p>
          {latestWarning ? (
            <div className="mt-3 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Warning
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                {latestWarning.message}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {formatTimestamp(latestWarning.timestamp)}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              The feed is empty right now. Add the first warning from the form above.
            </p>
          )}
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Top risk areas
          </p>
          {topRiskAreas.length ? (
            <div className="mt-3 space-y-3">
              {topRiskAreas.map((group, index) => (
                <button
                  type="button"
                  key={group.key}
                  onClick={() => setSelectedWarningGroup(group)}
                  className="w-full rounded-3xl bg-slate-50 p-4 text-left text-sm text-slate-600 transition hover:bg-slate-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        #{index + 1} risk area
                      </p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {group.latitude.toFixed(3)}, {group.longitude.toFixed(3)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Tap to inspect reported messages
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      {group.totalWarnings}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              The highest-risk locations will appear here as warnings accumulate.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}
