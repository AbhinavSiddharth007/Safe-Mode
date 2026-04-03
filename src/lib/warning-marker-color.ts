const HIGH_CREDIBILITY_THRESHOLD = 10;

export const WARNING_MARKER_RED = "#ef4444";
export const WARNING_MARKER_YELLOW = "#eab308";

export function getWarningMarkerColor(totalWarnings: number) {
  return totalWarnings >= HIGH_CREDIBILITY_THRESHOLD
    ? WARNING_MARKER_RED
    : WARNING_MARKER_YELLOW;
}
