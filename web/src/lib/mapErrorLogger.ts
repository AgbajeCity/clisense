/**
 * Structured logger for map-related crashes & lifecycle events.
 * Captures: which leaflet action/component, the offending node payload,
 * and the underlying error — so we can diagnose without a stack trace.
 *
 * The most recent 20 events are persisted to localStorage so a page
 * refresh still surfaces what crashed.
 */
export interface MapErrorContext {
  source: "deployment-map" | "node-marker" | "fly-to" | "tile-layer" | "unknown";
  action?: string;
  nodeId?: string;
  nodeCount?: number;
  selectedId?: string | null;
  extra?: Record<string, unknown>;
}

export interface MapErrorPayload extends MapErrorContext {
  message: string;
  name: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent?: string;
}

const STORAGE_KEY = "clisense:mapErrors:v1";
const MAX_EVENTS = 20;

const safeStorage = (): Storage | null => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};

const loadFromStorage = (): MapErrorPayload[] => {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_EVENTS) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (events: MapErrorPayload[]) => {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    /* quota / disabled — silently ignore */
  }
};

let recent: MapErrorPayload[] = loadFromStorage();

type Listener = (events: readonly MapErrorPayload[]) => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l(recent));

export const subscribeMapErrors = (l: Listener) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const logMapError = (
  error: unknown,
  context: MapErrorContext,
  componentStack?: string
): MapErrorPayload => {
  const err = error instanceof Error ? error : new Error(String(error));
  const payload: MapErrorPayload = {
    ...context,
    message: err.message,
    name: err.name,
    stack: err.stack,
    componentStack,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  recent = [...recent, payload].slice(-MAX_EVENTS);
  saveToStorage(recent);
  emit();

  // eslint-disable-next-line no-console
  console.error("[map-error]", payload);
  return payload;
};

export const getRecentMapErrors = (): readonly MapErrorPayload[] => recent;
export const getLastMapError = (): MapErrorPayload | null =>
  recent.length ? recent[recent.length - 1] : null;

export const clearMapErrors = () => {
  recent = [];
  saveToStorage(recent);
  emit();
  const s = safeStorage();
  if (s) {
    try {
      s.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
};
