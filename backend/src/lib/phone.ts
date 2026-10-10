export function normalizeMacedonianPhone(value: string): string | null {
  if (!/^[+\d\s()-]+$/.test(value)) return null;
  const compact = value.replace(/[\s()-]/g, "");
  const national = compact.startsWith("+389") ? compact.slice(4)
    : compact.startsWith("00389") ? compact.slice(5)
    : compact.startsWith("0") ? compact.slice(1) : "";
  return /^[2347]\d{7}$/.test(national) ? `+389${national}` : null;
}
