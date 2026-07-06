const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || '';

interface ApiErrorPayload {
  ok?: boolean;
  error?: string;
  code?: string;
  requestId?: string;
}

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  requestId?: string;
  path: string;

  constructor(path: string, status: number, message: string, code?: string, requestId?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.path = path;
  }
}

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return true;
}

function getErrorMessage(path: string, status: number, payload?: ApiErrorPayload): string {
  if (payload?.error) {
    return payload.error;
  }

  return `Request failed for ${path}: ${status}`;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(buildUrl(path), { signal });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const maybeJson = contentType.includes('application/json');

    let payload: ApiErrorPayload | undefined;

    if (maybeJson) {
      const parsed = (await response.json()) as unknown;
      if (isApiErrorPayload(parsed)) {
        payload = parsed;
      }
    }

    throw new ApiRequestError(
      path,
      response.status,
      getErrorMessage(path, response.status, payload),
      payload?.code,
      payload?.requestId,
    );
  }

  return (await response.json()) as T;
}

async function apiSend<TResponse>(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body == null ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const maybeJson = contentType.includes('application/json');

    let payload: ApiErrorPayload | undefined;

    if (maybeJson) {
      const parsed = (await response.json()) as unknown;
      if (isApiErrorPayload(parsed)) {
        payload = parsed;
      }
    }

    throw new ApiRequestError(
      path,
      response.status,
      getErrorMessage(path, response.status, payload),
      payload?.code,
      payload?.requestId,
    );
  }

  return (await response.json()) as TResponse;
}

export function apiPost<TResponse>(path: string, body: unknown, signal?: AbortSignal): Promise<TResponse> {
  return apiSend<TResponse>('POST', path, body, signal);
}

export function apiPatch<TResponse>(path: string, body: unknown, signal?: AbortSignal): Promise<TResponse> {
  return apiSend<TResponse>('PATCH', path, body, signal);
}

export function apiDelete<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
  return apiSend<TResponse>('DELETE', path, undefined, signal);
}
