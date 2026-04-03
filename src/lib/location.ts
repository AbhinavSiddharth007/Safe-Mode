export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function parseLocationInput(value: string): Coordinates | null {
  const [latitudeValue, longitudeValue] = value
    .split(",")
    .map((part) => part.trim());

  if (!latitudeValue || !longitudeValue) {
    return null;
  }

  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return { latitude, longitude };
}

export function formatLocationInput(location: Coordinates) {
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
}
