#!/usr/bin/env node

const baseUrl =
  process.env.EXPO_PUBLIC_NKAP_API_URL;

if (!baseUrl) {
  console.error(
    'Missing EXPO_PUBLIC_NKAP_API_URL'
  );
  process.exit(1);
}

const url =
  `${baseUrl.replace(/\/+$/, '')}/api/v1/health/`;

fetch(url)
  .then(async (response) => {
    const text = await response.text();

    console.log(
      `HTTP ${response.status}`
    );
    console.log(text);

    if (!response.ok) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
