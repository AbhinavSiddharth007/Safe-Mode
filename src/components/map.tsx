"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import type { Coordinates } from "@/lib/location";
import { getWarningMarkerColor } from "@/lib/warning-marker-color";
import type { WarningLocationGroup } from "@/lib/types";

const DEFAULT_CENTER: [number, number] = [-3.7038, 40.4168];
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapProps = {
  warningGroups: WarningLocationGroup[];
  className?: string;
  selectedLocation?: Coordinates | null;
  onLocationSelect?: (location: Coordinates) => void;
  onWarningSelect?: (warningGroup: WarningLocationGroup) => void;
};

export function Map({
  warningGroups = [],
  className,
  selectedLocation,
  onLocationSelect,
  onWarningSelect,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const selectedLocationMarkerRef = useRef<Marker | null>(null);
  const warningMarkersRef = useRef<Marker[]>([]);
  const [message, setMessage] = useState("Loading map...");
  const tokenMessage = MAPBOX_TOKEN
    ? null
    : "Map:.";
  const handleLocationSelect = useEffectEvent((location: Coordinates) => {
    onLocationSelect?.(location);
  });
  const handleWarningSelect = useEffectEvent(
    (warningGroup: WarningLocationGroup) => {
      onWarningSelect?.(warningGroup);
    },
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !MAPBOX_TOKEN) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 11,
      pitch: 55,
      antialias: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.on("load", () => {
      setMessage("Map ready. Click to choose a location.");
    });
    map.on("click", (event) => {
      handleLocationSelect({
        latitude: Number(event.lngLat.lat.toFixed(6)),
        longitude: Number(event.lngLat.lng.toFixed(6)),
      });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          map.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 13,
            essential: true,
          });
          userMarkerRef.current?.remove();
          userMarkerRef.current = new mapboxgl.Marker({ color: "#0f172a" })
            .setLngLat([coords.longitude, coords.latitude])
            .addTo(map);
          setMessage("Centered on your location.");
        },
        () => {
          setMessage("Using the default map center.");
        },
        { enableHighAccuracy: true },
      );
    }

    return () => {
      warningMarkersRef.current.forEach((marker) => marker.remove());
      warningMarkersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      selectedLocationMarkerRef.current?.remove();
      selectedLocationMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    warningMarkersRef.current.forEach((marker) => marker.remove());
    warningMarkersRef.current = [];

    for (const warningGroup of warningGroups) {
      const markerElement = document.createElement("button");
      markerElement.type = "button";
      markerElement.ariaLabel = `${warningGroup.totalWarnings} warnings near ${warningGroup.latitude.toFixed(3)}, ${warningGroup.longitude.toFixed(3)}`;
      markerElement.className =
        "flex min-h-7 min-w-7 items-center justify-center rounded-full border-2 border-white px-2 text-xs font-semibold text-slate-950 shadow-lg transition";
      markerElement.textContent = String(warningGroup.totalWarnings);
      markerElement.title = `${warningGroup.totalWarnings} warnings`;
      markerElement.style.backgroundColor = getWarningMarkerColor(
        warningGroup.totalWarnings,
      );
      markerElement.style.color =
        warningGroup.totalWarnings >= 10 ? "#ffffff" : "#0f172a";
      markerElement.style.cursor = onWarningSelect ? "pointer" : "default";

      if (onWarningSelect) {
        markerElement.classList.add("hover:scale-110");
        markerElement.addEventListener("click", (event) => {
          event.stopPropagation();
          handleWarningSelect(warningGroup);
        });
      }

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([warningGroup.longitude, warningGroup.latitude])
        .addTo(mapRef.current);

      warningMarkersRef.current.push(marker);
    }
  }, [warningGroups, onWarningSelect]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    selectedLocationMarkerRef.current?.remove();
    selectedLocationMarkerRef.current = null;

    if (!selectedLocation) {
      return;
    }

    selectedLocationMarkerRef.current = new mapboxgl.Marker({
      color: "#10b981",
    })
      .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
      .addTo(mapRef.current);
  }, [selectedLocation]);

  return (
    <section
      className={`relative w-full overflow-hidden ${className ?? "h-screen"}`}
    >
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-lg backdrop-blur">
        {tokenMessage ?? message}
      </div>
      {!MAPBOX_TOKEN ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 p-6 text-center text-white">
          
        </div>
      ) : null}
    </section>
  );
}
