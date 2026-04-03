import type { Warning, WarningLocationGroup } from "@/lib/types";

const LOCATION_PRECISION = 3;

function roundCoordinate(value: number) {
  return Number(value.toFixed(LOCATION_PRECISION));
}

export function groupWarningsByLocation(warnings: Warning[]) {
  const groups = new Map<string, WarningLocationGroup>();

  for (const warning of warnings) {
    const latitude = roundCoordinate(warning.latitude);
    const longitude = roundCoordinate(warning.longitude);
    const key = `${latitude.toFixed(LOCATION_PRECISION)},${longitude.toFixed(
      LOCATION_PRECISION,
    )}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.warnings.push(warning);
      existingGroup.totalWarnings = existingGroup.warnings.length;
      continue;
    }

    groups.set(key, {
      key,
      latitude,
      longitude,
      totalWarnings: 1,
      warnings: [warning],
    });
  }

  return Array.from(groups.values()).sort(
    (left, right) => right.totalWarnings - left.totalWarnings,
  );
}
