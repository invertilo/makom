/**
 * Approximate Shabbat window for profile coordinates.
 * Uses local sunset estimate (hour-angle) so the app works without remote zmanim APIs.
 * Candle lighting ≈ 18 minutes before Friday sunset; Motzaei ≈ 42 minutes after Saturday sunset.
 */
export function isShabbatNow(
  lat: number,
  lng: number,
  now = new Date(),
): boolean {
  const local = toLocalApprox(now, lng);
  const weekday = local.getUTCDay();
  const sunsetHour = approxSunsetHour(lat, local);

  if (weekday === 5) {
    const candles = sunsetHour - 18 / 60;
    return localHours(local) >= candles;
  }
  if (weekday === 6) {
    const tzeit = sunsetHour + 42 / 60;
    return localHours(local) < tzeit;
  }
  return false;
}

function toLocalApprox(date: Date, lng: number): Date {
  const offsetMs = (lng / 15) * 60 * 60 * 1000;
  return new Date(date.getTime() + offsetMs);
}

function localHours(d: Date): number {
  return d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
}

function approxSunsetHour(lat: number, local: Date): number {
  const dayOfYear =
    Math.floor(
      (Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) -
        Date.UTC(local.getUTCFullYear(), 0, 0)) /
        86400000,
    );
  const decl =
    23.44 *
    Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81)) *
    (Math.PI / 180);
  const latRad = (lat * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.83 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));
  if (cosH >= 1) return 12;
  if (cosH <= -1) return 18;
  const hourAngle = (Math.acos(cosH) * 180) / Math.PI;
  return 12 + hourAngle / 15;
}
