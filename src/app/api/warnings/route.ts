import { createWarningInFirestore, listWarningsFromFirestore } from "@/lib/events";

export const dynamic = "force-dynamic";

function isValidLatitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= -180 &&
    value <= 180
  );
}

export async function GET() {
  try {
    const warnings = await listWarningsFromFirestore();

    return Response.json(
      { warnings },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch warnings.";

    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      latitude?: number;
      longitude?: number;
      message?: string;
    };

    const message = body.message?.trim();
    const latitude = body.latitude;
    const longitude = body.longitude;

    if (!message || !isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      return Response.json(
        {
          error:
            "Request body must include valid latitude, longitude, and message values.",
        },
        { status: 400 },
      );
    }

    const warning = await createWarningInFirestore({
      latitude,
      longitude,
      message,
    });

    return Response.json({ warning }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create warning.";

    return Response.json({ error: message }, { status: 500 });
  }
}
