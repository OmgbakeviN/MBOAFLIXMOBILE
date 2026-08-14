import { getNkapApiBaseUrl } from '@/constants/api';

export type NkapRole = 'user' | 'assistant';

export interface NkapChatMessage {
  role: NkapRole;
  content: string;
}

export type NkapLanguage =
  | 'auto'
  | 'fr'
  | 'en';

interface NkapBackendSuccess {
  success: true;
  request_id?: string;
  reply: string;
  assistant?: {
    role: 'assistant';
    content: string;
  };
  model?: string;
}

interface NkapBackendError {
  success?: false;
  request_id?: string;
  error?:
    | {
        code?: string;
        message?: string;
        detail?: string;
      }
    | string
    | Record<string, unknown>;
  detail?: string;
}

type NkapBackendResponse =
  | NkapBackendSuccess
  | NkapBackendError;

const REQUEST_TIMEOUT_MS = 45_000;

function backendBaseUrl() {
  return getNkapApiBaseUrl();
}

function extractErrorMessage(
  data: NkapBackendError | undefined,
  status: number
) {
  if (!data) {
    return `Nkap backend request failed (${status}).`;
  }

  if (
    typeof data.error === 'object' &&
    data.error !== null &&
    'message' in data.error &&
    typeof data.error.message === 'string'
  ) {
    return data.error.message;
  }

  if (typeof data.error === 'string') {
    return data.error;
  }

  if (
    typeof data.detail === 'string' &&
    data.detail.trim()
  ) {
    return data.detail.trim();
  }

  if (status === 429) {
    return 'Nkap is receiving too many requests. Please try again shortly.';
  }

  if (status === 502) {
    return 'Nkap could not reach the AI provider. Please try again.';
  }

  if (status === 503) {
    return 'Nkap is temporarily unavailable.';
  }

  return `Nkap backend request failed (${status}).`;
}

export async function askNkap(
  conversation: NkapChatMessage[],
  language: NkapLanguage = 'auto'
): Promise<string> {
  const baseUrl = backendBaseUrl();

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/ai/chat/`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          messages:
            conversation.slice(-12),
          language,
        }),

        signal: controller.signal,
      }
    );

    let data:
      | NkapBackendResponse
      | undefined;

    try {
      data =
        (await response.json()) as NkapBackendResponse;
    } catch {
      data = undefined;
    }

    if (!response.ok) {
      throw new Error(
        extractErrorMessage(
          data as
            | NkapBackendError
            | undefined,
          response.status
        )
      );
    }

    if (
      !data ||
      !('success' in data) ||
      data.success !== true
    ) {
      throw new Error(
        extractErrorMessage(
          data as
            | NkapBackendError
            | undefined,
          response.status
        )
      );
    }

    const reply =
      data.reply?.trim();

    if (!reply) {
      throw new Error(
        'Nkap received an empty response.'
      );
    }

    return reply;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'Nkap took too long to respond. Please try again.'
      );
    }

    if (
      error instanceof TypeError
    ) {
      throw new Error(
        'Unable to reach the Nkap server. Check your internet connection and try again.'
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkNkapBackend(): Promise<boolean> {
  const baseUrl = backendBaseUrl();

  if (!baseUrl) {
    return false;
  }

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    8_000
  );

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/health/`,
      {
        method: 'GET',
        signal: controller.signal,
      }
    );

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
