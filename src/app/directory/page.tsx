"use client";
import Footer from "../components/Footer";
import styles from "./page.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function DirectoryPage() {
  const { lang } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const provider = (process.env.NEXT_PUBLIC_MAP_PROVIDER || 'google').toLowerCase() === 'leaflet' ? 'leaflet' : 'google';
  const markerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const autoLocateOnceRef = useRef<boolean>(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const markersRef = useRef<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [professionals, setProfessionals] = useState<Array<{ id: string | number; name: string; city: string; country: string; category: string; lat?: number | null; lng?: number | null; distance?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  // Centralized API base (fallback to provided IP if env not set)
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  const copy: Record<string, {
    h1: string;
    sub: string;
    searchPlaceholder: string;
    searchAria: string;
    searchBtn: string;
    fitMap: string;
    selectAria: string;
    all: string; doctor: string; therapist: string; nutrition: string; dietitian: string; nutritionist: string; coach: string;
    count0: string; countN: string;
    emptyTitle: string; emptyDesc: string;
    mapAria: string; mapBadge: string;
    viewBtn: string; messageBtn: string;
    alertTitle: string; alertDesc: string; alertOpen: string;
  }> = {
    en: {
      h1: "Find Healthcare Professionals",
      sub: "Search our directory of verified professionals across Europe",
      searchPlaceholder: "Search by name, city, or country...",
      searchAria: "Search by name, city, or country",
      searchBtn: "Search",
      fitMap: "Fit Map",
      selectAria: "Filter by category",
      all: "All Categories", doctor: "Doctor", therapist: "Therapist", nutrition: "Nutrition", dietitian: "Dietitian", nutritionist: "Nutritionist", coach: "Health Coach",
      count0: "0 professionals found",
      countN: "{n} professionals found",
      emptyTitle: "No professionals found",
      emptyDesc: "Try adjusting your search criteria or clearing filters to see more results.",
      mapAria: "Map placeholder", mapBadge: "google",
      viewBtn: "View",
      messageBtn: "Message",
      alertTitle: "Health Assistant",
      alertDesc: "Unsure where to start? Get instant insights and suggestions.",
      alertOpen: "Open",
    },
    de: {
      h1: "Gesundheitsfachpersonen finden",
      sub: "Durchsuchen Sie unser Verzeichnis verifizierter Fachpersonen in Europa",
      searchPlaceholder: "Suche nach Name, Stadt oder Land...",
      searchAria: "Suche nach Name, Stadt oder Land",
      searchBtn: "Suchen",
      fitMap: "Karte anpassen",
      selectAria: "Nach Kategorie filtern",
      all: "Alle Kategorien", doctor: "Ärzt:in", therapist: "Therapeut:in", nutrition: "Ernährung", dietitian: "Diätolog:in", nutritionist: "Ernährungsberater:in", coach: "Health Coach",
      count0: "0 Fachpersonen gefunden",
      countN: "{n} Fachpersonen gefunden",
      emptyTitle: "Keine Fachpersonen gefunden",
      emptyDesc: "Passen Sie die Suche an oder setzen Sie Filter zurück, um mehr Ergebnisse zu sehen.",
      mapAria: "Kartenplatzhalter", mapBadge: "google",
      viewBtn: "Ansehen",
      messageBtn: "Nachricht",
      alertTitle: "Health Assistant",
      alertDesc: "Nicht sicher, wo Sie beginnen sollen? Erhalten Sie sofortige Einblicke und Vorschläge.",
      alertOpen: "Öffnen",
    },
    fr: {
      h1: "Trouver des professionnels de santé",
      sub: "Recherchez dans notre annuaire de professionnels vérifiés en Europe",
      searchPlaceholder: "Rechercher par nom, ville ou pays...",
      searchAria: "Rechercher par nom, ville ou pays",
      searchBtn: "Rechercher",
      fitMap: "Ajuster la carte",
      selectAria: "Filtrer par catégorie",
      all: "Toutes les catégories", doctor: "Médecin", therapist: "Thérapeute", nutrition: "Nutrition", dietitian: "Diététicien·ne", nutritionist: "Nutritionniste", coach: "Coach santé",
      count0: "0 professionnels trouvés",
      countN: "{n} professionnels trouvés",
      emptyTitle: "Aucun professionnel trouvé",
      emptyDesc: "Essayez de modifier vos critères ou de réinitialiser les filtres pour voir plus de résultats.",
      mapAria: "Espace réservé à la carte", mapBadge: "google",
      viewBtn: "Voir",
      messageBtn: "Message",
      alertTitle: "Assistant santé",
      alertDesc: "Vous ne savez pas par où commencer ? Obtenez des idées et des suggestions instantanées.",
      alertOpen: "Ouvrir",
    },
  };

  const t = copy[lang] ?? copy.en;

  // Helper: center map if API supports it
  const setMapTo = (lat: number, lng: number, zoom = 10) => {
    const map = mapRef.current; if (!map) return;
    // Google Maps instance
    if ((map as any).setCenter && (map as any).setZoom) {
      (map as any).setCenter({ lat, lng });
      (map as any).setZoom(zoom);
      return;
    }
    // Leaflet instance
    const L = (window as any).L;
    if (L && typeof (map as any).setView === 'function') {
      (map as any).setView([lat, lng], zoom);
    }
  };

  // Helper to load nearby profiles from backend (public endpoint)
  const loadNearby = async (lat: number, lon: number, radius = 50) => {
    try {
      setLoading(true);
      const url = `${apiBase}/profiles/nearby?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=${encodeURIComponent(radius)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Failed nearby');
      const arr = await res.json();
      const mapped = Array.isArray(arr) ? arr.map((p: any) => ({
        id: (p.id ?? p.profileId ?? p.userId ?? p._id),
        name: p.displayName || `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || '—',
        city: p.city || '',
        country: p.country || '',
        category: p.specialties || '',
        lat: typeof p.latitude === 'number' ? p.latitude : null,
        lng: typeof p.longitude === 'number' ? p.longitude : null,
        distance: typeof p.distance === 'number' ? p.distance : undefined,
      })) : [];
      setProfessionals(mapped);
    } catch {
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: try user's current location, fallback to Switzerland center
  useEffect(() => {
    let done = false;
    const fallback = () => { if (done) return; done = true; loadNearby(46.8182, 8.2275, 50); };
    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        autoLocateOnceRef.current = true;
        const to = setTimeout(fallback, 4000);
        navigator.geolocation.getCurrentPosition((pos) => {
          clearTimeout(to);
          if (done) return; done = true;
          const { latitude, longitude } = pos.coords || {} as any;
          if (typeof latitude === 'number' && typeof longitude === 'number') {
            loadNearby(latitude, longitude, 50);
            setMapTo(latitude, longitude, 10);
          } else {
            fallback();
          }
        }, () => { clearTimeout(to); fallback(); }, { enableHighAccuracy: true, timeout: 3500, maximumAge: 60000 });
      } else {
        fallback();
      }
    } catch { fallback(); }
  }, []);

  // Fetch a single profile by ID
  const loadProfileById = async (id: string | number) => {
    try {
      setDetailsLoading(true);
      setSelectedProfile(null);
      const res = await fetch(`${apiBase}/profiles/${encodeURIComponent(String(id))}`, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Failed profile');
      const p = await res.json();
      setSelectedProfile(p);
    } catch {
      setSelectedProfile(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filtered = professionals.filter((p) => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const name = (p as any)?.name ? String((p as any).name) : "";
    const city = (p as any)?.city ? String((p as any).city) : "";
    const country = (p as any)?.country ? String((p as any).country) : "";
    const cat = (p as any)?.category ? String((p as any).category) : "";
    const matchesLoc = loc ? (city.toLowerCase().includes(loc) || country.toLowerCase().includes(loc)) : true;
    const matchesText = !q || [name, city, country].some(v => v.toLowerCase().includes(q));
    const matchesCat = !category || cat === category;
    return matchesLoc && matchesText && matchesCat;
  });

  const countLabel = filtered.length === 0 ? t.count0 : (t.countN || t.count0).replace("{n}", String(filtered.length));

  // Load chosen map provider once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (provider === 'google') {
      const w = window as any;
      if (w.google && w.google.maps) { setGoogleReady(true); return; }
      const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps]");
      if (existing) { existing.addEventListener("load", () => setGoogleReady(true), { once: true }); return; }
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey ?? ""}&libraries=places`;
      script.async = true; script.defer = true; script.setAttribute("data-google-maps", "true");
      script.onload = () => setGoogleReady(true);
      document.body.appendChild(script);
    } else {
      // Leaflet via CDN
      const w = window as any;
      if (w.L) { setLeafletReady(true); return; }
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      css.crossOrigin = '';
      document.head.appendChild(css);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => setLeafletReady(true);
      document.body.appendChild(script);
    }
  }, [provider]);

  // Initialize map when ready (Google or Leaflet)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const centerLat = 46.8182, centerLng = 8.2275; // Switzerland
    if (provider === 'google') {
      if (!googleReady) return;
      const g = (window as any).google; if (!g || !g.maps) return;
      const map = new g.maps.Map(mapContainerRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 7,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      mapRef.current = map;
    } else {
      if (!leafletReady) return;
      const L = (window as any).L; if (!L) return;
      const map = L.map(mapContainerRef.current, { zoomControl: true, attributionControl: true });
      map.setView([centerLat, centerLng], 7);
      const mtKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
      const url = mtKey
        ? `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${mtKey}`
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = mtKey
        ? '&copy; <a href="https://www.maptiler.com/" target="_blank" rel="noreferrer">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      L.tileLayer(url, { maxZoom: 20, attribution }).addTo(map);
      mapRef.current = map;
    }
  }, [googleReady, leafletReady, provider]);

  // Auto-locate user on first load (secure contexts only)
  useEffect(() => {
    if (autoLocateOnceRef.current) return;
    const map = mapRef.current;
    if (!map) return;
    if (!navigator.geolocation) return;
    autoLocateOnceRef.current = true;
    const applyPos = (lat: number, lng: number, zoom = 12) => {
      if (provider === 'google') {
        const g = (window as any).google; if (!g || !g.maps) return;
        if (userMarkerRef.current) { userMarkerRef.current.setMap(null); }
        userMarkerRef.current = new g.maps.Marker({ position: { lat, lng }, map, title: 'You are here' });
        if (map.setCenter && map.setZoom) { map.setCenter({ lat, lng }); map.setZoom(zoom); }
      } else {
        const L = (window as any).L; if (!L) return;
        if (userMarkerRef.current) { try { userMarkerRef.current.remove(); } catch {} }
        userMarkerRef.current = L.marker([lat, lng]).addTo(map);
        if (typeof map.setView === 'function') { map.setView([lat, lng], zoom); }
      }
    };

    const opts: PositionOptions = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

    const getOnce = () => navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      // If very imprecise (>1000m), start with a wider zoom
      applyPos(lat, lng, accuracy && accuracy > 1000 ? 11 : 12);
      // Refine with a short watch
      try {
        const watchId = navigator.geolocation.watchPosition((p) => {
          const { latitude: la, longitude: lo, accuracy: ac } = p.coords;
          if (ac && ac < 200) { applyPos(la, lo, 13); navigator.geolocation.clearWatch(watchId); }
        }, () => {/* ignore */}, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
        // Stop refining after 20s regardless
        setTimeout(() => { try { navigator.geolocation.clearWatch(watchId); } catch {} }, 20000);
      } catch {}
    }, () => { /* silently ignore */ }, opts);

    try {
      // Use Permissions API when available to trigger prompt or handle denied
      if ((navigator as any).permissions && (navigator as any).permissions.query) {
        (navigator as any).permissions.query({ name: 'geolocation' as PermissionName }).then((status: any) => {
          if (status.state === 'granted' || status.state === 'prompt') { getOnce(); }
          // if denied, do nothing (fallback center remains)
        }).catch(() => { getOnce(); });
      } else {
        getOnce();
      }
    } catch {
      getOnce();
    }
  }, [googleReady, leafletReady, provider]);

  // Attach Google Places Autocomplete to search input (Google provider only)
  useEffect(() => {
    if (provider !== 'google') return;
    if (!googleReady) return;
    if (!searchInputRef.current) return;
    const g = (window as any).google; if (!g || !g.maps || !g.maps.places) return;
    const ac = new g.maps.places.Autocomplete(searchInputRef.current, { types: ['(cities)'] });
    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (!place || !place.geometry || !place.geometry.location) return;
      const map = mapRef.current; if (!map) return;
      map.setCenter(place.geometry.location);
      map.setZoom(10);
      if (markerRef.current) { markerRef.current.setMap(null); }
      markerRef.current = new g.maps.Marker({ position: place.geometry.location, map });
      // Fetch nearby based on geocoded location
      try {
        const la = place.geometry.location.lat();
        const lo = place.geometry.location.lng();
        if (typeof la === 'number' && typeof lo === 'number') { loadNearby(la, lo, 50); }
      } catch {}
      const comps = place.address_components || [];
      const getType = (type: string) => comps.find((c: any) => c.types.includes(type));
      const city = (getType('locality') || getType('postal_town') || getType('administrative_area_level_2'))?.long_name;
      const country = getType('country')?.long_name;
      const label = [city, country].filter(Boolean).join(', ');
      if (label) setLocation(label);
      if (place.formatted_address) setQuery(place.formatted_address);
    });
    return () => { if (listener && listener.remove) listener.remove(); };
  }, [googleReady, provider]);

  // Update markers for filtered results
  useEffect(() => {
    const map = mapRef.current;
    if (!map || filtered.length === undefined) return;
    // clear old markers
    if (provider === 'google') {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      const g = (window as any).google; if (!g || !g.maps) return;
      const bounds = new g.maps.LatLngBounds();
      let added = 0;
      filtered.forEach((p) => {
        const lat = typeof p.lat === 'number' ? p.lat : undefined;
        const lng = typeof p.lng === 'number' ? p.lng : undefined;
        if (typeof lat === 'number' && !Number.isNaN(lat) && typeof lng === 'number' && !Number.isNaN(lng)) {
          const m = new g.maps.Marker({ position: { lat, lng }, map, title: p.name });
          markersRef.current.push(m);
          bounds.extend(new g.maps.LatLng(lat, lng));
          added++;
        }
      });
      if (added > 0) { map.fitBounds(bounds); }
    } else {
      const L = (window as any).L; if (!L) return;
      markersRef.current.forEach(m => { try { m.remove(); } catch {} });
      markersRef.current = [];
      const group: any[] = [];
      filtered.forEach((p) => {
        const lat = typeof p.lat === 'number' ? p.lat : undefined;
        const lng = typeof p.lng === 'number' ? p.lng : undefined;
        if (typeof lat === 'number' && !Number.isNaN(lat) && typeof lng === 'number' && !Number.isNaN(lng)) {
          const m = L.marker([lat, lng]).addTo(map);
          m.bindPopup(`${p.name} — ${p.city}, ${p.country}`);
          markersRef.current.push(m);
          group.push([lat, lng]);
        }
      });
      if (group.length > 0) {
        const bounds = L.latLngBounds(group as any);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [filtered, provider]);

  const handleFitMap = () => {
    const map = mapRef.current;
    if (!map) return;
    if (provider === 'google' && map.setCenter && map.setZoom) {
      map.setCenter({ lat: 46.8182, lng: 8.2275 });
      map.setZoom(7);
    } else if (provider === 'leaflet' && typeof map.setView === 'function') {
      map.setView([46.8182, 8.2275], 7);
    }
  };
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    const map = mapRef.current; if (!map) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude; const lng = pos.coords.longitude;
      if (provider === 'google') {
        const g = (window as any).google; if (!g || !g.maps) return;
        if (userMarkerRef.current) { userMarkerRef.current.setMap(null); }
        userMarkerRef.current = new g.maps.Marker({ position: { lat, lng }, map, title: 'You are here' });
        if (map.setCenter && map.setZoom) { map.setCenter({ lat, lng }); map.setZoom(12); }
        // Load nearby for this position
        loadNearby(lat, lng, 50);
      } else {
        const L = (window as any).L; if (!L) return;
        if (userMarkerRef.current) { try { userMarkerRef.current.remove(); } catch {} }
        userMarkerRef.current = L.marker([lat, lng]).addTo(map);
        if (typeof map.setView === 'function') { map.setView([lat, lng], 12); }
        // Load nearby for this position
        loadNearby(lat, lng, 50);
      }
    }, (err) => {
      // silently ignore or log
      console.warn('Geolocation error', err);
    }, { enableHighAccuracy: true, timeout: 8000 });
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      geocodeAndCenter(query.trim());
    }
  };
  async function geocodeAndCenter(q: string) {
    if (!q) return;
    const map = mapRef.current;
    if (!map) return;
    try {
      if (provider === 'google') {
        const g = (window as any).google;
        if (!g || !g.maps) {
          // Fallback if Google isn't available: use generic geocoding (no dependency on Leaflet)
          // 1) Try MapTiler if key present
          const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
          if (key) {
            const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${key}&limit=1`;
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              const feature = data?.features?.[0];
              if (feature && Array.isArray(feature.center)) {
                const [lng, lat] = feature.center as [number, number];
                setMapTo(lat, lng, 10);
                // Marker only when Leaflet is active
                const L = (window as any).L;
                if (L && markerRef.current && typeof markerRef.current.remove === 'function') { try { markerRef.current.remove(); } catch {} }
                if (L && !((map as any).setCenter)) { markerRef.current = L.marker([lat, lng]).addTo(map); }
                await loadNearby(lat, lng, 50);
                const place = feature?.place_name as string | undefined; if (place) setLocation(place);
                return;
              }
            }
          }
          // 2) Fallback to Nominatim
          const nurl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
          const nres = await fetch(nurl, { headers: { 'Accept': 'application/json' } });
          if (nres.ok) {
            const ndata = await nres.json();
            const item = Array.isArray(ndata) ? ndata[0] : null;
            if (item && item.lat && item.lon) {
              const lat = parseFloat(item.lat), lng = parseFloat(item.lon);
              setMapTo(lat, lng, 10);
              const L = (window as any).L;
              if (L && markerRef.current && typeof markerRef.current.remove === 'function') { try { markerRef.current.remove(); } catch {} }
              if (L && !((map as any).setCenter)) { markerRef.current = L.marker([lat, lng]).addTo(map); }
              await loadNearby(lat, lng, 50);
              if (item.display_name) setLocation(item.display_name);
              return;
            }
          }
        } else {
          const geocoder = new g.maps.Geocoder();
          geocoder.geocode({ address: q }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              const loc = results[0].geometry.location; // LatLng
              map.setCenter(loc);
              map.setZoom(10);
              if (markerRef.current) { markerRef.current.setMap(null); }
              markerRef.current = new g.maps.Marker({ position: loc, map });
              try {
                const la = typeof loc.lat === 'function' ? loc.lat() : undefined;
                const lo = typeof loc.lng === 'function' ? loc.lng() : undefined;
                if (typeof la === 'number' && typeof lo === 'number') { loadNearby(la, lo, 50); }
              } catch {}
              const comps = results[0].address_components || [];
              const getType = (type: string) => comps.find((c: any) => c.types.includes(type));
              const city = (getType('locality') || getType('postal_town') || getType('administrative_area_level_2'))?.long_name;
              const country = (getType('country')?.long_name);
              const label = [city, country].filter(Boolean).join(', ');
              if (label) setLocation(label);
            }
          });
          return;
        }
      }
      {
        const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${key ?? ''}&limit=1`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const feature = data?.features?.[0];
          if (feature && Array.isArray(feature.center)) {
            const [lng, lat] = feature.center as [number, number];
            setMapTo(lat, lng, 10);
            const L = (window as any).L;
            if (L && markerRef.current && typeof markerRef.current.remove === 'function') { try { markerRef.current.remove(); } catch {} }
            if (L && !((map as any).setCenter)) { markerRef.current = L.marker([lat, lng]).addTo(map); }
            // Load nearby for this geocoded location
            loadNearby(lat, lng, 50);
            const place = feature?.place_name as string | undefined;
            if (place) setLocation(place);
            return;
          }
        }
        // Fallback to Nominatim (light usage only)
        const nurl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
        const nres = await fetch(nurl, { headers: { 'Accept': 'application/json' } });
        if (!nres.ok) return;
        const ndata = await nres.json();
        const item = Array.isArray(ndata) ? ndata[0] : null;
        if (item && item.lat && item.lon) {
          const lat = parseFloat(item.lat), lng = parseFloat(item.lon);
          setMapTo(lat, lng, 10);
          const L = (window as any).L;
          if (L && markerRef.current && typeof markerRef.current.remove === 'function') { try { markerRef.current.remove(); } catch {} }
          if (L && !((map as any).setCenter)) { markerRef.current = L.marker([lat, lng]).addTo(map); }
          // Load nearby for this geocoded location
          loadNearby(lat, lng, 50);
          const label = [item.display_name].filter(Boolean).join(', ');
          if (label) setLocation(label);
        }
      }
    } catch {}
  }
  return (
    <main className={styles.wrapper}>
      <div className="container">
        {/* Heading */}
        <header className={styles.header}>
          <h1>{t.h1}</h1>
          <p>{t.sub}</p>
        </header>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <input
              className={styles.search}
              type="text"
              placeholder={t.searchPlaceholder}
              aria-label={t.searchAria}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              ref={searchInputRef}
            />
          </div>
          <div className={styles.filters}>
            <button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className={`btn btn-primary btn-sm`} onClick={() => geocodeAndCenter(query.trim())} aria-label={t.searchAria}>
              {t.searchBtn}
            </button>
            <button className={`btn btn-light btn-sm ${styles.fitMap}`} onClick={handleFitMap}>{t.fitMap}</button>
            <select className={`form-select form-select-sm ${styles.select}`} aria-label={t.selectAria} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{t.all}</option>
              <option value="doctor">{t.doctor}</option>
              <option value="therapist">{t.therapist}</option>
              <option value="nutrition">{t.nutrition}</option>
              <option value="dietitian">{t.dietitian}</option>
              <option value="nutritionist">{t.nutritionist}</option>
              <option value="coach">{t.coach}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results + Map */}
      <section className={styles.resultsSection}>
        <div className="container">
          <div className="row g-0">
            {/* Left: results/empty state */}
            <div className="col-lg-4">
              <div className={styles.resultsPane}>
                <div className="alert alert-info d-flex justify-content-between align-items-center" role="status" style={{borderRadius:12}}>
                  <div>
                    <strong>{t.alertTitle}</strong>
                    <span className="ms-2 text-muted">{t.alertDesc}</span>
                  </div>
                  <a style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-sm btn-primary" href="https://ki.nutriteam.ch/?utm_source=nutriteam-network&utm_medium=directory&utm_campaign=ai-health" target="_blank" rel="noopener noreferrer">{t.alertOpen}</a>
                </div>
                <div className={styles.count}>{countLabel}</div>
                {/* Details panel */}
                {detailsLoading && (
                  <div className="alert alert-secondary" role="status" style={{borderRadius:12}}>Loading profile…</div>
                )}
                {selectedProfile && (
                  <div className="card mb-3" style={{borderRadius:12}}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title mb-1">{selectedProfile.displayName || (selectedProfile.user ? `${selectedProfile.user.firstName ?? ''} ${selectedProfile.user.lastName ?? ''}`.trim() : '')}</h5>
                          <div className="text-muted small">{[selectedProfile.specialties, selectedProfile.city, selectedProfile.country].filter(Boolean).join(' • ')}</div>
                        </div>
                        <a style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-sm btn-primary" href={`/portal/chat/${selectedProfile.id}`}>{t.messageBtn}</a>
                      </div>
                      {selectedProfile.bio ? (<p className="mt-2 mb-0">{selectedProfile.bio}</p>) : null}
                    </div>
                  </div>
                )}
                {filtered.length === 0 ? (
                  <div className={styles.empty}>
                    <div className={styles.pin} aria-hidden="true">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                    </div>
                    <h3>{t.emptyTitle}</h3>
                    <p>{t.emptyDesc}</p>
                  </div>
                ) : (
                  <ul className={styles.resultsList}>
                    {filtered.map((p) => (
                      <li key={p.id} className={styles.resultItem}>
                        <div>
                          <strong>{p.name}</strong>
                          <div className={styles.resultMeta}>{p.category}</div>
                        </div>
                        <div className="d-flex gap-2">
                          {(() => { const pid = (typeof p.id === 'number' || typeof p.id === 'string') ? Number(p.id) : NaN; const canView = Number.isFinite(pid); return canView ? (
                            <Link style={{color:"var(--brand-primary)", border: "1px solid var(--brand-primary)"}} href={`/profiles/${pid}`} className={`btn btn-sm btn-outline-primary ${styles.viewBtn}`}>{t.viewBtn}</Link>
                          ) : (
                            <button className="btn btn-sm btn-outline-secondary" disabled title="Profile ID unavailable">{t.viewBtn}</button>
                          ); })()}
                          <Link style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} href={`/portal/chat/${p.id}`} className="btn btn-sm btn-primary">{t.messageBtn}</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right: map placeholder */}
            <div className="col-lg-8">
              <div className={styles.map} role="img" aria-label={t.mapAria}>
                {/* Map container */}
                <div ref={mapContainerRef} style={{height:'100%', width:'100%'}} />
                {((provider === 'google' && !googleReady) || (provider === 'leaflet' && !leafletReady)) && (
                  <div className={styles.mapBadge}>{provider}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
       <Footer/>
    </main>
   
  );
}
