"use client";

import { useState } from "react";
import { addWarning } from "@/lib/api";
import { formatLocationInput, type Coordinates } from "@/lib/location";

type WarningFormProps = {
  selectedLocation: Coordinates | null;
  onLocationClear: () => void;
  onCreated?: () => void;
};

export function WarningForm({
  selectedLocation,
  onLocationClear,
  onCreated,
}: WarningFormProps) {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextMessage = message.trim();

    if (!nextMessage) {
      setErrorMessage("Enter a warning message before submitting.");
      return;
    }

    if (!selectedLocation) {
      setErrorMessage("Select a location on the map before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await addWarning({
        message: nextMessage,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      setMessage("");
      onLocationClear();
      onCreated?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit warning.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled = isSubmitting || !selectedLocation;

  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
            Submit warning
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Report a location-based warning
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            selectedLocation
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {selectedLocation ? "Location selected" : "Select map location"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Message
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Describe the warning for people near this location."
            rows={4}
            className="w-full resize-none rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <div className="block">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-700">
              Selected location
            </span>
            {selectedLocation ? (
              <button
                type="button"
                onClick={onLocationClear}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-950">
            {selectedLocation
              ? formatLocationInput(selectedLocation)
              : "Click a point on the map to attach a location."}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Warnings are submitted for the location you pick on the map.
          </p>
        </div>

        {errorMessage ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? "Submitting..." : "Submit warning"}
        </button>
      </form>
    </section>
  );
}
