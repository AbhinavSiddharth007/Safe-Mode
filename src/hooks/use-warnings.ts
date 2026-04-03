"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getWarnings } from "@/lib/api";
import type { Warning } from "@/lib/types";

function getWarningsErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to load warnings.";
}

export function useWarnings() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(false);

  const refreshWarnings = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);

    try {
      const nextWarnings = await getWarnings();

      if (!isMountedRef.current) {
        return;
      }

      setWarnings(nextWarnings);
      setErrorMessage(null);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      setErrorMessage(getWarningsErrorMessage(error));
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void refreshWarnings();

    return () => {
      isMountedRef.current = false;
    };
  }, [refreshWarnings]);

  return {
    warnings,
    errorMessage,
    isLoading,
    refreshWarnings,
  };
}
