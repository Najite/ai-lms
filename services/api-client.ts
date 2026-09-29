import { AppError, InternalServerError, ValidationError } from "@/lib/errors/app-error";
import { HTTP_STATUS } from "@/constants";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path.startsWith("http") ? path : `${this.baseUrl}${path}`, "http://localhost");

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return path.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`;
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeoutMs = 15000, headers, ...init } = options;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: Record<string, unknown> = {};
        try {
          errorData = (await response.json()) as Record<string, unknown>;
        } catch {
          errorData = { raw: await response.text() };
        }

        if (response.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          throw new ValidationError(
            (errorData.message as string) || "Validation Error",
            errorData.errors as Record<string, string[]>
          );
        }

        throw new InternalServerError(
          (errorData.message as string) || `Request failed with status ${response.status}`,
          errorData
        );
      }

      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new InternalServerError(`Request to '${path}' timed out after ${timeoutMs}ms.`);
      }
      throw new InternalServerError(
        error instanceof Error ? error.message : "Unknown network error"
      );
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
