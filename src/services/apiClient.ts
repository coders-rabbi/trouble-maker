const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  return res.json();
}
