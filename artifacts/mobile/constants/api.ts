export const DEFAULT_NKAP_API_URL =
  'https://kevinomgba.pythonanywhere.com';

export function getNkapApiBaseUrl() {
  const configuredUrl =
    process.env.EXPO_PUBLIC_NKAP_API_URL?.trim();

  return (
    configuredUrl ||
    DEFAULT_NKAP_API_URL
  ).replace(/\/+$/, '');
}
