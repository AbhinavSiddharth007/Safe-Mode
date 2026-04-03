import "server-only";

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { Warning } from "@/lib/types";

const WARNINGS_COLLECTION = "events";

function mapDocumentToWarning(
  id: string,
  data: Record<string, unknown> | undefined,
): Warning {
  const location =
    data?.location && typeof data.location === "object"
      ? (data.location as { lat?: unknown; lng?: unknown })
      : undefined;

  return {
    id,
    message: String(data?.message ?? data?.title ?? "Untitled warning"),
    latitude: Number(data?.latitude ?? location?.lat ?? 0),
    longitude: Number(data?.longitude ?? location?.lng ?? 0),
    timestamp: Number(data?.timestamp ?? 0),
  };
}

export async function listWarningsFromFirestore() {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  const warningsQuery = query(
    collection(firestore, WARNINGS_COLLECTION),
    orderBy("timestamp", "desc"),
  );

  const snapshot = await getDocs(warningsQuery);

  return snapshot.docs.map((doc) =>
    mapDocumentToWarning(doc.id, doc.data() as Record<string, unknown>),
  );
}

export async function createWarningInFirestore(
  warning: Omit<Warning, "id" | "timestamp"> & { timestamp?: number },
) {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  const payload = {
    latitude: warning.latitude,
    longitude: warning.longitude,
    message: warning.message,
    timestamp: warning.timestamp ?? Date.now(),
  };

  const document = await addDoc(collection(firestore, WARNINGS_COLLECTION), payload);

  return {
    id: document.id,
    ...payload,
  } satisfies Warning;
}
