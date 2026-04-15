const metadataKeys = new Set([
  "_metadata",
  "metadata",
  "meta",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
]);

const isIdKey = (key: string): boolean =>
  key.toLowerCase() === "id" || key.toLowerCase().endsWith("id");

const isDateString = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) &&
    /[-T:\/]/.test(value) &&
    value.trim().length >= 6
  );
};

const normalizeValue = (key: string, value: unknown): unknown => {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(key, item));
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    if (isIdKey(key)) {
      return value;
    }

    if (isDateString(value)) {
      return new Date(value).toISOString();
    }

    return value;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    if (isIdKey(key)) {
      return String(value);
    }
    return value;
  }

  if (typeof value === "boolean") {
    if (isIdKey(key)) {
      return String(value);
    }
    return value;
  }

  if (typeof value === "object") {
    return normalizeResponse(value as Record<string, unknown>);
  }

  return value;
};

export function normalizeResponse(data: unknown): unknown {
  if (data === null || data === undefined) {
    return null;
  }

  if (Array.isArray(data)) {
    return data.map(normalizeResponse);
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (typeof data !== "object") {
    return data;
  }

  const normalized: Record<string, unknown> = {};

  const entries = Object.entries(data as Record<string, unknown>);

  for (const [rawKey, rawValue] of entries) {
    if (!rawKey || metadataKeys.has(rawKey)) {
      continue;
    }

    const key = rawKey.trim();
    const value = rawValue;

    if (metadataKeys.has(key)) {
      continue;
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      const nested = normalizeResponse(value as Record<string, unknown>);
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        for (const [nestedKey, nestedValue] of Object.entries(nested)) {
          normalized[`${key}_${nestedKey}`] = nestedValue;
        }
        continue;
      }
    }

    normalized[key] = normalizeValue(key, value);
  }

  return normalized;
}
