export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function parseJwtExpiresIn(value: string): string | number {
  // menerima angka detik ("3600") -> number
  // menerima format "1d", "12h", "30m" -> string
  const asNumber = Number(value);
  return Number.isFinite(asNumber) && value.trim() !== '' ? asNumber : value;
}
